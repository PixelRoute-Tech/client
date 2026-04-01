import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, 
  ChevronDown, 
  ChevronRight, 
  Save, 
  User as UserIcon,
  Search,
  Lock,
  Unlock,
  Eye,
  Edit3,
  Trash2
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getUserPrivileges, updateBulkPrivileges } from "@/services/privilege.services";
import { getUsers } from "@/services/user.services";
import routes from "@/routes/routeList";
import { UserType, UserPrivilegeType } from "@/types/auth";

// Convert route object to list of menu items for privilege mapping
const MENU_ITEMS = Object.entries(routes)
  .filter(([key]) => !['login', 'signout', 'landing', 'pageNotFound', 'root'].includes(key))
  .map(([key, path]) => ({
    id: key,
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    path
  }));

export default function PrivilegeManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editedPrivileges, setEditedPrivileges] = useState<Record<string, Partial<UserPrivilegeType>>>({});

  // 1. Fetch Users
  const { data: usersResponse, isLoading: isUsersLoading } = useQuery({
    queryKey: ["usersForPrivileges"],
    queryFn: async () => getUsers({ skip: 0, take: 100 }), 
  });

  const users = usersResponse?.data?.list || [];

  // 2. Fetch Privileges for selected user
  const { data: privilegesResponse, isLoading: isPrivilegesLoading } = useQuery({
    queryKey: ["userPrivileges", selectedUser?.id],
    queryFn: () => getUserPrivileges(selectedUser!.id),
    enabled: !!selectedUser,
  });

  // Use a separate useEffect to handle sync between internal state and query response
  const [hasSyncData, setHasSyncData] = useState(false);
  if (privilegesResponse?.success && privilegesResponse.data && !hasSyncData) {
      const privMap: Record<string, Partial<UserPrivilegeType>> = {};
      privilegesResponse.data.forEach((p: UserPrivilegeType) => {
          privMap[p.menu_id] = { ...p };
      });
      setEditedPrivileges(privMap);
      setHasSyncData(true);
  }

  // 3. Save Mutation
  const saveMutation = useMutation({
    mutationFn: updateBulkPrivileges,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPrivileges", selectedUser?.id] });
      toast({
        title: "Success",
        description: "User privileges updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update privileges",
      });
    }
  });

  const handleToggle = (menuId: string, type: 'can_read' | 'can_write' | 'can_delete') => {
    setEditedPrivileges(prev => ({
      ...prev,
      [menuId]: {
        ...prev[menuId],
        menu_id: menuId,
        [type]: !prev[menuId]?.[type]
      }
    }));
  };

  const handleSave = () => {
    if (!selectedUser) return;
    const privileges = Object.values(editedPrivileges);
    saveMutation.mutate({ userId: selectedUser.id, privileges });
  };

  const filteredUsers = users.filter((u: UserType) => 
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!selectedUser) {
    return (
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Privilege Management</h1>
            <p className="text-muted-foreground">Select a user to manage their system access and permissions</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">System Users</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isUsersLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8">Loading users...</TableCell></TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No users found</TableCell></TableRow>
                ) : (
                  filteredUsers.map((user: UserType) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-primary" />
                          </div>
                          {user.first_name} {user.last_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.user_role?.name || "N/A"}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary hover:bg-primary/5"
                          onClick={() => setSelectedUser(user)}
                        >
                          Manage Privileges <Shield className="ml-2 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setSelectedUser(null)}>
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Set User Privileges</h1>
            <p className="text-muted-foreground">Managing permissions for {selectedUser.first_name} {selectedUser.last_name}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setSelectedUser(null)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            <Save className="mr-2 h-4 w-4" /> 
            {saveMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* User Sidebar */}
        <Card className="md:col-span-1 h-fit">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b">
              <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center border-2 border-primary/20">
                <UserIcon className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{selectedUser.first_name} {selectedUser.last_name}</h3>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              <Badge>{selectedUser.user_role?.name || "System User"}</Badge>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Permissions Set</span>
                <span className="font-medium">{Object.keys(editedPrivileges).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privilege Editor */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Menu Access Control</CardTitle>
            <CardDescription>Grant or restrict specific actions across all application sections</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {MENU_ITEMS.map((item) => {
                const priv = editedPrivileges[item.id] || {};
                const hasAny = priv.can_read || priv.can_write || priv.can_delete;

                return (
                    <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-2 bg-card/50">
                        <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-3 w-full text-left">
                                <div className={`p-2 rounded-md ${hasAny ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    {hasAny ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-base">{item.label}</div>
                                    <div className="text-xs text-muted-foreground font-mono">{item.path}</div>
                                </div>
                                <div className="flex gap-2 mr-4">
                                    {priv.can_read && <Badge variant="secondary" className="bg-success/10 text-success border-success/20 text-[10px]">Read</Badge>}
                                    {priv.can_write && <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px]">Write</Badge>}
                                    {priv.can_delete && <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px]">Delete</Badge>}
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2 border-t">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-10">
                                {/* READ */}
                                <div 
                                    className="flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer bg-muted/20 hover:bg-muted/40"
                                    onClick={() => handleToggle(item.id, 'can_read')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${priv.can_read ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                                            <Eye className="h-5 w-5" />
                                        </div>
                                        <div className="font-medium">Read Access</div>
                                    </div>
                                    <Checkbox 
                                        checked={!!priv.can_read} 
                                        onCheckedChange={() => handleToggle(item.id, 'can_read')}
                                    />
                                </div>

                                {/* WRITE */}
                                <div 
                                    className="flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer bg-muted/20 hover:bg-muted/40"
                                    onClick={() => handleToggle(item.id, 'can_write')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${priv.can_write ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                            <Edit3 className="h-5 w-5" />
                                        </div>
                                        <div className="font-medium">Write Access</div>
                                    </div>
                                    <Checkbox 
                                        checked={!!priv.can_write} 
                                        onCheckedChange={() => handleToggle(item.id, 'can_write')}
                                    />
                                </div>

                                {/* DELETE */}
                                <div 
                                    className="flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer bg-muted/20 hover:bg-muted/40"
                                    onClick={() => handleToggle(item.id, 'can_delete')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${priv.can_delete ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                                            <Trash2 className="h-5 w-5" />
                                        </div>
                                        <div className="font-medium">Delete Access</div>
                                    </div>
                                    <Checkbox 
                                        checked={!!priv.can_delete} 
                                        onCheckedChange={() => handleToggle(item.id, 'can_delete')}
                                    />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
