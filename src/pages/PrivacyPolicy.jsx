import { FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function PrivacyPolicy() {
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
          <p className="text-gold-500 text-sm font-bold uppercase tracking-widest mb-3">
            🔐 Privacy Policy
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-champagne-100 mb-6">
            Privacy Policy
          </h1>
          <p className="text-champagne-400 max-w-2xl mx-auto text-lg leading-relaxed">
            At PublicDripper, we respect your privacy and are committed to
            protecting your personal data. This Privacy Policy explains how we
            collect, use, and safeguard your information when you visit or make
            a purchase from our website.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Information We Collect
            </h2>
            <p className="text-champagne-400 mb-4">
              We may collect the following information:
            </p>
            <ul className="space-y-3">
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Personal details such as your name, email address, billing
                address, shipping address, and phone number
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Payment information (processed securely via third-party payment
                providers)
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Order history and transaction details
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Technical data such as IP address, browser type, and device
                information
              </li>
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              How We Use Your Information
            </h2>
            <p className="text-champagne-400 mb-4">
              Your information is used to:
            </p>
            <ul className="space-y-3">
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Process and fulfil orders
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Communicate with you regarding purchases, delivery, or customer
                support
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Improve our website, products, and services
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Comply with legal and regulatory obligations
              </li>
            </ul>
          </div>

          {/* Payment Processing */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Payment Processing
            </h2>
            <p className="text-champagne-300 leading-relaxed">
              All payments are processed securely through third-party providers.
              We do not store or have direct access to your full payment
              details.
            </p>
          </div>

          {/* Data Sharing */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Data Sharing
            </h2>
            <p className="text-champagne-400 mb-4">
              We do not sell or rent your personal data. We may share limited
              information with trusted third parties only where necessary to:
            </p>
            <ul className="space-y-3">
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Process payments
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Deliver orders
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Comply with legal obligations
              </li>
            </ul>
          </div>

          {/* Data Security */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Data Security
            </h2>
            <p className="text-champagne-300 leading-relaxed">
              We take reasonable measures to protect your personal information
              from unauthorised access, loss, or misuse. However, no method of
              transmission over the internet is completely secure.
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Your Rights
            </h2>
            <p className="text-champagne-400 mb-4">You have the right to:</p>
            <ul className="space-y-3">
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Access, correct, or request deletion of your personal data
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Withdraw consent for marketing communications at any time
              </li>
            </ul>
            <p className="text-champagne-400 mt-6">
              To exercise your rights, please contact us via our{" "}
              <Link
                to="/contact"
                className="text-gold-500 hover:text-gold-400 underline underline-offset-2 transition-colors"
              >
                Contact page
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-full px-6 py-3">
            <FaShieldAlt className="text-gold-500 text-sm" />
            <span className="text-champagne-400 text-sm">
              Your privacy matters to us
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
