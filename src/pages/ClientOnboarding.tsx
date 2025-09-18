import { useState } from "react";
import { ClientForm } from "@/components/forms/ClientForm";
import { ClientsTable, Client } from "@/components/tables/ClientsTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";

export default function ClientOnboarding() {
  const [clients, setClients] = useState<Client[]>([
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

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"form" | "list">("form");

  const handleSubmit = (clientData: Omit<Client, "id" | "createdAt">) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setClients([...clients, newClient]);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (clientData: Omit<Client, "id" | "createdAt">) => {
    if (editingClient) {
      setClients(clients.map(client => 
        client.id === editingClient.id 
          ? { ...editingClient, ...clientData }
          : client
      ));
      setIsEditDialogOpen(false);
      setEditingClient(null);
    }
  };

  const handleDelete = (clientId: string) => {
    setClients(clients.filter(client => client.id !== clientId));
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Onboarding</h1>
          <p className="text-muted-foreground mt-2">Register and manage clients</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={currentView === "form" ? "default" : "outline"}
            onClick={() => setCurrentView("form")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
          <Button
            variant={currentView === "list" ? "default" : "outline"}
            onClick={() => setCurrentView("list")}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            View Clients
          </Button>
        </div>
      </div>

      {currentView === "form" && (
        <div className="flex flex-col xl:flex-row gap-8">
          <div className="xl:w-2/3">
            <ClientForm onSubmit={handleSubmit} />
          </div>
          
          <div className="xl:w-1/3">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Client Overview</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{clients.length}</div>
                  <div className="text-sm text-muted-foreground">Total Clients</div>
                </div>
                <div className="bg-accent/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-accent-foreground">
                    {clients.filter(c => c.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                  </div>
                  <div className="text-sm text-muted-foreground">New This Month</div>
                </div>
                <div className="bg-secondary/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-secondary-foreground">
                    {new Set(clients.map(c => c.businessAddress.split(',').pop()?.trim())).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Unique Locations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === "list" && (
        <ClientsTable 
          clients={clients} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {editingClient && (
            <ClientForm 
              onSubmit={handleEditSubmit}
              initialData={editingClient}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}