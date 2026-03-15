import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AnimatedBackground } from "./AnimatedBackground";
import { Bell, Search, User, Sun, Moon } from "lucide-react";
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
import { baseURL } from "@/config/network.config";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme, updateTheme } = useTheme();

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
    enabled:false,
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
      <div className="min-h-screen flex w-full bg-transparent relative">
        <AnimatedBackground />
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-[var(--glass-border)] bg-[var(--body-bg)] backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-input-bg)] transition-colors" />

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] h-4 w-4" />
                <Input
                  placeholder="Search anything..."
                  className="pl-10 w-80 shadow-none border-[var(--glass-border)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateTheme({ themeMode: theme.themeMode === 'dark' ? 'light' : 'dark' })}
                className="relative h-9 w-9 bg-[var(--glass-input-bg)] border border-[var(--glass-border)] rounded-full hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]"
              >
                {theme.themeMode === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 bg-[var(--glass-input-bg)] border border-[var(--glass-border)] rounded-full hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]">
                    <Bell className="h-4 w-4" />
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
                    className="flex items-center gap-2 hover:bg-[var(--glass-input-bg)] bg-transparent border-0"
                  >
                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                      <AvatarImage
                        src={`${baseURL}${
                          user?.avatar_url ?? ""
                        }`}
                      />
                      <AvatarFallback className="bg-primary/30 text-primary-white">
                        {user.short_name}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col text-left">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{`${user.first_name} ${user.last_name}`}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {typeof user.user_role === 'string' ? user.user_role : (user.user_role as any)?.name || ''}
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
          <main className="flex-1 overflow-auto p-4 md:p-6 page-transition">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
