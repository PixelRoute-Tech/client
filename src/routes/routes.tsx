import { createBrowserRouter, Outlet } from "react-router-dom";
import routes from "./routeList";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { lazy, Suspense } from "react";
import {
  skeletonConfigs,
  SkeletonLoader,
} from "@/components/ui/skeleton-loader";
import { authenticatedLoader } from "@/loaders/authLoaders";
import ErrorBoundary from "@/components/ErrorPage/ErrorBoundary";
const SessionExpired = lazy(() => import("@/pages/SessionExpired"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const JobRequest = lazy(() => import("@/pages/JobRequest"));
const DataTables = lazy(() => import("@/pages/DataTables"));
const Forms = lazy(() => import("@/pages/Forms"));
const ThemeSettings = lazy(() => import("@/pages/ThemeSettings"));
const CreateUser = lazy(() => import("@/pages/CreateUser"));
const ClientOnboarding = lazy(() => import("@/pages/ClientOnboarding"));
const WorksheetListing = lazy(() => import("@/pages/WorksheetListing"));
const WorksheetBuilder = lazy(() => import("@/pages/WorksheetBuilder"));
const UserProfile = lazy(() => import("@/pages/UserProfile"));

const router = createBrowserRouter([
  {
    path: routes.root,
    element: (
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    ),
    errorElement: <p>Error </p>,
    children: [
      {
        path: "",
        loader: authenticatedLoader,
        element: (
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.dashboard} />}
              >
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: routes.datatables,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.table} />}
              >
                <DataTables />
              </Suspense>
            ),
          },
          {
            path: routes.users,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.table} />}
              >
                <DataTables />
              </Suspense>
            ),
          },
          {
            path: routes.forms,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <Forms />
              </Suspense>
            ),
          },
          {
            path: routes.jobRequest,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <JobRequest />
              </Suspense>
            ),
          },
          {
            path: routes.createUser,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <CreateUser />
              </Suspense>
            ),
          },
          {
            path: routes.clientOnBoarding,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <ClientOnboarding />
              </Suspense>
            ),
          },
          {
            path: routes.worksheet,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <WorksheetListing />
              </Suspense>
            ),
          },
          {
            path: routes.worksheetEdit,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <WorksheetBuilder />
              </Suspense>
            ),
          },
          {
            path: routes.userProfile,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <UserProfile />
              </Suspense>
            ),
          },
          //settings
          {
            path: routes.settings,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <ThemeSettings />
              </Suspense>
            ),
          },
          {
            path: routes.themeSettings,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <ThemeSettings />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: routes.login,
    element: (
      <Suspense fallback={<SkeletonLoader config={skeletonConfigs.login} />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: routes.signout,
    element: (
      <Suspense fallback={<SkeletonLoader config={skeletonConfigs.login} />}>
        <SessionExpired />
      </Suspense>
    ),
  },
  {
    path: routes.pageNotFound,
    element: (
      <Suspense fallback={<SkeletonLoader config={skeletonConfigs.login} />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router;
