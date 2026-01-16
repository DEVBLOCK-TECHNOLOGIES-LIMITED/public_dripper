import React from "react";
import TrendingProducts from "../components/TrendingProducts";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";
import {
  HiOutlineArrowRight,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineTruck,
} from "react-icons/hi";
import { FaCoins } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div className="mb-12 lg:mb-0">
              <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-bold tracking-wider uppercase mb-6 animate-pulse">
                New Collection 2026
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                Redefine Your <br />
                <span className="text-purple-600">Digital Style.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Discover the intersection of luxury and technology. Shop the
                finest curated collection of premium gadgets and apparel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/catalog"
                  className="bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition transform hover:-translate-y-1 shadow-lg shadow-black/10"
                >
                  Shop Now <HiOutlineArrowRight className="text-xl" />
                </Link>
                <Link
                  to="/catalog"
                  className="bg-white text-black border-2 border-black px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                >
                  View Collections
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              <img
                src={heroImg}
                alt="Premium Products"
                className="relative z-10 w-full rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-purple-50 transition group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600 text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <HiOutlineTruck />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  Free Express Delivery
                </h3>
                <p className="text-sm text-gray-500">Orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-purple-50 transition group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600 text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <HiOutlineShieldCheck />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Secure Payments</h3>
                <p className="text-sm text-gray-500">100% encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-purple-50 transition group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600 text-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <HiOutlineLightningBolt />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Instant Support</h3>
                <p className="text-sm text-gray-500">24/7 Priority help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Shop by Category
              </h2>
              <p className="text-gray-500">
                Find exactly what you're looking for.
              </p>
            </div>
            <Link
              to="/catalog"
              className="text-purple-600 font-bold hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {["Smartphones", "Apparel", "Accessories", "Footwear"].map(
              (cat, i) => (
                <Link
                  key={i}
                  to={`/catalog?category=${cat}`}
                  className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 transition-opacity group-hover:opacity-80"></div>
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-white font-bold text-xl">{cat}</h3>
                    <span className="text-white/80 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore <HiOutlineArrowRight />
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gray-200 group-hover:scale-110 transition-transform duration-700">
                    <div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-300 font-black text-4xl">
                      {cat[0]}
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Credits Promo Banner */}
      <section className="py-16 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMThzOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4LTguMDYtMTgtMTgtMTh6bTAgMzJjLTcuNzMyIDAtMTQtNi4yNjgtMTQtMTRzNi4yNjgtMTQgMTQtMTQgMTQgNi4yNjggMTQgMTQtNi4yNjggMTQtMTQgMTR6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-bold mb-4">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Limited Time Offer
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">
                Get Up To{" "}
                <span className="underline decoration-wavy">30% Bonus</span>{" "}
                Credits!
              </h2>
              <p className="text-white/90 text-lg max-w-xl">
                Purchase store credits and save on all your future orders. The
                more you buy, the more bonus credits you receive.
              </p>
            </div>
            <Link
              to="/credits"
              className="flex items-center gap-3 bg-white text-amber-600 px-8 py-4 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all shadow-2xl shadow-amber-900/30 hover:-translate-y-1"
            >
              <FaCoins className="text-2xl" />
              Shop Credits Now
              <HiOutlineArrowRight className="text-xl" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trending Now
            </h2>
            <div className="w-20 h-1.5 bg-purple-600 mx-auto rounded-full"></div>
          </div>
          <TrendingProducts />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
