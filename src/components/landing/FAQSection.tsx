import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does it take to set up Vericore ERP?",
    answer: "Most businesses are up and running within 24-48 hours. Our onboarding team provides guided setup, data migration assistance, and training to ensure a smooth transition. For enterprise deployments with custom integrations, the timeline may vary based on requirements.",
  },
  {
    question: "Can I migrate data from my existing system?",
    answer: "Yes! We support data migration from most popular ERP systems, spreadsheets, and databases. Our migration tools and team will help you transfer your existing data seamlessly without any loss of information.",
  },
  {
    question: "Is my data secure with Vericore ERP?",
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
    <section id="support" style={{ position: "relative", background: "#0a0a12", padding: "120px 20px", overflow: "hidden" }}>
      <style>{`
        .faq-orb {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%);
          filter: blur(100px);
          top: 20%; right: -150px;
          pointer-events: none;
          animation: orbDrift4 40s ease-in-out infinite alternate;
        }
        .faq-container {
          max-width: 800px;
          margin: 64px auto 0;
          position: relative;
          z-index: 1;
        }
        .faq-accordion-item {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .faq-accordion-item:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        }
        .faq-accordion-item[data-state="open"] {
          background: rgba(255,255,255,0.08);
          border-color: rgba(14,165,233,0.3);
          box-shadow: 0 16px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        }
      `}</style>
      
      <div className="faq-orb" />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <span className="section-label">✦ FAQ</span>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-sub">
          Got questions? We've got answers. Take a look at our most common inquiries.
        </p>
      </div>

      <div className="faq-container">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="faq-accordion-item"
            >
              <AccordionTrigger className="text-left font-medium text-[rgba(255,255,255,0.9)] hover:text-white transition-colors py-5 px-6" style={{ textDecoration: 'none' }}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[rgba(255,255,255,0.5)] font-light leading-relaxed px-6 pb-6 pt-0">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
