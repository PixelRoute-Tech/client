import { useState } from "react";
import { Edit, Trash2, Search, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
// import { useToast } from "@/hooks/use-toast";
import { JobRequest } from "@/types/job.type";
import moment from "moment";

interface JobRequestsTableProps {
  jobRequests: JobRequest[];
  onEdit: (jobRequest: JobRequest) => void;
  onDelete: (jobRequest: JobRequest) => void;
  deleteLoading?:boolean
}

export function JobRequestsTable({ jobRequests, onEdit, onDelete,deleteLoading }: JobRequestsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  // const { toast } = useToast();

  const handleDelete = (jobRequest:JobRequest) => {
    onDelete(jobRequest);
    // toast({
    //   title: "Job request deleted",
    //   description: `Job request "${summary}" has been removed from the system.`,
    // });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary">Job Requests</CardTitle>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search job requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Test Methods</TableHead>
                <TableHead>Details provided</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobRequests?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    {searchTerm ? "No job requests found matching your search." : "No job requests available."}
                  </TableCell>
                </TableRow>
              ) : (
                jobRequests?.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono text-xs">#{job.id.substring(0, 8)}</TableCell>
                    <TableCell className="font-medium">{job.client?.business_name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{truncateText(job.summary)}</div>
                        {job.comment && (
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {truncateText(job.comment, 30)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {job.from_date ? format(new Date(job.from_date), "PPP") : "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due: {job.to_date ? format(new Date(job.to_date), "PPP") : "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {job?.test_methods?.length || 0} method{job?.test_methods?.length !== 1 ? 's' : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{truncateText(job.details_provided || "", 20)}</div>
                    </TableCell>
                    <TableCell>{moment(job.created_at).format("MMMM Do, YYYY")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                       
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(job)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button loading={deleteLoading} variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the job request
                                "{truncateText(job.id, 8)}" from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(job)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {jobRequests?.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <p>
              Showing {jobRequests?.length} of {jobRequests.length} job requests
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}