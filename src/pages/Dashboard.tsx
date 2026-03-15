import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  MoreHorizontal
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "78,250",
      change: "+70.5%",
      trend: "up",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Total Orders",
      value: "18,800",
      change: "-27.4%",
      trend: "down", 
      icon: ShoppingCart,
      color: "text-warning"
    },
    {
      title: "Total Sales",
      value: "$35,078",
      change: "+27.4%",
      trend: "up",
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Total Marketing",
      value: "$1,12,083",
      change: "+70.5%",
      trend: "up",
      icon: Activity,
      color: "text-info"
    }
  ];

  const recentActivities = [
    { user: "John Smith", action: "Created new project", time: "2 hours ago", status: "completed" },
    { user: "Sarah Davis", action: "Updated user profile", time: "4 hours ago", status: "pending" },
    { user: "Mike Johnson", action: "Deleted old records", time: "6 hours ago", status: "completed" },
    { user: "Lisa Wang", action: "Generated report", time: "8 hours ago", status: "in-progress" },
  ];

  const projects = [
    { name: "Website Redesign", progress: 85, status: "In Progress", priority: "High" },
    { name: "Mobile App", progress: 60, status: "In Progress", priority: "Medium" },
    { name: "API Integration", progress: 30, status: "Planning", priority: "Low" },
    { name: "Database Migration", progress: 95, status: "Review", priority: "High" },
  ];

  return (
    <div className="p-6 space-y-6 page-transition">
      {/* Welcome Section */}
      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-light text-primary-white tracking-wide mb-2">Good morning, Aravind</h1>
            <p className="text-body-white max-w-2xl mb-6">
              Welcome to VeriCore Inspections. Here's what's happening in your workspace today.
            </p>
            <Button className="bg-primary/85 hover:bg-primary text-white rounded-full border border-primary/50 shadow-[0_0_15px_hsl(var(--primary)_/_0.4)] transition-all">
              View Full Statistics
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
              <h3 className="section-label text-muted-white">
                {stat.title}
              </h3>
              <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
            </div>
            <div>
              <div className="text-3xl stat-number text-primary-white">{stat.value}</div>
              <div className="flex items-center mt-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  stat.trend === "up" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                }`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </span>
                <span className="text-xs text-muted-white ml-2">vs last month</span>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[var(--glass-input-bg)] to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income Overview Chart */}
        <div className="glass-panel p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-primary-white">Income Overview</h3>
            <p className="text-sm text-body-white mt-1">
              <span className="text-destructive font-medium bg-destructive/15 px-2 py-0.5 rounded-full">$112,900 (45.67%)</span>
              <span className="ml-2 text-muted-white">Compare to: 01 Dec 2021-08 Jan 2022</span>
            </p>
          </div>
          <div className="h-64 mt-6 flex items-end justify-center p-4 relative border-b border-l border-[var(--glass-border)]">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-0 pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-[1px] bg-[var(--glass-border)]"></div>
              ))}
            </div>
            <div className="flex items-end gap-3 h-full w-full max-w-sm relative z-10 mx-auto justify-between px-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-t from-primary/80 to-primary/40 rounded-t-sm w-full group transition-all duration-300 opacity-60 hover:opacity-100 cursor-pointer"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Page Views Chart */}
        <div className="glass-panel p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-primary-white">Page Views</h3>
            <p className="text-sm text-muted-white mt-1">Last 7 days performance</p>
          </div>
          <div className="h-64 mt-6 flex items-center justify-center relative border-b border-l border-[var(--glass-border)] p-4">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-0 pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-full h-[1px] bg-[var(--glass-border)]"></div>
              ))}
            </div>
            <div className="w-full h-full relative z-10 flex items-center">
              <svg className="w-full h-full preserve-3d" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary) / 0.2)" />
                    <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
                  </linearGradient>
                </defs>
                <polygon
                  fill="url(#areaGradient)"
                  points="0,100 0,80 50,60 100,70 150,40 200,50 250,20 300,30 300,100"
                />
                <polyline
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  points="0,80 50,60 100,70 150,40 200,50 250,20 300,30"
                  className="drop-shadow-[0_0_8px_hsl(var(--primary)_/_0.6)]"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <div className="glass-panel p-6 lg:col-span-2">
          <div className="flex flex-row items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-[var(--text-primary)]">Recent Activities</h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">Latest system activities and updates</p>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-[var(--glass-input-bg)] text-[var(--text-primary)]">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--glass-input-bg)] transition-colors border border-transparent hover:border-[var(--glass-border)]">
                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 flex-shrink-0 shadow-[0_0_8px_hsl(var(--primary)_/_0.6)]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{activity.user}</p>
                    <span className="text-xs text-[var(--text-muted)]">{activity.time}</span>
                  </div>
                  <p className="text-sm text-[var(--text-body)] mt-1">{activity.action}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      activity.status === 'completed' ? 'border-success/30 bg-success/10 text-success' : 
                      activity.status === 'pending' ? 'border-warning/30 bg-warning/10 text-warning' : 
                      'border-info/30 bg-info/10 text-info'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Progress */}
        <div className="glass-panel p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[var(--text-primary)]">Projects</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">Current project status</p>
          </div>
          <div className="space-y-6">
            {projects.map((project, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{project.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    project.priority === 'High' ? 'bg-destructive/20 text-destructive border border-destructive/30' : 
                    project.priority === 'Medium' ? 'bg-warning/20 text-warning border border-warning/30' : 
                    'bg-[var(--glass-input-bg)] text-[var(--text-body)] border border-[var(--glass-border)]'
                  }`}>
                    {project.priority}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[var(--glass-bg)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-info rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>{project.status}</span>
                  <span>{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
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