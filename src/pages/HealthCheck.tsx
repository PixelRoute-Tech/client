import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Network,
  Server,
} from "lucide-react";

const HealthCheck = () => {
  const overallStatus = "All systems operational";

  const services = [
    {
      name: "API Gateway",
      status: "Operational",
      latency: "120 ms",
      uptime: 99.98,
      trend: "healthy",
    },
    {
      name: "Authentication Service",
      status: "Operational",
      latency: "95 ms",
      uptime: 99.92,
      trend: "healthy",
    },
    {
      name: "Database Cluster",
      status: "Degraded performance",
      latency: "210 ms",
      uptime: 99.40,
      trend: "warning",
    },
    {
      name: "Notification Service",
      status: "Operational",
      latency: "140 ms",
      uptime: 99.76,
      trend: "healthy",
    },
  ];

  const lastChecks = [
    { label: "Last full system scan", value: "2 minutes ago" },
    { label: "Last backup", value: "Today, 03:15 AM" },
    { label: "Last incident", value: "7 days ago" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background via-background/95 to-background px-6 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Hero / Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-emerald-500/10 via-primary/10 to-primary/5 p-6 sm:p-8">
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-background/70 px-3 py-1 text-xs font-medium text-emerald-500 backdrop-blur">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40" />
                Live health monitoring
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                System Health &amp; Uptime
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                A clear, inspiring view of how your platform is doing right now. 
                Share this with your team to keep everyone aligned, calm, and confident.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-emerald-500 text-emerald-50 hover:bg-emerald-500/90">
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  {overallStatus}
                </Badge>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  Built to surface issues early so you can focus on what matters.
                </span>
              </div>

              <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground sm:text-sm">
                {lastChecks.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 backdrop-blur"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="font-medium text-foreground/90">{item.label}</span>
                    <span className="opacity-75">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="relative w-full max-w-xs border-primary/20 bg-background/80 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <HeartPulse className="h-4 w-4 text-emerald-500" />
                  Live heartbeat
                </CardTitle>
                <CardDescription>Last 30 seconds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-16 w-full overflow-hidden rounded-md bg-gradient-to-br from-primary/5 via-emerald-500/5 to-background">
                  <svg className="h-full w-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="0,35 15,30 25,40 35,10 45,50 60,32 75,36 90,28 105,40 120,15 135,45 150,30 165,38 185,26 200,35"
                    />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Response time</span>
                  <span className="font-medium text-foreground">~ 132 ms</span>
                </div>
                <Button size="sm" className="w-full">
                  <Activity className="mr-2 h-4 w-4" />
                  Run instant health check
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Grid content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column: uptime & environment */}
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Server className="h-4 w-4 text-primary" />
                  Uptime overview
                </CardTitle>
                <CardDescription>
                  How resilient your infrastructure has been over the last 90 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Global uptime</span>
                    <span className="font-semibold text-foreground">99.93%</span>
                  </div>
                  <Progress value={99.93} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-muted-foreground">Production</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-500">
                      100%
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Zero downtime in the last 30 days.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-muted-foreground">Staging</p>
                    <p className="mt-1 text-lg font-semibold text-amber-500">
                      99.2%
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Planned maintenance last weekend.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Network className="h-4 w-4 text-primary" />
                  Regions
                </CardTitle>
                <CardDescription>Latency across your core regions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {[
                  { region: "US-East", latency: "110 ms", status: "healthy" },
                  { region: "Europe", latency: "128 ms", status: "healthy" },
                  { region: "Asia-Pacific", latency: "165 ms", status: "watch" },
                ].map((r) => (
                  <div
                    key={r.region}
                    className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2"
                  >
                    <div>
                      <p className="text-xs font-medium">{r.region}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Avg latency · {r.latency}
                      </p>
                    </div>
                    <Badge
                      variant={r.status === "healthy" ? "secondary" : "outline"}
                      className={
                        r.status === "healthy"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                          : "border-amber-500/40 text-amber-500"
                      }
                    >
                      {r.status === "healthy" ? "Healthy" : "Watch"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right column: services list */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Activity className="h-4 w-4 text-primary" />
                    Core services
                  </CardTitle>
                  <CardDescription>
                    A quick snapshot of the systems your customers rely on every day.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                  View incident history
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {services.map((service) => (
                    <div
                      key={service.name}
                      className="group relative overflow-hidden rounded-xl border bg-card/80 p-4 transition-colors hover:border-primary/40 hover:bg-card"
                    >
                      <div className="absolute -right-6 -top-10 h-20 w-20 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{service.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Latency · {service.latency}
                          </p>
                        </div>
                        <Badge
                          variant={
                            service.trend === "healthy" ? "secondary" : "destructive"
                          }
                          className={
                            service.trend === "healthy"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                              : "border-amber-500/40 bg-amber-500/5 text-amber-600"
                          }
                        >
                          {service.status}
                        </Badge>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Uptime (30 days)</span>
                          <span className="font-medium text-foreground">
                            {service.uptime.toFixed(2)}%
                          </span>
                        </div>
                        <Progress
                          value={service.uptime}
                          className="h-1.5 bg-muted"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="pt-1 text-[11px] text-muted-foreground">
                  This health view is intentionally human-friendly. Use it to inspire
                  trust during demos, reviews, and onboarding sessions—showing not
                  just that your system works, but that it&apos;s cared for.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;

