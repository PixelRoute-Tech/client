import {  
  Settings, 
  Home,
  LogIn,
  Palette,
  UserPlus,
  File
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { adminRoutes } from "@/admin/routes/routesList";

const mainItems = [
  { title: "Company", url: adminRoutes.companyMaster, icon: Home },
  { title: "File manager", url: adminRoutes.fileManager, icon: File },
];

const settingsItems = [
  { title: "Theme Settings", url: "/theme-settings", icon: Palette },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Login", url: "/login", icon: LogIn },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };
  
  const getNavCls = (path: string) => {
    const active = isActive(path);
    return active 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";
  };

  return (
    <Sidebar
      className={`border-r border-sidebar-border transition-all duration-300 ${
        state === "collapsed" ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
        {/* Logo */}
      <div className="flex items-center gap-2 p-4 border-b border-sidebar-border transition-all duration-300 group-data-[state=collapsed]:justify-center">
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
          M
        </div>
        <div className="overflow-hidden transition-all duration-300 group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:opacity-0">
          <h1 className="text-xl font-bold text-sidebar-foreground whitespace-nowrap">
            Mantis
          </h1>
          <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">
            ERP System
          </p>
        </div>
      </div>

      <SidebarContent className={state === "collapsed" ? "py-1" : "p-4"}>
        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? 'hidden' : ''}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`w-full justify-start ${getNavCls(item.url)} transition-colors duration-200`}
                  >
                    <NavLink to={item.url} end={item.url === "/"}>
                      <item.icon className={`h-5 w-5 ${state === "collapsed" ? 'mx-auto' : 'mr-3'}`} />
                      {state !== "collapsed" && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className={state === "collapsed" ? 'hidden' : ''}>
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`w-full justify-start ${getNavCls(item.url)} transition-colors duration-200`}
                  >
                    <NavLink to={item.url}>
                      <item.icon className={`h-5 w-5 ${state === "collapsed" ? 'mx-auto' : 'mr-3'}`} />
                      {state !== "collapsed" && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}