import { useState } from "react";
import { RotateCw, Trash2, Eye } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getJobByUser, updateStatus } from "@/services/job.services";
import { JobStatus } from "@/types/job.type";

export default function JobListing() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch Data
  const { data: userJobList, refetch, isLoading } = useQuery({
    queryKey: ["joblistbyuserid", user?.id],
    queryFn: async () => getJobByUser(user?.id?.toString() || ""),
    select: (response: any) => {
      const flatList = Array.isArray(response?.data) ? response.data : [];
      return flatList.map((jr: any) => ({
        _id: jr.id,
        jobId: jr.purchase_order || "N/A",
        status: jr.status, // Keeping API raw status for easier logic
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
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["joblistbyuserid", user?.id] });
      toast({
        title: "Success",
        description: "Job status updated successfully",
      });
    },
    onError: (e: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: e?.message || "Failed to update status",
      });
    },
  });

  const handleStatusChange = (jobId: string, newStatus: JobStatus) => {
    statusChange({ id: jobId, status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return "secondary";
      case "IN_PROGRESS": return "default";
      case "COMPLETED": return "outline"; // Or a custom green success variant
      default: return "secondary";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">Manage and track your active jobs</p>
        </div>
        <Button disabled={isLoading} size="sm" onClick={() => refetch()}>
          Refresh <RotateCw className={`ml-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
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
              userJobList?.map((job: any) => (
                <TableRow key={job._id}>
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
                    <Select
                      disabled={isUpdating}
                      defaultValue={job.status}
                      onValueChange={(value) => handleStatusChange(job._id, value as JobStatus)}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}