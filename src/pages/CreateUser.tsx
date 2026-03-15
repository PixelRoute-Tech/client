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
  const [users, setUsers] = useState<{list:UserType[],count:number}>({list:[],count:0});
  // const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"form" | "list">("form");
   const { toast } = useToast();
  const navigate = useNavigate()
  const location = useLocation()
  const editingUser = location.state

  const [queryParams, setQueryParams] = useState({
    skip: 0,
    take: 10,
    role: "",
    department_id: "",
    is_active: "",
  });

  const { isFetching, refetch } = useQuery({
    queryKey: ["usersList", queryParams],
    queryFn: () => getUsers({
      ...queryParams,
      department_id: queryParams.department_id ? parseInt(queryParams.department_id) : undefined,
      is_active: queryParams.is_active === "true" ? true : queryParams.is_active === "false" ? false : undefined,
      role: queryParams.role || undefined
    }),
    refetchOnWindowFocus: false,
    onSuccess: (result) => {
      console.log("users", result);
      
      let actualList: UserType[] = [];
      let actualCount = 0;

      if (Array.isArray(result?.data)) {
        actualList = result.data;
        actualCount = result.data.length;
      } else if (result?.data && typeof result.data === 'object') {
        const payload = result.data as any;
        if (Array.isArray(payload.list)) {
          actualList = payload.list;
        } else if (Array.isArray(payload.data)) {
          actualList = payload.data;
        }
        
        if (typeof payload.count === 'number') {
          actualCount = payload.count;
        } else if (typeof payload.total === 'number') {
          actualCount = payload.total;
        } else {
          actualCount = actualList.length;
        }
      }

      setUsers({
        list: actualList,
        count: actualCount
      });
    },
  });

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

  const handleDelete = (userId: number) => {
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
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">User Management</h1>
          <p className="text-[var(--text-muted)] mt-2">Create and manage system users</p>
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
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-6 flex flex-col justify-center">
                  <div className="text-3xl font-bold text-[hsl(var(--primary))]">{users.count}</div>
                  <div className="text-sm font-medium text-[var(--text-muted)] mt-1">Total Users</div>
                </div>
                <div className="glass-panel p-6 flex flex-col justify-center">
                  <div className="text-3xl font-bold text-[var(--text-primary)]">
                    {(Array.isArray(users.list) ? users.list : []).filter(u => 
                      typeof u.user_role === 'string' 
                        ? u.user_role === 'Admin' 
                        : (u.user_role as any)?.name === 'Admin'
                    ).length || 0}
                  </div>
                  <div className="text-sm font-medium text-[var(--text-muted)] mt-1">Administrators</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === "list" && (
        <UsersTable 
          users={users.list} 
          totalCount={users.count}
          onEdit={handleEdit}
          onDelete={handleDelete}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          loading={isFetching}
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