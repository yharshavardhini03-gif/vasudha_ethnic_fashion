import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const Hero = ({ onOpenAI }) => {
  return (
    <section className="relative bg-[#0C3B10] text-[#FFFFFF] overflow-hidden min-h-[85vh] flex items-center border-b border-[#DBAB7D]/30">
      {/* Background Indian Textile Motif Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#DBAB7D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#DBAB7D]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative filigree line elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#DBAB7D_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LEFT: Editorial Content */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 animate-fade-up">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-[#DBAB7D]/40 bg-white/5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DBAB7D]" />
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#DBAB7D] uppercase">
                THE ART OF INDIAN ELEGANCE
              </span>
            </div>

            {/* Large Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#FFFFFF] leading-[1.08]">
              Tradition, <br />
              <span className="italic font-light text-[#DBAB7D]">Reimagined.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-lg">
              Discover timeless ethnic fashion crafted for the modern Indian wardrobe. Pure handloom silks, authentic zardozi embroidery, and bespoke tailoring delivered to your doorstep.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/shop"
                className="px-8 py-4 bg-[#DBAB7D] text-[#0C3B10] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#FFFFFF] transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-luxury group"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={onOpenAI}
                className="px-8 py-4 border border-[#DBAB7D] text-[#FFFFFF] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-[#DBAB7D]" />
                <span>ASK VASUDHA AI</span>
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-6 border-t border-white/10 flex items-center gap-8 text-xs text-white/70">
              <div>
                <div className="font-serif text-2xl font-bold text-[#DBAB7D]">10,000+</div>
                <div className="text-[10px] tracking-wider uppercase text-white/60">Patrons Across India</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <div className="font-serif text-2xl font-bold text-[#DBAB7D]">100%</div>
                <div className="text-[10px] tracking-wider uppercase text-white/60">Handloom Verified</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <div className="font-serif text-2xl font-bold text-[#DBAB7D]">4.9 ★</div>
                <div className="text-[10px] tracking-wider uppercase text-white/60">Boutique Rating</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Large Editorial Image with Gold Borders */}
          <div className="lg:col-span-6 relative animate-fade-in">
            {/* Outer offset frame */}
            <div className="absolute -inset-3 border border-[#DBAB7D]/40 translate-x-3 translate-y-3 hidden sm:block pointer-events-none" />

            <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden shadow-2xl bg-[#07240a] border border-[#DBAB7D]/50 group">
              <img
                src="/hero-main.jpg"
                alt="Vasudha Ethnic Wedding Collection"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              />

              {/* Gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C3B10]/85 via-transparent to-transparent opacity-75" />

              {/* Floating product spotlight pill */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0C3B10]/95 backdrop-blur-md border border-[#DBAB7D]/40 flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-bold tracking-[0.2em] text-[#DBAB7D] uppercase">
                    WEDDING COLLECTION
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-medium text-white">
                    Royal Gulabi Handcrafted Lehenga
                  </h3>
                  <div className="text-xs text-white/80 font-bold">₹8,499</div>
                </div>
                <Link
                  to="/shop?category=Lehengas"
                  className="px-3 py-1.5 bg-[#DBAB7D] text-[#0C3B10] text-[10px] font-bold tracking-wider uppercase hover:bg-white transition-colors"
                >
                  Explore Edit →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
