import { useState } from "react";
import { UserForm } from "@/components/forms/UserForm";
import { UsersTable, User } from "@/components/tables/UsersTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "@/routes/routeList";
import { UserType } from "@/types/auth";
// import { useQuery } from "@tanstack/react-query";
import { deleteUser, getUsers } from "@/services/user.services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function CreateUser() {
  const [users, setUsers] = useState<UserType[]>([]);
  // const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"form" | "list">("form");
   const { toast } = useToast();
  const navigate = useNavigate()
  const location = useLocation()
  const editingUser = location.state

  const {isFetching,refetch} = useQuery({queryKey:["usersList"],queryFn:getUsers,refetchOnWindowFocus:false,  onSuccess: (result) => {
      setUsers(result.data)
    },
    onError: (error) => {
      
    },})

    const {mutate:removeUser} = useMutation({mutationFn:deleteUser,onSuccess:(result)=>{
      refetch()
            toast({
        title: "",
        description: result.message,
        className: "bg-green-500 text-white",
      });
    },onError:(error:any)=>{
       toast({
        title: "",
        description: error?.message  || "Opps! Something went wrong",
        className: "bg-red-500 text-white",
      });
    }})

  const handleSubmit = (userData:UserType) => {
       setCurrentView("list")
       refetch()
  };

  const handleEdit = (user: UserType) => {
    navigate(routes.createUser,{state:user});
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (userData: UserType) => {
    if (editingUser) {
      refetch()
      setIsEditDialogOpen(false);
      navigate("",{state:null});
    }
  };

  const handleDelete = (userId: string) => {
    removeUser(userId)
  };

  const handleClose = (status:boolean)=>{
    setIsEditDialogOpen(status)
    navigate("",{replace:true,state:null});
  }

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
            onClick={() => {setCurrentView("form"),navigate("",{replace:true,state:null});}}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
          <Button
            variant={currentView === "list" ? "default" : "outline"}
            onClick={() => {setCurrentView("list"),navigate("",{replace:true,state:null});}}
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
            <UserForm  onSubmit={handleSubmit} />
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

      <Dialog open={isEditDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm 
              onSubmit={handleEditSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}