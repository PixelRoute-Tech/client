import { useState } from "react";
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
import {
  WorksheetData,
} from "@/components/worksheet/WorksheetRenderer";
import { ClientType } from "@/types/client.type";
import { useNavigate } from "react-router-dom";
import routes from "@/routes/routeList";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/client.services";
import moment from "moment";
import { JobRequest } from "@/types/job.type";
import { getJobRequests, deleteJobRequest} from "@/services/job.services";
import { getWorkSheetslList } from "@/services/worksheet.services";
import { useToast } from "@/hooks/use-toast";


export default function JobRequestPage() {
  const { data: clients, refetch } = useQuery({
    queryKey: ["fetchclientsinjobrequest"],
    queryFn: getClients,
    refetchOnWindowFocus: false,
  });
  const {toast} = useToast()
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [editingJobRequest, setEditingJobRequest] = useState<JobRequest | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showClientSelection, setShowClientSelection] = useState(true);
  const [currentView, setCurrentView] = useState<"form" | "list">("list");
  
  const {data: jobRequests,refetch:jobRequestRefetch} = useQuery({
    queryKey: ["jobrequestlist", selectedClient],
    queryFn: async () => await getJobRequests(selectedClient?.clientId),
    enabled:Boolean(selectedClient?.clientId),
    refetchOnWindowFocus:false
  });

  const {mutate:deleteJob,isPending:deletePending} = useMutation({mutationFn:deleteJobRequest,onSuccess:(result)=>{
      if(result.success){
         toast({
           title:"Deleted successfully",
           description:`Job request "${result.data.jobId}" deleted successfully`,
           className:"bg-green-500 text-white"
         })
         jobRequestRefetch()
      }else{
         toast({
           title:"Deleted successfully",
           description:`Job request "${result.data.jobId}" deleted successfully`
         })
      }
  }})

  const handleClientSelect = (client: ClientType) => {
    setSelectedClient(client);
    setShowClientSelection(false);
  };

  const handleJobRequestSubmit = (jobRequestData: any) => {
     jobRequestRefetch()
  };

  const handleEdit = (jobRequest: JobRequest) => {
    setEditingJobRequest(jobRequest);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (jobRequestData: any) => {
      setIsEditDialogOpen(false);
      setEditingJobRequest(null);
      refetch()
      jobRequestRefetch()
  };

  const handleDelete = (jobRequest: JobRequest) => {
      console.log("jobRequest",jobRequest) 
      deleteJob(jobRequest._id)
  };

  const backToClientSelection = () => {
    setSelectedClient(null);
    setShowClientSelection(true);
  };

  const handleClientEdit = (data: ClientType) => {
    navigate(routes.clientOnBoarding, { state: data });
  };

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
              clients={clients?.data || []}
              onEdit={handleClientEdit}
              onDelete={() => {}}
              onSelect={handleClientSelect}
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
            onClick={() => setCurrentView("form")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Request
          </Button>
          <Button
            variant={currentView === "list" ? "default" : "outline"}
            onClick={() => {setCurrentView("list"),jobRequestRefetch()}}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            View Requests
          </Button>
        </div>
      </div>

      {currentView === "form" && (
        <div className="space-y-8">
          <JobRequestForm
            onSubmit={handleJobRequestSubmit}
            selectedClient={
              selectedClient
                ? { ...selectedClient}
                : undefined
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">
                {jobRequests?.data?.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Job Requests
              </div>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {jobRequests?.data?.filter((j) => j.status === "Pending").length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {jobRequests?.data?.filter((j) => j.status === "Completed").length}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
      </Dialog>
    </div>
  );
}
