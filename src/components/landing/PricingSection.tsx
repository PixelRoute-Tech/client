import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Gold",
    icon: "🟡",
    description: "Perfect for small teams getting started",
    price: "$49",
    period: "/month",
    features: [
      "Basic ERP features",
      "Up to 5 users",
      "Standard support",
      "5GB storage",
      "Email notifications",
      "Basic reporting",
    ],
    buttonText: "Start Free Trial",
    popular: false,
  },
  {
    name: "Diamond",
    icon: "🔵",
    description: "Best for growing businesses",
    price: "$99",
    period: "/month",
    features: [
      "Advanced ERP features",
      "Up to 25 users",
      "Priority support",
      "50GB storage",
      "Advanced analytics",
      "Custom workflows",
      "API access",
      "Team collaboration",
    ],
    buttonText: "Subscribe Now",
    popular: true,
  },
  {
    name: "Platinum",
    icon: "🟣",
    description: "For large enterprises",
    price: "Custom",
    period: "",
    features: [
      "Full ERP features",
      "Unlimited users",
      "Dedicated support",
      "Unlimited storage",
      "Custom integrations",
      "White-label option",
      "SLA guarantee",
      "On-premise deployment",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30" id="pricing">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            Flexible pricing options designed to scale with your business needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/10 scale-105"
                  : "border-border hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="text-4xl mb-4">{plan.icon}</div>
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
