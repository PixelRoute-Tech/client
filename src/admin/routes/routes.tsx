import { RouteObject } from "react-router-dom";
import { adminRoutes } from "./routesList";
import CompanyMaster from "../pages/CompanyMaster";

export const adminRouter:RouteObject[] = [
   {
      path:adminRoutes.companyMaster,
      element:<CompanyMaster />
   }
]