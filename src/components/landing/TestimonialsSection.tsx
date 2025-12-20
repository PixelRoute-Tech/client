import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Operations Director",
    company: "TechFlow Inc.",
    content: "Mantis ERP transformed how we manage our operations. The workflow automation alone saved us 20+ hours per week. Absolutely game-changing.",
    rating: 5,
    initials: "SJ",
  },
  {
    name: "Michael Chen",
    role: "CEO",
    company: "GrowthWave Solutions",
    content: "We evaluated 10+ ERP solutions before choosing Mantis. The intuitive interface and powerful features made the decision easy. Our team adopted it within days.",
    rating: 5,
    initials: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "CFO",
    company: "Nexus Enterprises",
    content: "The reporting capabilities are exceptional. Real-time financial insights have helped us make better decisions and improve our bottom line significantly.",
    rating: 5,
    initials: "ER",
  },
];

const clientLogos = [
  "TechFlow Inc.",
  "GrowthWave",
  "Nexus Ent.",
  "DataSync",
  "CloudFirst",
  "Innovate Co.",
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Loved by Businesses Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our customers have to say about their experience with Mantis ERP.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6 lg:p-8">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Client Logos */}
        <div className="border-t border-border pt-12">
          <p className="text-center text-muted-foreground mb-8">
            Trusted by leading companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {clientLogos.map((logo, index) => (
              <div
                key={index}
                className="text-xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
