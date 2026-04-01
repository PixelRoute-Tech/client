import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Briefcase,
  Activity,
  ArrowUpRight,
  Eye,
  MoreVertical
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import dashboardService from "@/services/dashboard.services";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SkeletonLoader, skeletonConfigs } from "@/components/ui/skeleton-loader";

const Dashboard = () => {
  const { user } = useAuth() || {};
  const navigate = useNavigate();

  const { data: response, isLoading: loading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: dashboardService.getStats,
  });

  const data = response?.data;

  const stats = [
    {
      title: "Total Clients",
      value: data?.totalClients || 0,
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Total Jobs",
      value: data?.totalJobs || 0,
      icon: Briefcase,
      color: "text-warning"
    },
    {
      title: "Total Users",
      value: data?.totalUsers || 0,
      icon: Users,
      color: "text-success"
    },
    {
      title: "Total Reports",
      value: data?.totalReports || 0,
      icon: Activity,
      color: "text-info"
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) {
    return <SkeletonLoader config={skeletonConfigs.dashboard} />;
  }

  return (
    <div className="p-6 space-y-6 page-transition">
      {/* Welcome Section */}
      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-light text-primary-white tracking-wide mb-2">Good morning, {user?.first_name || "User"}</h1>
            <p className="text-body-white max-w-2xl mb-6">
              Welcome to VeriCore Inspections. Here's what's happening in your workspace today.
            </p>
            <Button 
              onClick={() => navigate('/job-listing')}
              className="bg-primary/85 hover:bg-primary text-white rounded-full border border-primary/50 shadow-[0_0_15px_hsl(var(--primary)_/_0.4)] transition-all"
            >
              Manage Jobs
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="hidden lg:block relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors"></div>
            <div className="w-32 h-32 bg-[var(--glass-input-bg)] border border-[var(--glass-border)] rounded-full flex items-center justify-center backdrop-blur-md relative z-10">
              <Activity className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass-panel p-6 hover-lift relative group transition-all duration-300 hover:border-primary/30 overflow-hidden">
            <div className="flex flex-row items-center justify-between pb-4">
              <h3 className="section-label text-muted-white uppercase tracking-wider text-[10px]">
                {stat.title}
              </h3>
              <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
            </div>
            <div>
              <div className="text-3xl stat-number text-primary-white">{stat.value}</div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[var(--glass-input-bg)] to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Job Status Chart */}
        <div className="glass-panel p-6 min-h-[400px]">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-primary-white">Job Status Distribution</h3>
            <p className="text-sm text-body-white mt-1">Overview of all inspection jobs by their current status</p>
          </div>
          <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.jobDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="status" 
                  stroke="rgba(255,255,255,0.5)" 
                  fontSize={12}
                  tickFormatter={(val) => val.charAt(0) + val.slice(1).toLowerCase()}
                />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {(data?.jobDistribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Status Details */}
        <div className="glass-panel p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-primary-white">User Overview</h3>
              <p className="text-sm text-muted-white mt-1">Status of system users</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/user-profile')} className="text-xs text-primary">View All</Button>
          </div>
          <div className="space-y-4">
            {data?.users?.map((u: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                    {u.first_name?.[0]}{u.last_name?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-white leading-none">{u.first_name} {u.last_name}</p>
                    <p className="text-xs text-muted-white mt-1">{u.email}</p>
                  </div>
                </div>
                <Badge variant={u.is_active ? "success" : "destructive"} className="text-[10px]">
                  {u.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Jobs with Action Area */}
      <div className="glass-panel p-6">
        <div className="flex flex-row items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-primary-white">Recent Job Requests</h3>
            <p className="text-sm text-muted-white mt-1">Manage and view details of recent inspection requests</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/job-listing')} className="border-white/10 hover:bg-white/5">
            See All Jobs
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 text-xs font-semibold text-muted-white uppercase tracking-wider">Client</th>
                <th className="pb-3 text-xs font-semibold text-muted-white uppercase tracking-wider">Duration</th>
                <th className="pb-3 text-xs font-semibold text-muted-white uppercase tracking-wider">Status</th>
                <th className="pb-3 text-xs font-semibold text-muted-white uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.recentJobs?.map((job: any) => (
                <tr key={job.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="text-sm font-medium text-primary-white">{job.client?.business_name || 'N/A'}</div>
                    <div className="text-xs text-muted-white">PO: {job.purchase_order || 'N/A'}</div>
                  </td>
                  <td className="py-4">
                    <div className="text-xs text-primary-white">{new Date(job.from_date).toLocaleDateString()} - {new Date(job.to_date).toLocaleDateString()}</div>
                  </td>
                  <td className="py-4">
                    <Badge variant="outline" className={`text-[10px] uppercase ${
                      job.status === 'SIGNED' ? 'border-success bg-success/10 text-success' :
                      job.status === 'COMPLETED' ? 'border-success text-success' : 
                      job.status === 'PENDING' ? 'border-warning text-warning' : 
                      'border-primary text-primary'
                    }`}>
                      {job.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {/* Full Details Button */}
                       <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-8 px-3 text-[10px] bg-primary/20 hover:bg-primary/30 text-white border-transparent"
                        onClick={() => navigate(`/job-details/${job.id}`)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Full Details
                      </Button>
                      
                      {/* Reserved Space for future buttons */}
                      <div className="w-8 h-8 flex items-center justify-center rounded-md border border-dashed border-white/20 text-muted-white hover:text-white transition-colors cursor-help" title="Reserved for future actions">
                        <MoreVertical className="w-4 h-4" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {(!data?.recentJobs || data?.recentJobs.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-white text-sm">No recent jobs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%) skew-x(-20deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;