import { useState } from "react";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Settings, 
  Home,
  Table,
  LogIn,
  Palette,
  UserPlus,
  Building2,
  ClipboardList,
  FileSpreadsheet,
  Database,
  Briefcase,
  Diamond
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

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  // { title: "Analytics", url: "/analytics", icon: BarChart3 },
  // { title: "Data Tables", url: "/tables", icon: Table },
  // { title: "Forms", url: "/forms", icon: FileText },
  { title: "Create User", url: "/create-user", icon: UserPlus },
  { title: "Client Onboarding", url: "/client-onboarding", icon: Building2 },
  { title: "Job Request", url: "/job-request", icon: ClipboardList },
  { title: "Jobs", url: "/job-listing", icon: Briefcase },
  { title: "Master Data", url: "/master-data", icon: Database },
  { title: "Worksheet Master", url: "/worksheets", icon: FileSpreadsheet },
  { title: "Users", url: "/users", icon: Users },
];

const settingsItems = [
  { title: "Theme Settings", url: "/theme-settings", icon: Palette, devOnly: true },
  { title: "Settings", url: "/settings", icon: Settings, devOnly: true },
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
      ? "bg-primary/15 text-[var(--text-primary)] font-medium border-l-[3px] border-primary rounded-r-lg" 
      : "hover:bg-[var(--glass-input-bg)] text-[var(--text-body)] rounded-lg hover:text-[var(--text-primary)]";
  };

  return (
    <Sidebar
      className={`border-r border-[var(--glass-border)] bg-[var(--body-bg)] backdrop-blur-xl transition-all duration-300 ${
        state === "collapsed" ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
        {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--glass-border)] transition-all duration-300 group-data-[state=collapsed]:justify-center">
        <div className="w-8 h-8 flex items-center justify-center shrink-0">
          <Diamond className="w-6 h-6 text-primary" />
        </div>
        <div className="overflow-hidden transition-all duration-300 group-data-[state=collapsed]:w-0 group-data-[state=collapsed]:opacity-0 flex flex-col justify-center">
          <h1 className="text-lg font-light text-[var(--text-primary)] whitespace-nowrap tracking-wide">
            VeriCore
          </h1>
          <p className="text-[10px] text-[var(--text-muted)] whitespace-nowrap uppercase tracking-widest">
            Inspections
          </p>
        </div>
      </div>

      <SidebarContent className={state === "collapsed" ? "py-1" : "p-4"}>
        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? 'hidden' : 'section-label text-[var(--text-muted)] mb-2'}>
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

        {import.meta.env.DEV && (
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className={state === "collapsed" ? 'hidden' : 'section-label text-[var(--text-muted)] mb-2'}>
              System
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => {
                  if (item.devOnly && !import.meta.env.DEV) return null;
                  return (
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
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}