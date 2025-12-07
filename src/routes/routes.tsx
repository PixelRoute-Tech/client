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
import WorksheetReport from "@/pages/WorksheetReport";
import { adminRouter } from "@/admin/routes/routes";
const PreviousReports = lazy(() => import( "@/pages/PreviousReports"));
const ReportImageUpload = lazy(() => import( "@/pages/ReportImageUpload"));
const JobListing = lazy(() => import("@/pages/JobListing"));
const WorksheetDetails = lazy(() => import("@/pages/WorksheetDetails"));
const MasterData = lazy(() => import("@/pages/MasterData"));
const JobRequestDetails = lazy(() => import("@/pages/JobRequestDetails"));
const ErrorPage = lazy(() => import("@/components/ErrorPage/ErrorPage"));
const SessionExpired = lazy(() => import("@/pages/SessionExpired"));
const PageNotFound = lazy(() => import("@/pages/PageNotFound"));
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
    errorElement: (
      <Suspense
        fallback={<SkeletonLoader config={skeletonConfigs.dashboard} />}
      >
        <ErrorPage />
      </Suspense>
    ),
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
            loader: authenticatedLoader,
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
            loader: authenticatedLoader,
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
            loader: authenticatedLoader,
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
            loader: authenticatedLoader,
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
            loader: authenticatedLoader,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <JobRequest />
              </Suspense>
            ),
          },
          {
            path: routes.joblisting,
            loader: authenticatedLoader,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <JobListing />
              </Suspense>
            ),
          },
          {
            path: routes.createUser,
            loader: authenticatedLoader,
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
            loader: authenticatedLoader,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <ClientOnboarding />
              </Suspense>
            ),
          },
          {
            path: routes.userMaster,
            loader: authenticatedLoader,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.table} />}
              >
                <MasterData />
              </Suspense>
            ),
          },
          {
            path: routes.worksheet,
            loader: authenticatedLoader,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.table} />}
              >
                <WorksheetListing />
              </Suspense>
            ),
          },
          {
            path: routes.worksheetNew,
            loader: authenticatedLoader,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <WorksheetBuilder />
              </Suspense>
            ),
          },
          {
            path: routes.worksheetEdit,
            loader: authenticatedLoader,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <WorksheetBuilder />
              </Suspense>
            ),
          },
          {
            path: `${routes.worksheetDetails}`,
            loader: authenticatedLoader,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <WorksheetDetails />
              </Suspense>
            ),
          },
          {
            path: `${routes.worksheetReport}/:id`,
            loader: authenticatedLoader,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <WorksheetReport />
              </Suspense>
            ),
          },
          {
            path: `${routes.reportImages}/:id`,
            loader: authenticatedLoader,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <ReportImageUpload />
              </Suspense>
            ),
          },
          {
            path: `${routes.previousReport}/:id`,
            loader: authenticatedLoader,
            element: (
              <Suspense
                fallback={<SkeletonLoader config={skeletonConfigs.form} />}
              >
                <PreviousReports />
              </Suspense>
            ),
          },
          {
            path: routes.userProfile,
            loader: authenticatedLoader,
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
            loader: authenticatedLoader,
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
            loader: authenticatedLoader,
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
    path: `${routes.jobRequestDetails}/:id`,
    element: (
      <Suspense fallback={<SkeletonLoader config={skeletonConfigs.form} />}>
        <JobRequestDetails />
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
        <PageNotFound />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    children:adminRouter
  },
]);

export default router;
