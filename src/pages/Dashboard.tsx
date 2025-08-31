import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Mantis</h1>
            <p className="text-muted-foreground max-w-2xl">
              The purpose of a product update is to add new features, fix bugs or improve the performance of the product.
            </p>
            <Button className="mt-4" variant="default">
              View Full Statistics
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="hidden lg:block">
            {/* Placeholder for illustration */}
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <Activity className="h-16 w-16 text-primary/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-2">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-error mr-1" />
                )}
                <span className={`text-xs ${stat.trend === "up" ? "text-success" : "text-error"}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Income Overview</CardTitle>
            <CardDescription>
              <span className="text-error font-medium">$112,900 (45.67%)</span>
              <br />
              Compare to: 01 Dec 2021-08 Jan 2022
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for chart */}
            <div className="h-64 bg-gradient-to-t from-primary/5 to-transparent rounded-lg flex items-end justify-center p-4">
              <div className="flex items-end gap-2 h-full w-full max-w-sm">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-primary rounded-t flex-1"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Page Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for line chart */}
            <div className="h-64 bg-gradient-to-br from-info/5 to-transparent rounded-lg flex items-center justify-center">
              <div className="w-full h-32 relative">
                <svg className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke="hsl(var(--info))"
                    strokeWidth="3"
                    points="0,80 50,60 100,70 150,40 200,50 250,20 300,30"
                    className="drop-shadow-sm"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{activity.user}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <Badge 
                      variant={activity.status === 'completed' ? 'default' : activity.status === 'pending' ? 'secondary' : 'outline'}
                      className="mt-1"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Current project status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{project.name}</span>
                    <Badge 
                      variant={project.priority === 'High' ? 'destructive' : project.priority === 'Medium' ? 'default' : 'secondary'}
                    >
                      {project.priority}
                    </Badge>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.status}</span>
                    <span>{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;