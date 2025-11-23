import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import routes from "@/routes/routeList";
import { NotificationList } from "../ui/notification-list";
import { useInitSocket, useSocketListen } from "@/hooks/use-socket";
import { useEffect, useState } from "react";
import { Notification } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotification, updateNotification } from "@/services/notification.services";
import { useToast } from "@/hooks/use-toast";
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signout, startLoading, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const queryClient = useQueryClient();
  const handleSignOut = () => {
    startLoading();
    signout(true);
  };
  const handleNavigateProfile = () => {
    navigate(routes.userProfile);
  };
  const handleNavigateSettings = () => {
    navigate(routes.settings);
  };

  const { isLoading: notificationLoading,refetch } = useQuery({
    queryKey: ["user-notification", user.id],
    queryFn: async () => getNotification(user.id),
    onSuccess: (result) => {
      if (result.success) {
        setNotifications(result?.data || []);
      }
    },
    refetchOnWindowFocus: false,
  });

  const {mutate:updateUnReaded} = useMutation({mutationFn:updateNotification,onSuccess:(result)=>{
       if(result.success){
          refetch()
       }
  }})

const handleUpdateUnRead = ()=>{
updateUnReaded({id:user.id,isRead:true})
}

  const notification = useSocketListen("notification") as Notification;
  useEffect(() => {
    if (notification) {
      setNotifications((prev) => [notification, ...prev]);
      toast({
        title: notification?.title,
        description: notification.message,
        className: "bg-green-500 text-white",
      });
    }
  }, [notification]);

  useEffect(() => {
    const unreadCount = notifications?.filter((n) => !n.isRead).length;
    setNotificationCount(unreadCount);
  }, [notifications]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent" />

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search anything..."
                  className="pl-10 w-80 bg-muted/50 border-muted"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="max-w-[27vw] min-w-[27vw]">
                  <NotificationList onMarkAllAsRead={handleUpdateUnRead} notifications={notifications || []} />
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-muted/50"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`${import.meta.env.VITE_API_URL}${
                          user?.imageUrl ?? ""
                        }`}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.shortName}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.userRole}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleNavigateProfile}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleNavigateSettings}>
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600"
                  >
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
