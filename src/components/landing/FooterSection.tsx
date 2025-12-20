import { Link } from "react-router-dom";
import { Linkedin, Twitter, Facebook, Youtube, Github } from "lucide-react";

const footerLinks = {
  product: [
    { label: "About ERP", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Book a Demo", href: "#contact" },
  ],
  documentation: [
    { label: "User Guide", href: "#documentation" },
    { label: "API Documentation", href: "#documentation" },
    { label: "Setup & Installation", href: "#documentation" },
    { label: "Release Notes", href: "#documentation" },
  ],
  support: [
    { label: "Help Center", href: "#support" },
    { label: "FAQs", href: "#support" },
    { label: "Contact Support", href: "#contact" },
    { label: "Raise a Ticket", href: "#contact" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Github, href: "#", label: "GitHub" },
];

export function FooterSection() {
  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300" id="documentation">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center font-bold text-xl text-primary-foreground">
                  M
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Mantis</h3>
                  <p className="text-xs text-slate-400">ERP Solution</p>
                </div>
              </div>
              <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
                Streamline your business operations with our comprehensive ERP platform. 
                From client management to advanced analytics—all in one place.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <p>123 Business Avenue, Suite 500</p>
                <p>San Francisco, CA 94102</p>
                <p className="text-primary">sales@mantis-erp.com</p>
                <p>+1 (800) MANTIS-1</p>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documentation Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Documentation</h4>
              <ul className="space-y-3">
                {footerLinks.documentation.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Support & Help</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            <p>&copy; {new Date().getFullYear()} Mantis ERP. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors text-sm">
              Terms & Conditions
            </button>
            <span className="text-slate-600">|</span>
            <button className="text-slate-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
