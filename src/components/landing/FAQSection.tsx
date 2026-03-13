import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is your data security and encryption standard?",
    answer: "Vericore uses AES-256 for all data at rest and TLS 1.3 for data in transit. We maintain a SOC2 compliant environment and conduct regular third-party penetration tests to ensure your enterprise data remains secure.",
  },
  {
    question: "How do you handle data ownership and porting?",
    answer: "You own all your data. Our platform provides full export capabilities in structured formats (CSV, JSON, PDF) at any time. There is no vendor lock-in; we believe our value should keep you on the platform, not technical barriers.",
  },
  {
    question: "Can we integrate this with our existing ERP/CRM via API?",
    answer: "Yes. Our platform is built with an API-first architecture. Our REST API and Webhook system allow for deep integration with existing systems like SAP, Oracle, and Salesforce. Documentation is available on our Pro and Enterprise plans.",
  },
  {
    question: "What is your guaranteed uptime SLA?",
    answer: "Our Pro plan includes a 99.9% uptime SLA, while the Enterprise plan offers a 99.99% uptime guarantee. We use multi-region redundant architectures to ensure high availability across all services.",
  },
  {
    question: "Does the platform support on-premise deployment?",
    answer: "Yes. For Enterprise clients with specific regulatory or security requirements, we offer on-premise deployment options behind your private VPC or on physical hardware.",
  },
  {
    question: "What kind of onboarding support is provided?",
    answer: "Every subscription includes access to our technical documentation. Pro users receive guided onboarding, while Enterprise users get a dedicated solution architect to assist with initial setup and migration.",
  },
];

export function FAQSection() {
  return (
    <section id="support" style={{ background: "#0f172a", padding: "120px 24px" }}>
      <style>{`
        .faq-wrapper {
          max-width: 800px;
          margin: 0 auto;
        }
        .faq-item-solid {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 12px;
          overflow: hidden;
        }
        .faq-trigger {
          padding: 20px 24px;
          font-size: 16px;
          font-weight: 600;
          color: #f8fafc;
          text-align: left;
          width: 100%;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: none;
          border: none;
          transition: background 0.2s ease;
        }
        .faq-trigger:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .faq-content-inner {
          padding: 0 24px 20px;
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.6;
        }
      `}</style>

      <div className="faq-wrapper">
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <span className="section-label">Questions</span>
          <h2 className="section-title">Technical FAQ</h2>
          <p className="section-sub">
            Direct answers to common technical and operational questions.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="faq-item-solid">
              <AccordionTrigger className="faq-trigger" style={{ textDecoration: 'none' }}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="faq-content-inner">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
