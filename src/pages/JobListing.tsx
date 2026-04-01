import { useState } from "react";
import { RotateCw, Trash2, Eye, ShieldCheck } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getJobByUser, updateStatus } from "@/services/job.services";
import { JobStatus } from "@/types/job.type";
import { useNavigate } from "react-router-dom";
import { SkeletonLoader, skeletonConfigs } from "@/components/ui/skeleton-loader";

export default function JobListing() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<{ id: string, status: JobStatus } | null>(null);

  // 1. Fetch Data
  const { data: userJobList, refetch, isLoading } = useQuery({
    queryKey: ["joblistbyuserid", user?.id],
    queryFn: async () => getJobByUser(user?.id?.toString() || ""),
    select: (response: any) => {
      const flatList = Array.isArray(response?.data) ? response.data : [];
      return flatList.map((jr: any) => ({
        _id: jr.id,
        jobId: jr.purchase_order || "N/A",
        status: jr.status, 
        tech: jr.technician?.userName || "N/A",
        clientName: jr.client?.business_name || "Unknown Client",
        clientCode: jr.client?.client_code || "",
        fromDate: jr.from_date,
        toDate: jr.to_date,
        summary: jr.summary || "No summary provided",
      }));
    },
  });

  // 2. Status Change Mutation
  const { mutate: statusChange, isPending: isUpdating } = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["joblistbyuserid", user?.id] });
      toast({
        title: "Success",
        description: "Job status updated successfully",
      });
      setPendingStatus(null);
    },
    onError: (e: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: e?.message || "Failed to update status",
      });
      setPendingStatus(null);
    },
  });

  const handleStatusChange = (jobId: string, newStatus: JobStatus) => {
    if (newStatus === "SIGNED") {
      setPendingStatus({ id: jobId, status: newStatus });
      setConfirmOpen(true);
    } else {
      statusChange({ id: jobId, status: newStatus });
    }
  };

  const confirmSign = () => {
    if (pendingStatus) {
      statusChange(pendingStatus);
    }
    setConfirmOpen(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING": return "secondary";
      case "IN_PROGRESS": return "default";
      case "COMPLETED": return "outline";
      case "SIGNED": return "success"; // Assuming success variant exists or handled via custom CSS
      default: return "secondary";
    }
  };

  const isAdmin = user?.user_role?.name === "Admin";

  if (isLoading) {
    return <SkeletonLoader config={skeletonConfigs.table} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">Manage and track your active jobs</p>
        </div>
        <div className="flex gap-2">
          <Button disabled={isLoading} variant="outline" size="sm" onClick={() => refetch()}>
            Refresh <RotateCw className={`ml-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Job ID / PO</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading jobs...
                </TableCell>
              </TableRow>
            ) : userJobList?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No jobs found.
                </TableCell>
              </TableRow>
            ) : (
              userJobList?.map((job: any) => {
                const isSigned = job.status === "SIGNED";
                const canEdit = !isSigned || isAdmin;

                return (
                  <TableRow key={job._id} className={isSigned ? "opacity-90 bg-muted/20" : ""}>
                    <TableCell className="font-mono font-medium text-primary">
                      {job.jobId}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{job.clientName}</span>
                        <span className="text-xs text-muted-foreground">{job.clientCode}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {job.fromDate} <span className="text-muted-foreground">to</span> {job.toDate}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {job.summary}
                    </TableCell>
                    <TableCell>
                      {isSigned && !isAdmin ? (
                        <Badge variant="success" className="bg-success/20 text-success border-success/30 hover:bg-success/20 flex w-fit items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Signed
                        </Badge>
                      ) : (
                        <Select
                          disabled={isUpdating}
                          defaultValue={job.status}
                          onValueChange={(value) => handleStatusChange(job._id, value as JobStatus)}
                        >
                          <SelectTrigger className={`w-[140px] h-8 ${isSigned ? 'border-success text-success' : ''}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="SIGNED" className="text-success font-semibold">Sign Job</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => navigate(`/job-details/${job._id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        disabled={!canEdit}
                        title={!canEdit ? "Signed jobs can only be deleted by Admin" : ""}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Once a job is **SIGNED**, it cannot be modified or edited by any user. Only administrators will have permission to make changes after this point.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingStatus(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSign} className="bg-success hover:bg-success/90">
              Confirm Sign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}