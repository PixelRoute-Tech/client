import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./AppSidebar";

function DashboardLayout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="flex-1 overflow-auto p-5">{children}</main>
    </SidebarProvider>
  );
}

export default DashboardLayout;
