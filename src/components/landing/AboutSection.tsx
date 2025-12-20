import { CheckCircle2, Shield, Zap, Globe } from "lucide-react";

const highlights = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance for seamless operations",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and compliance",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Multi-region deployment and localization",
  },
];

export function AboutSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30" id="about">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              About Our Platform
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              Simplify Your Business Operations
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Mantis ERP is designed to transform how enterprises manage their operations. 
              Our platform seamlessly integrates all aspects of your business—from client 
              management and job requests to workflow automation and comprehensive reporting.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Built for scalability, our solution adapts to businesses of all sizes. Whether 
              you're a growing startup or an established enterprise, Mantis provides the 
              flexibility and power you need to stay ahead.
            </p>

            {/* Checkmarks */}
            <div className="space-y-4">
              {[
                "Scalable infrastructure for any business size",
                "Customizable workflows to match your needs",
                "Real-time analytics and reporting",
                "Secure data management with compliance",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual / Stats Card */}
          <div className="relative">
            <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
              <div className="space-y-8">
                {highlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative element */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
