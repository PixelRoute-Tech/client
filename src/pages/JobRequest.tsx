import { useState } from "react";
import { JobRequestForm } from "@/components/forms/JobRequestForm";
import { JobRequestsTable, JobRequest } from "@/components/tables/JobRequestsTable";
import { ClientsTable } from "@/components/tables/ClientsTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, List, FileText } from "lucide-react";
import { WorksheetRenderer, WorksheetData } from "@/components/worksheet/WorksheetRenderer";
import { worksheetStorage } from "@/utils/worksheetStorage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClientType } from "@/types/client.type";
import { useNavigate } from "react-router-dom";
import routes from "@/routes/routeList";

export default function JobRequestPage() {
 
  const navigate = useNavigate()
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [editingJobRequest, setEditingJobRequest] = useState<JobRequest | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showClientSelection, setShowClientSelection] = useState(true);
  const [currentView, setCurrentView] = useState<"form" | "list">("form");
  const [selectedWorksheetId, setSelectedWorksheetId] = useState<string>("");
  const [worksheetData, setWorksheetData] = useState<WorksheetData>({});
  const activeWorksheets = worksheetStorage.getAll().filter(w => w.isActive);
  
  const handleClientSelect = (client: ClientType) => {
    setSelectedClient(client);
    setShowClientSelection(false);
  };

  const handleJobRequestSubmit = (jobRequestData: any) => {
    if (selectedClient) {
      const newJobRequest: JobRequest = {
        ...jobRequestData,
        id: Date.now().toString(),
        clientName: selectedClient.businessName,
        status: "pending" as const,
        createdAt: new Date(),
      };
      setJobRequests([...jobRequests, newJobRequest]);
    }
  };

  const handleEdit = (jobRequest: JobRequest) => {
    setEditingJobRequest(jobRequest);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (jobRequestData: any) => {
    if (editingJobRequest) {
      setJobRequests(jobRequests.map(job => 
        job.id === editingJobRequest.id 
          ? { ...editingJobRequest, ...jobRequestData }
          : job
      ));
      setIsEditDialogOpen(false);
      setEditingJobRequest(null);
    }
  };

  const handleDelete = (jobRequestId: string) => {
    setJobRequests(jobRequests.filter(job => job.id !== jobRequestId));
  };

  const backToClientSelection = () => {
    setSelectedClient(null);
    setShowClientSelection(true);
  };

  const handleClientEdit = (data:ClientType)=>{
     navigate(routes.clientOnBoarding,{state:data})
  }

  if (showClientSelection) {
    return (
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Request</h1>
            <p className="text-muted-foreground mt-2">Select a client to create a job request</p>
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={backToClientSelection}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Client Selection
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Request</h1>
            <p className="text-muted-foreground mt-2">Create and manage job requests</p>
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
            onClick={() => setCurrentView("list")}
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
            selectedClient={selectedClient || undefined}
          />

          {/* Worksheet Selection */}
          {activeWorksheets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <FileText className="h-5 w-5" />
                  Additional Worksheet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Worksheet (Optional)</Label>
                  <Select value={selectedWorksheetId} onValueChange={setSelectedWorksheetId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a worksheet" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeWorksheets.map((worksheet) => (
                        <SelectItem key={worksheet.id} value={worksheet.id}>
                          {worksheet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedWorksheetId && (
                  <WorksheetRenderer
                    worksheet={activeWorksheets.find(w => w.id === selectedWorksheetId)!}
                    data={worksheetData}
                    onChange={setWorksheetData}
                  />
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">{jobRequests.length}</div>
              <div className="text-sm text-muted-foreground">Total Job Requests</div>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {jobRequests.filter(j => j.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {jobRequests.filter(j => j.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>
      )}

      {currentView === "list" && (
        <JobRequestsTable 
          jobRequests={jobRequests} 
          onEdit={handleEdit}
          onDelete={handleDelete}
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
              selectedClient={[].find(c => c.id === editingJobRequest.clientId)}
              initialData={editingJobRequest}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

//   [
  //   {
  //     id: "1",
  //     clientId: "1",
  //     clientName: "Acme Corporation",
  //     date: new Date("2024-03-15"),
  //     summary: "Website performance testing and optimization",
  //     detailsProvided: "Need comprehensive testing of website under high load conditions",
  //     comment: "Priority testing for upcoming product launch",
  //     dateTimeDay: new Date("2024-03-20T10:00:00"),
  //     divisionRules: "Standard web testing protocols",
  //     testRows: [
  //       {
  //         testMethod: "Load Testing",
  //         testSpec: "100 concurrent users",
  //         acceptanceSpec: "Response time < 2s",
  //         toTable: "Performance Results",
  //         testProcedure: "Gradual load increase",
  //         tech: "JMeter",
  //       },
  //       {
  //         testMethod: "Stress Testing",
  //         testSpec: "500 concurrent users",
  //         acceptanceSpec: "No system crash",
  //         toTable: "Stress Results",
  //         testProcedure: "Peak load simulation",
  //         tech: "LoadRunner",
  //       },
  //     ],
  //     status: "pending",
  //     createdAt: new Date("2024-03-12"),
  //   },
  //   {
  //     id: "2",
  //     clientId: "2",
  //     clientName: "Tech Solutions Ltd",
  //     date: new Date("2024-03-18"),
  //     summary: "Mobile application security audit",
  //     detailsProvided: "Complete security assessment of mobile banking application",
  //     dateTimeDay: new Date("2024-03-25T14:00:00"),
  //     divisionRules: "OWASP Mobile Security Guidelines",
  //     testRows: [
  //       {
  //         testMethod: "Penetration Testing",
  //         testSpec: "Full app coverage",
  //         acceptanceSpec: "No critical vulnerabilities",
  //         toTable: "Security Report",
  //         testProcedure: "Black box testing",
  //         tech: "Burp Suite",
  //       },
  //     ],
  //     status: "in-progress",
  //     createdAt: new Date("2024-03-16"),
  //   },
  // ]