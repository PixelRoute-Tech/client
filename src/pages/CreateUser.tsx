import { useState } from "react";
import { UserForm } from "@/components/forms/UserForm";
import { UsersTable, User } from "@/components/tables/UsersTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";

export default function CreateUser() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      userName: "John Doe",
      userRole: "Admin",
      designation: "Software Engineer",
      department: "IT",
      email: "john.doe@company.com",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      userName: "Jane Smith",
      userRole: "Manager",
      designation: "Project Manager",
      department: "Operations",
      email: "jane.smith@company.com",
      createdAt: new Date("2024-02-10"),
    },
    {
      id: "3",
      userName: "Mike Johnson",
      userRole: "Employee",
      designation: "Developer",
      department: "IT",
      email: "mike.johnson@company.com",
      createdAt: new Date("2024-03-05"),
    },
  ]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"form" | "list">("form");

  const handleSubmit = (userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setUsers([...users, newUser]);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (userData: Omit<User, "id" | "createdAt">) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...editingUser, ...userData }
          : user
      ));
      setIsEditDialogOpen(false);
      setEditingUser(null);
    }
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage system users</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={currentView === "form" ? "default" : "outline"}
            onClick={() => setCurrentView("form")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
          <Button
            variant={currentView === "list" ? "default" : "outline"}
            onClick={() => setCurrentView("list")}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            View Users
          </Button>
        </div>
      </div>

      {currentView === "form" && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <UserForm onSubmit={handleSubmit} />
          </div>
          
          <div className="lg:w-1/2">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-primary">{users.length}</div>
                  <div className="text-sm text-muted-foreground">Total Users</div>
                </div>
                <div className="bg-accent/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-accent-foreground">
                    {users.filter(u => u.userRole === 'Admin').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Administrators</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === "list" && (
        <UsersTable 
          users={users} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm 
              onSubmit={handleEditSubmit}
              initialData={editingUser}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}