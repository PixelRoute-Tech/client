import { useEffect, useState } from "react";
import {
  JobRequestForm,
  JobRequestFormData,
} from "@/components/forms/JobRequestForm";
import { JobRequestsTable } from "@/components/tables/JobRequestsTable";
import { ClientsTable } from "@/components/tables/ClientsTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, List, FileText } from "lucide-react";
import { WorksheetData } from "@/components/worksheet/WorksheetRenderer";
import { ClientType } from "@/types/client.type";
import { useNavigate } from "react-router-dom";
import routes from "@/routes/routeList";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/client.services";
import moment from "moment";
import { JobRequest } from "@/types/job.type";
import { getJobRequests, deleteJobRequest, getJobDetails } from "@/services/job.services";
import { getWorkSheetslList } from "@/services/worksheet.services";
import { useToast } from "@/hooks/use-toast";
import { SkeletonLoader, skeletonConfigs } from "@/components/ui/skeleton-loader";

export default function JobRequestPage() {
  const [clientQueryParams, setClientQueryParams] = useState({
    skip: 0,
    take: 10,
  });

  const { data: clientsResponse, refetch, isFetching: isClientsLoading } = useQuery({
    queryKey: ["fetchclientsinjobrequest", clientQueryParams],
    queryFn: () => getClients(clientQueryParams.skip, clientQueryParams.take),
    refetchOnWindowFocus: false,
  });

  const clients = clientsResponse?.data?.data || [];
  const totalClientsCount = clientsResponse?.data?.count || 0;
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [editingJobRequest, setEditingJobRequest] = useState<JobRequest | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showClientSelection, setShowClientSelection] = useState(true);
  const [currentView, setCurrentView] = useState<"form" | "list" | "edit">(
    "list"
  );

  const { data: jobRequests, refetch: jobRequestRefetch } = useQuery({
    queryKey: ["jobrequestlist", selectedClient],
    queryFn: async () => await getJobRequests(selectedClient?.id.toString()),
    enabled: Boolean(selectedClient?.id),
    refetchOnWindowFocus: false,
  });

  const { data: jobDetails, isFetching: isJobDetailsLoading } = useQuery({
    queryKey: ["jobrequestdetails", editingJobRequest?.id],
    queryFn: async () => await getJobDetails(editingJobRequest?.id?.toString() || ""),
    enabled: Boolean(editingJobRequest?.id && currentView === "edit"),
    refetchOnWindowFocus: false,
  });

  const { mutate: deleteJob, isPending: deletePending } = useMutation({
    mutationFn: deleteJobRequest,
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Deleted successfully",
          description: `Job request "${result.data?.id?.substring(0, 8)}" deleted successfully`,
          className: "bg-green-500 text-white",
        });
        jobRequestRefetch();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete job request",
        className: "bg-red-500 text-white",
      });
    },
  });

  const handleClientSelect = (client: ClientType) => {
    setSelectedClient(client);
    setShowClientSelection(false);
  };

  const handleJobRequestSubmit = (jobRequestData: any) => {
    setIsEditDialogOpen(false);
    setEditingJobRequest(null);
    refetch();
    jobRequestRefetch();
    setCurrentView("list");
  };

  const handleNewClick = () => {
    setCurrentView("form");
    setEditingJobRequest(null);
    setIsEditDialogOpen(false);
  };

  const handleEdit = (jobRequest: JobRequest) => {
    setCurrentView("edit");
    setEditingJobRequest(jobRequest);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (jobRequestData: any) => {
    setIsEditDialogOpen(false);
    setEditingJobRequest(null);
    refetch();
    jobRequestRefetch();
    setCurrentView("list");
  };

  const handleDelete = (jobRequest: JobRequest) => {
    if (jobRequest.id) {
      deleteJob(jobRequest.id);
    }
  };

  const backToClientSelection = () => {
    setSelectedClient(null);
    setShowClientSelection(true);
    setIsEditDialogOpen(false);
    setEditingJobRequest(null);
    setCurrentView("list");
  };

  const handleClientEdit = (data: ClientType) => {
    navigate(routes.clientOnBoarding, { state: data });
  };

  useEffect(() => {
    return () => {
      setIsEditDialogOpen(false);
      setEditingJobRequest(null);
      setCurrentView("list");
    };
  }, []);

  if (showClientSelection) {
    return (
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Request</h1>
            <p className="text-muted-foreground mt-2">
              Select a client to create a job request
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Select Client</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Choose a client from the list below to create a new job request.
            </p>
            <ClientsTable
              clients={clients}
              totalCount={totalClientsCount}
              loading={isClientsLoading}
              onEdit={handleClientEdit}
              onDelete={() => {}}
              onSelect={handleClientSelect}
              queryParams={clientQueryParams}
              setQueryParams={setClientQueryParams}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={backToClientSelection}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Client Selection
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Request</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage job requests
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={currentView === "form" ? "default" : "outline"}
            onClick={handleNewClick}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Request
          </Button>
          <Button
            variant={currentView === "list" ? "default" : "outline"}
            onClick={() => {
              setCurrentView("list"); jobRequestRefetch();
            }}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            View Requests
          </Button>
        </div>
      </div>

      {(currentView === "form" || currentView === "edit") && (
        <div className="space-y-8">
          {currentView === "form" ? (
            <JobRequestForm
              onSubmit={handleJobRequestSubmit}
              selectedClient={selectedClient ? { ...selectedClient } : undefined}
            />
          ) : currentView === "edit" ? (
            isJobDetailsLoading ? (
               <SkeletonLoader config={skeletonConfigs.form} />
            ) : jobDetails?.data ? (
              <JobRequestForm
                onSubmit={handleEditSubmit}
                selectedClient={selectedClient ? { ...selectedClient } : undefined}
                initialData={{ ...jobDetails.data }}
                isEditing={true}
              />
            ) : (
               <div className="flex justify-center p-8 text-red-500">Failed to load job details.</div>
            )
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">
                {jobRequests?.data?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Job Requests
              </div>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  jobRequests?.data?.filter((j) => j.status?.toLowerCase() === "pending")
                    .length || 0
                }
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {
                  jobRequests?.data?.filter((j) => j.status?.toLowerCase() === "completed")
                    .length || 0
                }
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>
      )}

      {currentView === "list" && (
        <JobRequestsTable
          jobRequests={jobRequests?.data || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteLoading={deletePending}
        />
      )}

      {/* <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Request</DialogTitle>
          </DialogHeader>
          {editingJobRequest && (
            <JobRequestForm
              onSubmit={handleEditSubmit}
              selectedClient={selectedClient}
              initialData={editingJobRequest}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
