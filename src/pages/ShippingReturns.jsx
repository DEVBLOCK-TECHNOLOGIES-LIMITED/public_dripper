import { FaShippingFast } from "react-icons/fa";
import { Link } from "react-router-dom";

function ShippingReturns() {
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
            <FaShippingFast className="text-2xl text-noir-900" />
          </div>
          <p className="text-gold-500 text-sm font-bold uppercase tracking-widest mb-3">
            Orders & Delivery
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-champagne-100 mb-6">
            Shipping & Returns
          </h1>
          <p className="text-champagne-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We are committed to delivering your luxury items safely and
            efficiently. Please review our shipping and returns policies below.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Shipping */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Shipping
            </h2>
            <ul className="space-y-3 mb-6">
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                We currently ship within the United Kingdom.
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Orders are processed within 1–3 business days after payment
                confirmation.
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                All shipments are insured and tracked.
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Delivery times may vary depending on location and courier
                service.
              </li>
            </ul>
            <p className="text-champagne-400 text-sm italic border-l-2 border-gold-500/30 pl-4 py-1">
              PublicDripper is not responsible for delays caused by couriers,
              customs, or circumstances beyond our control.
            </p>
          </div>

          {/* Returns */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Returns
            </h2>
            <ul className="space-y-3 mb-6">
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                We offer 14-day returns from the date of delivery.
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Items must be returned in the same condition as received, with
                all original packaging and accessories.
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Returns must be approved before being sent back.
              </li>
            </ul>
            <p className="text-champagne-400">
              To initiate a return, please contact us via our{" "}
              <Link
                to="/contact"
                className="text-gold-500 hover:text-gold-400 underline underline-offset-2 transition-colors"
              >
                Contact page
              </Link>{" "}
              within 14 days of delivery.
            </p>
          </div>

          {/* Non-Returnable Items */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Non-Returnable Items
            </h2>
            <p className="text-champagne-400 mb-4">
              We reserve the right to refuse returns if:
            </p>
            <ul className="space-y-3">
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                The item shows signs of wear or damage after delivery
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                Original packaging or accessories are missing
              </li>
              <li className="text-champagne-300 flex items-start gap-3 leading-relaxed">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2.5 flex-shrink-0"></span>
                The return request falls outside the 14-day window
              </li>
            </ul>
          </div>

          {/* Refunds */}
          <div className="bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-3xl p-8 hover:border-gold-500/40 transition-all duration-300">
            <h2 className="font-display text-xl font-bold text-gold-500 mb-5">
              Refunds
            </h2>
            <p className="text-champagne-300 leading-relaxed">
              Once a return is approved and received, refunds will be processed
              to the original payment method within a reasonable timeframe.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-noir-800/50 backdrop-blur-sm border border-gold-500/20 rounded-full px-6 py-3">
            <FaShippingFast className="text-gold-500 text-sm" />
            <span className="text-champagne-400 text-sm">
              Secure shipping & hassle-free returns
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingReturns;
