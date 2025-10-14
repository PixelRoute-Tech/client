import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SplashScreen } from "@/components/ui/splash-screen";
import router from "./routes/routes";

// Lazy load all pages
// const Dashboard = lazy(() => import("./pages/Dashboard"));
// const DataTables = lazy(() => import("./pages/DataTables"));
// const Forms = lazy(() => import("./pages/Forms"));
// const ThemeSettings = lazy(() => import("./pages/ThemeSettings"));
// const Login = lazy(() => import("./pages/Login"));
// const NotFound = lazy(() => import("./pages/NotFound"));
// const CreateUser = lazy(() => import("./pages/CreateUser"));
// const ClientOnboarding = lazy(() => import("./pages/ClientOnboarding"));
// const JobRequest = lazy(() => import("./pages/JobRequest"));
// const WorksheetListing = lazy(() => import("./pages/WorksheetListing"));
// const WorksheetBuilder = lazy(() => import("./pages/WorksheetBuilder"));

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
// <BrowserRouter>
//   <Routes>
//     <Route
//       path="/login"
//       element={
//         <Suspense fallback={<SkeletonLoader config={skeletonConfigs.login} />}>
//           <Login />
//         </Suspense>
//       }
//     />
//     <Route
//       path="/"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.dashboard} />}>
//             <Dashboard />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     <Route
//       path="/tables"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.table} />}>
//             <DataTables />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     <Route
//       path="/forms"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.form} />}>
//             <Forms />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     <Route
//       path="/theme-settings"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.themeSettings} />}>
//             <ThemeSettings />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     <Route
//       path="/analytics"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.dashboard} />}>
//             <Dashboard />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     <Route
//       path="/users"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.table} />}>
//             <DataTables />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     <Route
//       path="/settings"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.themeSettings} />}>
//             <ThemeSettings />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     <Route
//       path="/create-user"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.form} />}>
//             <CreateUser />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     <Route
//       path="/client-onboarding"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.form} />}>
//             <ClientOnboarding />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     <Route
//       path="/job-request"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.form} />}>
//             <JobRequest />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     <Route
//       path="/worksheets"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.table} />}>
//             <WorksheetListing />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     <Route
//       path="/worksheets/new"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.form} />}>
//             <WorksheetBuilder />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     <Route
//       path="/worksheets/edit/:id"
//       element={
//         <DashboardLayout>
//           <Suspense fallback={<SkeletonLoader config={skeletonConfigs.form} />}>
//             <WorksheetBuilder />
//           </Suspense>
//         </DashboardLayout>
//       }
//     />
//     {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//     <Route
//       path="*"
//       element={
//         <Suspense fallback={<SkeletonLoader config={skeletonConfigs.page} />}>
//           <NotFound />
//         </Suspense>
//       }
//     />
//   </Routes>
// </BrowserRouter>
