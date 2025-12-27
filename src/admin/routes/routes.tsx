import { Outlet, RouteObject } from "react-router-dom";
import { adminRoutes } from "./routesList";
import CompanyMaster from "../pages/CompanyMaster";
import FileManager from "../pages/FileManager";
import DashboardLayout from "../components/layout/DashboardLayout";

export const adminRouter: RouteObject[] = [
  {
    path: "",
    element: (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    ),
    children: [
      {
        path: adminRoutes.companyMaster,
        element: <CompanyMaster />,
      },
      {
        path: adminRoutes.fileManager,
        element: <FileManager />,
      },
    ],
  },
];
