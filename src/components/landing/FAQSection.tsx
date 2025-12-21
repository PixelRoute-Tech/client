import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does it take to set up Mantis ERP?",
    answer: "Most businesses are up and running within 24-48 hours. Our onboarding team provides guided setup, data migration assistance, and training to ensure a smooth transition. For enterprise deployments with custom integrations, the timeline may vary based on requirements.",
  },
  {
    question: "Can I migrate data from my existing system?",
    answer: "Yes! We support data migration from most popular ERP systems, spreadsheets, and databases. Our migration tools and team will help you transfer your existing data seamlessly without any loss of information.",
  },
  {
    question: "Is my data secure with Mantis ERP?",
    answer: "Absolutely. We use bank-grade encryption (AES-256) for data at rest and in transit. Our platform is SOC 2 Type II certified, GDPR compliant, and regularly audited by third-party security firms. We also offer on-premise deployment for organizations with specific compliance requirements.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "We offer multiple support tiers: Gold plans include email support with 24-hour response time, Diamond plans get priority support with 4-hour response, and Platinum plans receive dedicated account management with immediate support access, including phone and video calls.",
  },
  {
    question: "Can I customize the workflows for my business?",
    answer: "Yes! Our Work Builder feature allows you to create custom workflows, forms, and automation rules without any coding. For advanced customizations, our API and developer tools enable deep integrations with your existing systems.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 14-day free trial on our Gold and Diamond plans. You'll have full access to all features during the trial period. No credit card required to start.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 lg:py-32 bg-background" id="support">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers. If you can't find what you're looking for, 
            feel free to contact our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
