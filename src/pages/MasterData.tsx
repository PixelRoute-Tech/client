import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  getDepartment,
  getDesignation,
  getUserRole,
  saveDepartment,
  saveDesignation,
  saveUserRole,
} from "@/services/masters.services";
import { useMasterDataDelete, useMasterDataSave } from "@/hooks/use-master-data";

interface MasterDataItem {
  id: number;
  name: string;
  created_at: string;
}
export const masterQueryKey = {
  department:"masterdepartment",
  designation:"masterdesignation",
  userRole:"masteruserroles"
}
const MasterData = () => {
  const { toast } = useToast();
  const [designationInput, setDesignationInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");
  const [userRoleInput, setUserRoleInput] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

 const onHandleSuccess = ()=>{
    setDeleteDialogOpen(false);
    setItemToDelete(null);
 }

  const deleteMutations = useMasterDataDelete({onSuccess:onHandleSuccess})
  const [itemToDelete, setItemToDelete] = useState<{
    type: keyof typeof deleteMutations;
    id: number | string;
  } | null>(null);

  const [designation, department, userRole] = useQueries({
    queries: [
      {
        queryKey: ["masterdesignation"],
        queryFn: getDesignation,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["masterdepartment"],
        queryFn: getDepartment,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["masteruserroles"],
        queryFn: getUserRole,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const handleOnSuccess = ()=>{
      setDesignationInput("")
      setDepartmentInput("")
      setUserRoleInput("")
  }

  const {departmentMutation,designationMutation,userRoleMutation} = useMasterDataSave({onSuccess:handleOnSuccess})
  

  const addDesignation = () => {
    if (!designationInput.trim()) {
      toast({
        title: "Error",
        description: "Designation name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    designationMutation.mutate({ name: designationInput });
  };

  const addDepartment = () => {
    if (!departmentInput.trim()) {
      toast({
        title: "Error",
        description: "Department name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    departmentMutation.mutate({ name: departmentInput });
  };

  const addUserRole = () => {
    if (!userRoleInput.trim()) {
      toast({
        title: "Error",
        description: "User role name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    userRoleMutation.mutate({ name: userRoleInput });
  };

  const confirmDelete = (type:keyof typeof deleteMutations, id: number | string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      deleteMutations[itemToDelete.type].mutate(itemToDelete.id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Master Data Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage designations, departments, and user roles
        </p>
      </div>

      <Tabs defaultValue="designation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="designation">Designations</TabsTrigger>
          <TabsTrigger value="department">Departments</TabsTrigger>
          <TabsTrigger value="userRole">User Roles</TabsTrigger>
        </TabsList>

        {/* Designations Tab */}
        <TabsContent value="designation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Designation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="designation-input">Designation Name</Label>
                  <Input
                    id="designation-input"
                    placeholder="Enter designation name"
                    value={designationInput}
                    onChange={(e) => setDesignationInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addDesignation()}
                  />
                </div>
                <div className="flex items-end">
                  <Button loading={designationMutation.isPending} onClick={addDesignation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Designations List ({designation?.data?.data?.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {designation.data?.data?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No designations added yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {designation?.data?.data?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.created_at}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            loading={deleteMutations.designationDelete.isPending}
                            size="sm"
                            onClick={() =>
                              confirmDelete("designationDelete", item.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="department-input">Department Name</Label>
                  <Input
                    id="department-input"
                    placeholder="Enter department name"
                    value={departmentInput}
                    onChange={(e) => setDepartmentInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addDepartment()}
                  />
                </div>
                <div className="flex items-end">
                  <Button loading={departmentMutation.isPending} onClick={addDepartment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Departments List ({department?.data?.data?.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {department?.data?.data?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No departments added yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {department?.data?.data?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.created_at}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            loading={deleteMutations.departmentDelete.isPending}
                            size="sm"
                            onClick={() =>
                              confirmDelete("departmentDelete", item.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Roles Tab */}
        <TabsContent value="userRole" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New User Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="userRole-input">User Role Name</Label>
                  <Input
                    id="userRole-input"
                    placeholder="Enter user role name"
                    value={userRoleInput}
                    onChange={(e) => setUserRoleInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addUserRole()}
                  />
                </div>
                <div className="flex items-end">
                  <Button loading={userRoleMutation.isPending} onClick={addUserRole}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                User Roles List ({userRole?.data?.data?.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userRole?.data?.data?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No user roles added yet
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRole?.data?.data?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.created_at}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            loading={deleteMutations.userRoleDelete.isPending}
                            onClick={() => confirmDelete("userRoleDelete", item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <Button onClick={handleDelete}>Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MasterData;
