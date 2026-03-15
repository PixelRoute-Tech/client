import { useState } from "react";
import { ClientForm } from "@/components/forms/ClientForm";
import { ClientsTable } from "@/components/tables/ClientsTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteClients, getClients } from "@/services/client.services";
import moment from "moment";
import { ClientType } from "@/types/client.type";
import { useToast } from "@/hooks/use-toast";

export default function ClientOnboarding() {
  const [queryParams, setQueryParams] = useState({
    skip: 0,
    take: 10,
  });

  const { data: clientsResponse, refetch, isFetching } = useQuery({
    queryKey: ["fetchclientsinclientonboarding", queryParams],
    queryFn: () => getClients(queryParams.skip, queryParams.take),
    refetchOnWindowFocus: false,
  });

  const clients = clientsResponse?.data?.data || [];
  const totalCount = clientsResponse?.data?.count || 0;

  const [editingClient, setEditingClient] = useState<ClientType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"form" | "list">("form");
  const { toast } = useToast();
  
  const { mutate: removeClients } = useMutation({
    mutationFn: deleteClients,
    onSuccess: (result) => {
      refetch();
      toast({
        title: "Client deleted successfully",
        description: "The client record has been removed.",
        className: "bg-green-500 text-white",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Opps! Something went wrong",
        className: "bg-red-500 text-white",
      });
    },
  });

  const handleSubmit = (clientData: ClientType) => {
    refetch();
    setCurrentView("list");
  };

  const handleEdit = (client: ClientType) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (clientData: ClientType) => {
    refetch();
    setIsEditDialogOpen(false);
    setEditingClient(null);
  };

  const handleDelete = (clientId: number) => {
    removeClients(clientId.toString());
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Client Onboarding
          </h1>
          <p className="text-muted-foreground mt-2">
            Register and manage clients
          </p>
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
              <h2 className="text-xl font-semibold text-foreground">
                Client Overview
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">
                    {totalCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Clients
                  </div>
                </div>
                <div className="bg-accent/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-accent-foreground">
                    {
                      clients.filter(
                        (c) => 
                          moment(c.created_at).isSame(moment(), 'month')
                      ).length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    New This Month
                  </div>
                </div>
                <div className="bg-secondary/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-secondary-foreground">
                    {
                      new Set(
                        clients.map((c) =>
                          c.business_address?.split(",").pop()?.trim()
                        )
                      ).size
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Unique Locations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === "list" && (
        <ClientsTable
          clients={clients}
          totalCount={totalCount}
          loading={isFetching}
          onEdit={handleEdit}
          onDelete={handleDelete}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
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
