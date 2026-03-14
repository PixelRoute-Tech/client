import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Edit, Trash2, Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { UserType } from "@/types/auth";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { baseURL } from "@/config/network.config";
import { getDepartment, getUserRole, MasterResult } from "@/services/masters.services";
import { useEffect, useState } from "react";

export interface User {
  id: string;
  userName: string;
  userRole: string;
  designation: string;
  department: string;
  email: string;
  createdAt: Date;
}

interface UsersTableProps {
  users: UserType[];
  totalCount?: number;
  loading?: boolean;
  onEdit?: (user: UserType) => void;
  onDelete?: (userId: number) => void;
  queryParams?: {
    skip: number;
    take: number;
    role: string;
    department_id: string;
    is_active: string;
  };
  setQueryParams?: React.Dispatch<React.SetStateAction<{
    skip: number;
    take: number;
    role: string;
    department_id: string;
    is_active: string;
  }>>;
}

export function UsersTable({
  users,
  totalCount = 0,
  loading,
  onEdit,
  onDelete,
  queryParams,
  setQueryParams
}: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState<MasterResult[]>([]);
  const [roles, setRoles] = useState<MasterResult[]>([]);
  const { toast } = useToast();
  const {user:currentUser} = useAuth()
  
  const showControls = Boolean(queryParams && setQueryParams);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [deptRes, roleRes] = await Promise.all([getDepartment(), getUserRole()]);
        setDepartments(deptRes.data);
        setRoles(roleRes.data);
      } catch (error) {
        console.error("Failed to fetch masters", error);
      }
    };
    fetchMasters();
  }, []);

  // const filteredUsers = users.filter(
  //   (user) =>
  //     user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     (user.department?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
  //     (user.user_role?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  // );

  const handlePageChange = (direction: "next" | "prev") => {
    if (!setQueryParams || !queryParams) return;
    setQueryParams(prev => ({
      ...prev,
      skip: direction === "next" ? prev.skip + prev.take : Math.max(0, prev.skip - prev.take)
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    if (!setQueryParams) return;
    setQueryParams(prev => ({
      ...prev,
      [key]: value === "all" ? "" : (key === "take" ? parseInt(value) : value),
      skip: 0 // Reset pagination on filter change
    }));
  };

  const clearFilters = () => {
    if (!setQueryParams) return;
    setQueryParams({
      skip: 0,
      take: 10,
      role: "",
      department_id: "",
      is_active: "",
    });
    setSearchTerm("");
  };

  const handleDelete = (userId: number, userName: string) => {
    if (onDelete) {
      onDelete(userId);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    console.log("role inside getRoleBadgeVariant",role);
    switch (role?.toLowerCase()) {
      case "admin":
        return "destructive";
      case "manager":
        return "default";
      case "employee":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary text-2xl font-bold">Users List</CardTitle>
            <div className="flex items-center gap-2">
                {showControls && (
                 <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="flex items-center gap-1 h-9"
                 >
                   <FilterX className="h-4 w-4" />
                   Clear
                 </Button>
                )}
               <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>
            </div>
          </div>
           
           {showControls && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/20 p-4 rounded-lg">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</label>
                <Select 
                  value={queryParams?.role || "all"} 
                  onValueChange={(val) => handleFilterChange("role", val)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</label>
                <Select 
                  value={queryParams?.department_id || "all"} 
                  onValueChange={(val) => handleFilterChange("department_id", val)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
                <Select 
                  value={queryParams?.is_active || "all"} 
                  onValueChange={(val) => handleFilterChange("is_active", val)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
           )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Created</TableHead>
                {Boolean(onEdit || onDelete) && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-8"
                  >
                    Loading ....
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-8"
                    >
                      {searchTerm
                        ? "No users found matching your search."
                        : "No users available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-xs text-foreground font-mono">
                        {user.id}
                      </TableCell>
                      <TableCell className="text-xs text-foreground font-mono">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`${baseURL}${
                              user?.avatar_url ?? ""
                            }`}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.short_name}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.first_name + " " + user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.user_role?.name || "")}>
                          {user.user_role?.name || "No Role"}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.designation?.name || "N/A"}</TableCell>
                      <TableCell>{user.department?.name || "N/A"}</TableCell>
                      <TableCell>
                        {moment(user.created_at).format("DD-MM-YYYY")}
                      </TableCell>
                      {Boolean(onEdit || onDelete) && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {Boolean(onEdit) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(user)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            )}
                            {(Boolean(onDelete) &&( user.id != currentUser.id )) && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete the user "
                                      {user.first_name + " " + user.last_name}" from the system.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDelete(user.id, user.first_name + " " + user.last_name)
                                      }
                                      className="bg-destructive text-destructive-foreground"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            )}
          </Table>
        </div>

        {showControls && totalCount > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 pt-6 border-t gap-4">
            <div className="text-sm text-muted-foreground font-medium">
              Showing <span className="text-foreground">{(queryParams?.skip || 0) + 1}</span> to <span className="text-foreground">{Math.min((queryParams?.skip || 0) + (queryParams?.take || 10), totalCount)}</span> of <span className="text-foreground">{totalCount}</span> users
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Rows per page</label>
                <Select 
                  value={queryParams?.take.toString() || "10"} 
                  onValueChange={(val) => handleFilterChange("take", val)}
                >
                  <SelectTrigger className="h-9 w-[110px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Rows</SelectItem>
                    <SelectItem value="25">25 Rows</SelectItem>
                    <SelectItem value="50">50 Rows</SelectItem>
                    <SelectItem value="100">100 Rows</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange("prev")}
                  disabled={(queryParams?.skip || 0) === 0 || loading}
                  className="h-9 w-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center justify-center border rounded-md h-9 px-4 bg-muted/20 text-sm font-semibold min-w-[100px]">
                  Page {Math.floor((queryParams?.skip || 0) / (queryParams?.take || 10)) + 1}
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange("next")}
                  disabled={(queryParams?.skip || 0) + (queryParams?.take || 10) >= totalCount || loading}
                  className="h-9 w-9"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
