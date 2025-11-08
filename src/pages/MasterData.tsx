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

interface MasterDataItem {
  id: string;
  name: string;
  createdAt: string;
}

const MasterData = () => {
  const { toast } = useToast();
  const [designations, setDesignations] = useState<MasterDataItem[]>([]);
  const [departments, setDepartments] = useState<MasterDataItem[]>([]);
  const [userRoles, setUserRoles] = useState<MasterDataItem[]>([]);
  
  const [designationInput, setDesignationInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");
  const [userRoleInput, setUserRoleInput] = useState("");
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDesignations = localStorage.getItem("designations");
    const savedDepartments = localStorage.getItem("departments");
    const savedUserRoles = localStorage.getItem("userRoles");
    
    if (savedDesignations) setDesignations(JSON.parse(savedDesignations));
    if (savedDepartments) setDepartments(JSON.parse(savedDepartments));
    if (savedUserRoles) setUserRoles(JSON.parse(savedUserRoles));
  }, []);

  const addDesignation = () => {
    if (!designationInput.trim()) {
      toast({
        title: "Error",
        description: "Designation name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newDesignation: MasterDataItem = {
      id: Date.now().toString(),
      name: designationInput.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...designations, newDesignation];
    setDesignations(updated);
    localStorage.setItem("designations", JSON.stringify(updated));
    setDesignationInput("");
    
    toast({
      title: "Success",
      description: "Designation added successfully",
    });
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

    const newDepartment: MasterDataItem = {
      id: Date.now().toString(),
      name: departmentInput.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...departments, newDepartment];
    setDepartments(updated);
    localStorage.setItem("departments", JSON.stringify(updated));
    setDepartmentInput("");
    
    toast({
      title: "Success",
      description: "Department added successfully",
    });
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

    const newUserRole: MasterDataItem = {
      id: Date.now().toString(),
      name: userRoleInput.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [...userRoles, newUserRole];
    setUserRoles(updated);
    localStorage.setItem("userRoles", JSON.stringify(updated));
    setUserRoleInput("");
    
    toast({
      title: "Success",
      description: "User role added successfully",
    });
  };

  const confirmDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    const { type, id } = itemToDelete;
    
    if (type === "designation") {
      const updated = designations.filter((item) => item.id !== id);
      setDesignations(updated);
      localStorage.setItem("designations", JSON.stringify(updated));
    } else if (type === "department") {
      const updated = departments.filter((item) => item.id !== id);
      setDepartments(updated);
      localStorage.setItem("departments", JSON.stringify(updated));
    } else if (type === "userRole") {
      const updated = userRoles.filter((item) => item.id !== id);
      setUserRoles(updated);
      localStorage.setItem("userRoles", JSON.stringify(updated));
    }

    toast({
      title: "Success",
      description: "Item deleted successfully",
    });
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Master Data Management</h1>
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
                  <Button onClick={addDesignation}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Designations List ({designations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {designations.length === 0 ? (
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
                    {designations.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDelete("designation", item.id)}
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
                  <Button onClick={addDepartment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Departments List ({departments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {departments.length === 0 ? (
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
                    {departments.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDelete("department", item.id)}
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
                  <Button onClick={addUserRole}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Roles List ({userRoles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {userRoles.length === 0 ? (
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
                    {userRoles.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDelete("userRole", item.id)}
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
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MasterData;