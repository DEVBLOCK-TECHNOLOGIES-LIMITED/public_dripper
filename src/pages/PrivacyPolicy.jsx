import { FaShieldAlt } from "react-icons/fa";

function PrivacyPolicy() {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal identification information (name, email address, phone number, shipping address)",
        "Payment information (processed securely through our payment partners)",
        "Browsing behavior and preferences on our website",
        "Communication records when you contact our concierge team",
      ],
    },
    {
      title: "How We Use Your Information",
      content: [
        "To process and fulfill your orders for luxury handbags",
        "To provide personalized shopping recommendations",
        "To communicate with you about your orders and our services",
        "To send exclusive offers and updates (with your consent)",
        "To improve our website and customer experience",
        "To prevent fraudulent transactions and ensure security",
      ],
    },
    {
      title: "Information Protection",
      content: [
        "We implement industry-standard SSL encryption for all data transmission",
        "Payment information is processed through PCI-compliant payment processors",
        "Access to personal information is restricted to authorized personnel only",
        "Regular security audits and updates are performed on our systems",
      ],
    },
    {
      title: "Cookies & Tracking",
      content: [
        "We use essential cookies to enable core website functionality",
        "Analytics cookies help us understand how visitors interact with our site",
        "Preference cookies remember your settings and personalization choices",
        "You can manage cookie preferences through your browser settings",
      ],
    },
    {
      title: "Third-Party Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "Information may be shared with shipping partners to deliver your orders",
        "Payment processors receive necessary data to complete transactions",
        "We may share data when required by law or to protect our rights",
      ],
    },
    {
      title: "Your Rights",
      content: [
        "Access and review the personal information we hold about you",
        "Request correction of inaccurate or incomplete data",
        "Request deletion of your personal information (subject to legal requirements)",
        "Opt-out of marketing communications at any time",
        "Data portability - receive your data in a structured format",
      ],
    },
    {
      title: "Data Retention",
      content: [
        "We retain your information for as long as necessary to provide our services",
        "Transaction records are kept for accounting and legal compliance purposes",
        "You may request deletion of your account and associated data at any time",
      ],
    },
    {
      title: "Contact Us",
      content: [
        "For any privacy-related questions or requests, please contact our team",
        "Email: privacy@publicdripper.com",
        "We aim to respond to all inquiries within 48 hours",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-noir-900 py-16 px-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-gold-500 via-gold-400 to-gold-600 rounded-2xl mb-6 shadow-lg shadow-gold-500/30">
            <FaShieldAlt className="text-2xl text-noir-900" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-champagne-100 mb-4">
            Privacy Policy
          </h1>
          <p className="text-champagne-400 max-w-2xl mx-auto text-lg">
            Your privacy is paramount to us. This policy outlines how
            PublicDripper collects, uses, and protects your personal
            information.
          </p>
          <p className="text-champagne-500 text-sm mt-4">
            Last updated: January 2026
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300"
            >
              <h2 className="font-display text-xl font-bold text-gold-500 mb-5 flex items-center gap-3">
                <span className="w-8 h-8 bg-gold-500/10 rounded-lg flex items-center justify-center text-sm text-gold-400">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="text-champagne-300 flex items-start gap-3 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-full px-6 py-3">
            <FaShieldAlt className="text-gold-500 text-sm" />
            <span className="text-champagne-400 text-sm">
              We are committed to protecting your privacy and ensuring data
              security
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
