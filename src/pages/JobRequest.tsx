import { useState } from "react";
import { JobRequestForm } from "@/components/forms/JobRequestForm";
import { JobRequestsTable, JobRequest } from "@/components/tables/JobRequestsTable";
import { ClientsTable, Client } from "@/components/tables/ClientsTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, List } from "lucide-react";

export default function JobRequestPage() {
  // Sample clients data
  const [clients] = useState<Client[]>([
    {
      id: "1",
      businessName: "Acme Corporation",
      abnAcn: "ABN123456789",
      businessAddress: "123 Business St, City, State 12345",
      postalAddress: "PO Box 123, City, State 12345",
      phone: "+1234567890",
      email: "info@acme.com",
      accountDeptContact: "Sarah Johnson",
      accountPhone: "+1234567891",
      fax: "+1234567892",
      accountEmail: "accounts@acme.com",
      invoiceEmail: "billing@acme.com",
      createdAt: new Date("2024-01-20"),
    },
    {
      id: "2", 
      businessName: "Tech Solutions Ltd",
      abnAcn: "ACN987654321",
      businessAddress: "456 Innovation Ave, Tech City, TC 67890",
      postalAddress: "456 Innovation Ave, Tech City, TC 67890",
      phone: "+0987654321",
      email: "contact@techsolutions.com",
      accountDeptContact: "Michael Chen",
      accountPhone: "+0987654322",
      accountEmail: "finance@techsolutions.com",
      invoiceEmail: "invoices@techsolutions.com",
      createdAt: new Date("2024-02-15"),
    },
    {
      id: "3",
      businessName: "Green Energy Co",
      abnAcn: "ABN555666777",
      businessAddress: "789 Sustainable Rd, Eco City, EC 11111",
      postalAddress: "789 Sustainable Rd, Eco City, EC 11111",
      phone: "+5556667777",
      email: "hello@greenenergy.com",
      accountDeptContact: "Emma Davis",
      accountPhone: "+5556667778",
      accountEmail: "accounting@greenenergy.com",
      invoiceEmail: "bills@greenenergy.com",
      createdAt: new Date("2024-03-10"),
    },
  ]);

  const [jobRequests, setJobRequests] = useState<JobRequest[]>([
    {
      id: "1",
      clientId: "1",
      clientName: "Acme Corporation",
      date: new Date("2024-03-15"),
      summary: "Website performance testing and optimization",
      detailsProvided: "Need comprehensive testing of website under high load conditions",
      comment: "Priority testing for upcoming product launch",
      dateTimeDay: new Date("2024-03-20T10:00:00"),
      divisionRules: "Standard web testing protocols",
      testRows: [
        {
          testMethod: "Load Testing",
          testSpec: "100 concurrent users",
          acceptanceSpec: "Response time < 2s",
          toTable: "Performance Results",
          testProcedure: "Gradual load increase",
          tech: "JMeter",
        },
        {
          testMethod: "Stress Testing",
          testSpec: "500 concurrent users",
          acceptanceSpec: "No system crash",
          toTable: "Stress Results",
          testProcedure: "Peak load simulation",
          tech: "LoadRunner",
        },
      ],
      status: "pending",
      createdAt: new Date("2024-03-12"),
    },
    {
      id: "2",
      clientId: "2",
      clientName: "Tech Solutions Ltd",
      date: new Date("2024-03-18"),
      summary: "Mobile application security audit",
      detailsProvided: "Complete security assessment of mobile banking application",
      dateTimeDay: new Date("2024-03-25T14:00:00"),
      divisionRules: "OWASP Mobile Security Guidelines",
      testRows: [
        {
          testMethod: "Penetration Testing",
          testSpec: "Full app coverage",
          acceptanceSpec: "No critical vulnerabilities",
          toTable: "Security Report",
          testProcedure: "Black box testing",
          tech: "Burp Suite",
        },
      ],
      status: "in-progress",
      createdAt: new Date("2024-03-16"),
    },
  ]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingJobRequest, setEditingJobRequest] = useState<JobRequest | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showClientSelection, setShowClientSelection] = useState(true);
  const [currentView, setCurrentView] = useState<"form" | "list">("form");

  const handleClientSelect = (client: Client) => {
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
              clients={clients} 
              onEdit={() => {}} 
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
              selectedClient={clients.find(c => c.id === editingJobRequest.clientId)}
              initialData={editingJobRequest}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}