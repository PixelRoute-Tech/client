import { useState } from "react";
import { Edit, Trash2, Search } from "lucide-react";
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
  loading?: boolean;
  onEdit?: (user: UserType) => void;
  onDelete?: (userId: number) => void;
}

export function UsersTable({
  users,
  loading,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const {user:currentUser} = useAuth()
  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (userId: number, userName: string) => {
    onDelete(userId);
    // toast({
    //   title: "User deleted",
    //   description: `${userName} has been removed from the system.`,
    // });
  };

  const getRoleBadgeVariant = (role: string) => {
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary">Users List</CardTitle>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
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
                {filteredUsers.length === 0 ? (
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
                  filteredUsers.map((user) => (
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
                        <Badge variant={getRoleBadgeVariant(user.user_role)}>
                          {user.user_role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.designation}</TableCell>
                      <TableCell>{user.department}</TableCell>
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

        {filteredUsers?.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <p>
              Showing {filteredUsers?.length} of {users?.length} users
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
