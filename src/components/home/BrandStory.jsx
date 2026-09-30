import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Award, Heart, CheckCircle2 } from 'lucide-react';

export const BrandStory = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#0C3B10] text-[#FFFFFF] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#DBAB7D]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Dual Image Collage */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden border border-[#DBAB7D]/40 mt-8">
                <img
                  src="/half-saree-kalamkari.jpg"
                  alt="Vasudha Exclusive Kalamkari Half Saree"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden border border-[#DBAB7D]/40">
                <img
                  src="/bridal-lehenga-pastel.jpg"
                  alt="Vasudha Handcrafted Bridal Lehanga"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Floating Heritage Seal */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#DBAB7D] text-[#0C3B10] p-4 shadow-2xl flex items-center gap-3 border border-white/20 whitespace-nowrap">
              <Award className="w-6 h-6 text-[#0C3B10]" />
              <div>
                <div className="font-serif text-sm font-bold tracking-wider uppercase">
                  Silk Mark Certified
                </div>
                <div className="text-[10px] font-medium tracking-wide opacity-80">
                  Direct From Master Artisan Clusters
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-[#DBAB7D] text-xs font-semibold tracking-[0.25em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Artisanal Legacy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-white">
              Woven with Soul. <br />
              <span className="italic text-[#DBAB7D]">Tailored for Modern Royalty.</span>
            </h2>

            <p className="text-sm text-white/80 font-light leading-relaxed">
              VasudhaEthnic began as an intimate WhatsApp atelier serving bespoke drapes to passionate patrons. Today, we partner directly with generational weaver communities in Varanasi, Kanchipuram, and Chanderi — preserving ancient looms while crafting contemporary silhouettes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white/5 border border-white/10 space-y-1">
                <h4 className="font-serif text-lg text-[#DBAB7D]">Pure Zari Threads</h4>
                <p className="text-xs text-white/70 font-light">Authentic tested metallic brocade tested for heirloom durability.</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 space-y-1">
                <h4 className="font-serif text-lg text-[#DBAB7D]">Fair Trade Artisan Hubs</h4>
                <p className="text-xs text-white/70 font-light">Empowering 120+ rural craftswomen with fair wages & healthcare.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#DBAB7D] text-[#0C3B10] text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-all shadow-md"
              >
                <span>Read The Vasudha Story</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
