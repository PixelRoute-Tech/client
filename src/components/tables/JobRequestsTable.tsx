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

  const filteredJobRequests = jobRequests.filter(
    (job) =>
      job?.clientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      job?.summary?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      job?.divisionRules?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      job?.status?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

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
              {filteredJobRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    {searchTerm ? "No job requests found matching your search." : "No job requests available."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobRequests.map((job) => (
                  <TableRow key={job.jobId}>
                    <TableCell className="font-mono text-xs">#{job.jobId}</TableCell>
                    <TableCell className="font-medium">{job.clientName}</TableCell>
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
                          {format(job.startDate, "PPP")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due: {format(job.lastDate, "PPP")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {job?.testRows?.length} method{job?.testRows?.length !== 1 ? 's' : ''}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{truncateText(job.detailsProvided, 20)}</div>
                    </TableCell>
                    <TableCell>{moment(job.createdAt).format("MMMM Do, YYYY")}</TableCell>
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
                                "{truncateText(job.jobId, 30)}" from the system.
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
        
        {filteredJobRequests.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <p>
              Showing {filteredJobRequests.length} of {jobRequests.length} job requests
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}