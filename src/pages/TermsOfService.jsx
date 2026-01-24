import { FaScroll } from "react-icons/fa";

function TermsOfService() {
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
            <FaScroll className="text-2xl text-noir-900" />
          </div>
          <p className="text-gold-500 text-sm font-bold uppercase tracking-widest mb-3">
            📜 Terms of Service
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-champagne-100 mb-6">
            Terms of Service
          </h1>
          <p className="text-champagne-400 max-w-2xl mx-auto text-lg leading-relaxed">
            By accessing or using the PublicDripper website, you agree to be
            bound by the following Terms of Service. If you do not agree, please
            do not use our services.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Products & Descriptions */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Products & Descriptions
            </h2>
            <p className="text-champagne-300 leading-relaxed">
              We specialise in authenticated pre-owned luxury handbags. Product
              descriptions, images, and details are provided for informational
              purposes only. Minor variations may occur due to lighting, display
              settings, or the pre-owned nature of items.
            </p>
          </div>

          {/* Authenticity */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Authenticity
            </h2>
            <p className="text-champagne-300 leading-relaxed">
              All items sold by PublicDripper are independently sourced and
              verified prior to dispatch. We guarantee the authenticity of every
              product sold.
            </p>
          </div>

          {/* Pricing & Availability */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Pricing & Availability
            </h2>
            <p className="text-champagne-300 leading-relaxed">
              Prices are listed in GBP unless otherwise stated and are subject
              to change without notice. Product availability is limited and
              items may sell out at any time.
            </p>
          </div>

          {/* Orders */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Orders
            </h2>
            <p className="text-champagne-300 leading-relaxed">
              We reserve the right to refuse or cancel any order at our
              discretion, including but not limited to cases of suspected fraud
              or incorrect pricing.
            </p>
          </div>

          {/* Payments */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Payments
            </h2>
            <p className="text-champagne-300 leading-relaxed">
              Payment must be received in full before an order is dispatched.
              Ownership of goods transfers only after full payment has been
              confirmed.
            </p>
          </div>

          {/* Intellectual Property */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Intellectual Property
            </h2>
            <p className="text-champagne-300 leading-relaxed">
              All content on this website, including images, logos, text, and
              design elements, is the property of PublicDripper and may not be
              used without permission.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Limitation of Liability
            </h2>
            <p className="text-champagne-300 leading-relaxed">
              PublicDripper shall not be liable for indirect, incidental, or
              consequential damages arising from the use of our website or
              products, except where required by law.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-full px-6 py-3">
            <FaScroll className="text-gold-500 text-sm" />
            <span className="text-champagne-400 text-sm">
              Thank you for choosing PublicDripper
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
