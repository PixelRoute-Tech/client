import { createBrowserRouter, Outlet } from "react-router-dom";
import routes from "./routeList";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { lazy, Suspense } from "react";
import {
  skeletonConfigs,
  SkeletonLoader,
} from "@/components/ui/skeleton-loader";
import { authenticatedLoader } from "@/loaders/authLoaders";
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));

const router = createBrowserRouter([
  {
    path: routes.root,
    element: <Outlet />,
    loader: authenticatedLoader,
    children: [
      {
        path: "",
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
                fallback={<SkeletonLoader config={skeletonConfigs.login} />}
              >
                <Dashboard />
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
]);

export default router;
