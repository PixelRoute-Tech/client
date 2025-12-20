import { 
  UserPlus, 
  ClipboardList, 
  Wrench, 
  FileBarChart, 
  Users,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: UserPlus,
    title: "Easy Client Onboarding",
    description: "Simple and fast client registration and management. Streamline your intake process with automated workflows.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: ClipboardList,
    title: "Easy Job Request",
    description: "Create, track, and manage job requests effortlessly. Never lose sight of important tasks and deadlines.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Wrench,
    title: "Customisable Work Builder",
    description: "Flexible workflow builder to match your unique business needs. Create templates and automate processes.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: FileBarChart,
    title: "Report Generation",
    description: "Generate detailed operational and financial reports. Make data-driven decisions with powerful analytics.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Users,
    title: "Employee Management",
    description: "Manage staff, roles, attendance, and performance. Keep your team organized and productive.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Settings,
    title: "System Integration",
    description: "Connect with your existing tools and platforms. Seamless API integrations for maximum efficiency.",
    color: "from-slate-500 to-slate-700",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32 bg-background" id="features">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to streamline your business operations and drive growth.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6 lg:p-8">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover accent */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                     style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
