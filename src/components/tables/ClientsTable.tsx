import { useState } from "react";
import { Edit, Trash2, Search, Phone, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
// import { useToast } from "@/hooks/use-toast";
import { ClientType } from "@/types/client.type";
// import { useQuery } from "@tanstack/react-query";
// import { getClients } from "@/services/client.services";

interface ClientsTableProps {
  clients: ClientType[];
  totalCount?: number;
  loading?: boolean;
  onEdit: (client: ClientType) => void;
  onDelete: (clientId: number) => void;
  onSelect?: (client: ClientType) => void;
  queryParams?: {
    skip: number;
    take: number;
  };
  setQueryParams?: React.Dispatch<
    React.SetStateAction<{
      skip: number;
      take: number;
    }>
  >;
}

export function ClientsTable({
  clients,
  totalCount = 0,
  loading,
  onEdit,
  onDelete,
  onSelect,
  queryParams,
  setQueryParams,
}: ClientsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients?.filter(
    (client) =>
      client.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.abn_acn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.account_dept_contact?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (direction: "next" | "prev") => {
    if (!setQueryParams || !queryParams) return;
    setQueryParams((prev) => ({
      ...prev,
      skip:
        direction === "next"
          ? prev.skip + prev.take
          : Math.max(0, prev.skip - prev.take),
    }));
  };

  const handleRowsPerPageChange = (value: string) => {
    if (!setQueryParams) return;
    setQueryParams((prev) => ({
      ...prev,
      take: parseInt(value),
      skip: 0,
    }));
  };

  const handleDelete = (clientId: number) => {
    onDelete(clientId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary">Clients List</CardTitle>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search clients..."
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
                 <TableHead>id</TableHead>
                 <TableHead>Code</TableHead>
                 <TableHead>Business Name</TableHead>
                 <TableHead>ABN/ACN</TableHead>
                 <TableHead>Contact</TableHead>
                 <TableHead>Account Contact</TableHead>
                 <TableHead>Emails</TableHead>
                 <TableHead>Created</TableHead>
                 <TableHead className={Boolean(onSelect) ? "hidden" : "text-right" }>Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : 
filteredClients?.length === 0 || !Boolean(filteredClients?.length) ? (
                 <TableRow>
                   <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                     {searchTerm ? "No clients found matching your search." : "No clients available."}
                   </TableCell>
                 </TableRow>
               ) : (
                 filteredClients?.map((client) => (
                   <TableRow 
                     key={client.id}
                     className={onSelect ? "cursor-pointer hover:bg-muted/50" : ""}
                     onClick={() => onSelect?.(client)}
                   >
                     <TableCell className="font-mono text-xs">#{client.id}</TableCell>
                     <TableCell className="font-semibold">{client.client_code}</TableCell>
                     <TableCell className="font-medium">{client.business_name}</TableCell>
                     <TableCell>{client.abn_acn}</TableCell>
                     <TableCell>
                       <div className="space-y-1 text-sm">
                         <div className="flex items-center gap-1">
                           <Phone className="h-3 w-3 text-muted-foreground" />
                           {client.phone}
                         </div>
                         <div className="flex items-center gap-1">
                           <Mail className="h-3 w-3 text-muted-foreground" />
                           {client.email}
                         </div>
                       </div>
                     </TableCell>
                     <TableCell>
                       <div className="space-y-1 text-sm">
                         <div className="font-medium">{client.account_dept_contact}</div>
                         <div className="flex items-center gap-1 text-muted-foreground">
                           <Phone className="h-3 w-3" />
                           {client.account_phone}
                         </div>
                       </div>
                     </TableCell>
                     <TableCell>
                       <div className="space-y-1 text-xs">
                         <div className="flex flex-col">
                           <span className="text-muted-foreground">Account:</span>
                           <span>{client.account_email}</span>
                         </div>
                         <div className="flex flex-col">
                           <span className="text-muted-foreground">Invoice:</span>
                           <span>{client.invoice_email}</span>
                         </div>
                       </div>
                     </TableCell>
                     <TableCell>{client.created_at ? new Date(client.created_at).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell className={Boolean(onSelect) ? "hidden" : "text-right" }>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(client);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <AlertDialog >
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the client
                                "{client.business_name}" from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                               <AlertDialogCancel>Cancel</AlertDialogCancel>
                               <AlertDialogAction
                                 onClick={() => handleDelete(client.id)}
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
        
        {totalCount > 0 && queryParams && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t gap-4">
            <div className="text-sm text-muted-foreground font-medium">
              Showing <span className="text-foreground">{queryParams.skip + 1}</span> to{" "}
              <span className="text-foreground">
                {Math.min(queryParams.skip + queryParams.take, totalCount)}
              </span>{" "}
              of <span className="text-foreground">{totalCount}</span> clients
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Rows per page
                </label>
                <select
                  value={queryParams.take}
                  onChange={(e) => handleRowsPerPageChange(e.target.value)}
                  className="h-9 w-[110px] rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value={10}>10 Rows</option>
                  <option value={25}>25 Rows</option>
                  <option value={50}>50 Rows</option>
                  <option value={100}>100 Rows</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange("prev")}
                  disabled={queryParams.skip === 0 || loading}
                  className="h-9 w-9"
                >
                  <Search className="h-4 w-4 rotate-180" />
                </Button>

                <div className="flex items-center justify-center border rounded-md h-9 px-4 bg-muted/20 text-sm font-semibold min-w-[100px]">
                  Page {Math.floor(queryParams.skip / queryParams.take) + 1}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange("next")}
                  disabled={queryParams.skip + queryParams.take >= totalCount || loading}
                  className="h-9 w-9"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}