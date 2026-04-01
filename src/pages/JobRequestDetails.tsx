import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, User, Clock, Briefcase, AlertCircle, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { JobRequest } from "@/types/job.type";
import { useQuery } from "@tanstack/react-query";
import { getJobDetails } from "@/services/job.services";


import { SkeletonLoader, skeletonConfigs } from "@/components/ui/skeleton-loader";

export default function JobRequestDetails() {
  const {id = ""} = useParams()
  const navigate = useNavigate();
  const {data:jobRequest, isLoading} = useQuery({queryKey:["jobdetailsdataforpage",id],queryFn:async ()=>getJobDetails(id)})

  if (isLoading) {
    return <SkeletonLoader config={skeletonConfigs.form} />;
  }

  if (!jobRequest?.data) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Job Request Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested job details could not be loaded.</p>
            <Button onClick={() => navigate("/job-request")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Job Requests
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      case "PENDING":
        return "outline";
      case "CANCELLED":
        return "destructive";
      case "SIGNED":
        return "success";
      default:
        return "outline";
    }
  };

  const isSigned = jobRequest?.data?.status === "SIGNED";

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Request Details</h1>
            <p className="text-muted-foreground mt-1">Complete information about this job request</p>
          </div>
        </div>
      <Badge variant={getStatusBadgeVariant(jobRequest?.data.status)} className={`text-base px-4 py-2 ${isSigned ? 'bg-success/20 text-success border-success/30' : ''}`}>
        {isSigned && <ShieldCheck className="h-4 w-4 mr-2" />}
        {jobRequest?.data.status?.charAt(0).toUpperCase() + jobRequest?.data.status?.slice(1).replace('_', ' ')}
      </Badge>
      </div>

      {/* Client and Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Briefcase className="h-5 w-5" />
            Job Request Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium">Client Name</span>
              </div>
              <p className="text-lg font-semibold">{jobRequest?.data.client?.business_name || "N/A"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Request Date</span>
              </div>
              <p className="text-lg">{jobRequest?.data.from_date ? format(new Date(jobRequest.data.from_date), "PPP") : "N/A"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Scheduled Date & Time</span>
              </div>
              <p className="text-lg">{jobRequest?.data.to_date ? format(new Date(jobRequest.data.to_date), "PPP") : "N/A"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Created On</span>
              </div>
              <p className="text-lg">{jobRequest?.data.created_at ? format(new Date(jobRequest.data.created_at), "PPP") : "N/A"}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Summary</span>
            </div>
            <p className="text-base leading-relaxed">{jobRequest?.data.summary}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Details Provided</span>
            </div>
            <p className="text-base leading-relaxed">{jobRequest?.data.details_provided || "No details provided"}</p>
          </div>

          {jobRequest?.data.comment && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Additional Comments</span>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-base leading-relaxed">{jobRequest?.data.comment}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Methods Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Test Methods</CardTitle>
          <CardDescription>
            {jobRequest?.data.test_methods?.length || 0} test method{jobRequest?.data.test_methods?.length !== 1 ? 's' : ''} configured for this job request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Test Method</TableHead>
                  <TableHead>Test Specification</TableHead>
                  <TableHead>Acceptance Spec</TableHead>
                  <TableHead>To Table</TableHead>
                  <TableHead>Test Procedure</TableHead>
                  <TableHead>Technician</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobRequest?.data.test_methods?.map((test: any) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.worksheetForm?.name || "N/A"}</TableCell>
                    <TableCell>{test.spec || "N/A"}</TableCell>
                    <TableCell>{test.acceptance || "N/A"}</TableCell>
                    <TableCell>{test.to_table || "N/A"}</TableCell>
                    <TableCell>{test.procedure || "N/A"}</TableCell>
                    <TableCell>
                      {test.assignedUser ? `${test.assignedUser.first_name} ${test.assignedUser.last_name}` : "Unassigned"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}