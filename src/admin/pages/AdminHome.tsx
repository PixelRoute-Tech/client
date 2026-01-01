import React from "react";
import {
  Users,
  Settings,
  BarChart3,
  ShieldCheck,
  FileText,
  Bell,
  Building2,
  Folder,
} from "lucide-react";
import { adminRoutes } from "../routes/routesList";

function AdminHome() {
  const menuItems = [
    {
      title: "Company",
      desc: "Add or Edit company",
      icon: <Building2 size={24} />,
      path: adminRoutes.companyMaster,
      color: "bg-blue-500",
    },
    {
      title: "File manager",
      desc: "Manage files and folder",
      icon: <Folder size={24} />,
      path: adminRoutes.fileManager,
      color: "bg-emerald-500",
    },
    {
      title: "Content Manager",
      desc: "Edit blog posts and pages",
      icon: <FileText size={24} />,
      path: "",
      color: "bg-amber-500",
    },
    {
      title: "Security",
      desc: "Audit logs and API keys",
      icon: <ShieldCheck size={24} />,
      path: "",
      color: "bg-red-500",
    },
    {
      title: "Notifications",
      desc: "Send alerts to users",
      icon: <Bell size={24} />,
      path: "",
      color: "bg-purple-500",
    },
    {
      title: "Site Settings",
      desc: "Configure global variables",
      icon: <Settings size={24} />,
      path: "",
      color: "bg-slate-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-12">
      {/* Header Section */}
      <header className="mb-10 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Select a module to manage your platform.
        </p>
      </header>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => (window.location.href = item.path)}
            className="group flex cursor-pointer items-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95"
          >
            {/* Icon Wrapper */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white ${item.color} shadow-lg transition-transform group-hover:scale-110`}
            >
              {item.icon}
            </div>

            {/* Content */}
            <div className="ml-5">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminHome;
