import { useState } from "react";
import { Mail, Briefcase, Building2, UserCircle, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserForm } from "@/components/forms/UserForm";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import moment from "moment"
import { useNavigate } from "react-router-dom";
import routes from "@/routes/routeList";
interface UserProfile {

}

export default function UserProfile() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const {user} = useAuth()
  const navigate = useNavigate()
  const handleEditSubmit = (userData: Omit<UserProfile, "id" | "joinDate" | "avatarUrl">) => {
    setIsEditDialogOpen(false);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "default";
      case "manager":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleEdit = ()=>{
    setIsEditDialogOpen(true)
    navigate(routes.userProfile,{state:user})
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={`${import.meta.env.VITE_API_URL}${user?.imageUrl ?? ""}`} alt={user.userName} />
                  <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                    {user.shortName}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Info Section */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="space-y-1">
                  <h1 className="text-4xl font-bold text-foreground">
                    {user.userName}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {user.designation}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant={getRoleBadgeVariant(user.userRole)} className="px-3 py-1">
                    {user.userRole}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    {user.department}
                  </Badge>
                </div>

                {user.joinDate && (
                  <p className="text-sm text-muted-foreground">
                    Member since {moment(user.joinDate).format("DD-MM-YYYY")}
                  </p>
                )}
              </div>

              {/* Edit Button */}
              <Button 
                onClick={handleEdit}
                size="lg"
                className="gap-2 shadow-lg"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Information
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                <p className="text-base text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {user.email}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="text-base text-foreground font-mono">
                  #{user.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Professional Details
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="text-base text-foreground flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  {user.userRole}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-base text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {user.department}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Designation</p>
                <p className="text-base text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  {user.designation}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen && Boolean(user)} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <UserForm 
            onSubmit={handleEditSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
