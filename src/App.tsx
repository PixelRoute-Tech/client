import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import DataTables from "./pages/DataTables";
import Forms from "./pages/Forms";
import ThemeSettings from "./pages/ThemeSettings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CreateUser from "./pages/CreateUser";
import ClientOnboarding from "./pages/ClientOnboarding";
import JobRequest from "./pages/JobRequest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            <Route path="/tables" element={
              <DashboardLayout>
                <DataTables />
              </DashboardLayout>
            } />
            <Route path="/forms" element={
              <DashboardLayout>
                <Forms />
              </DashboardLayout>
            } />
            <Route path="/theme-settings" element={
              <DashboardLayout>
                <ThemeSettings />
              </DashboardLayout>
            } />
            <Route path="/analytics" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            <Route path="/users" element={
              <DashboardLayout>
                <DataTables />
              </DashboardLayout>
            } />
            <Route path="/settings" element={
              <DashboardLayout>
                <ThemeSettings />
              </DashboardLayout>
            } />
            <Route path="/create-user" element={
              <DashboardLayout>
                <CreateUser />
              </DashboardLayout>
            } />
            <Route path="/client-onboarding" element={
              <DashboardLayout>
                <ClientOnboarding />
              </DashboardLayout>
            } />
            <Route path="/job-request" element={
              <DashboardLayout>
                <JobRequest />
              </DashboardLayout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
