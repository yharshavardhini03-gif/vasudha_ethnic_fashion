import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MOCK_CATEGORIES } from '../../data/mockCategories';

export const CategorySection = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#0C3B10]/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-[#DBAB7D] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Silhouettes</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#0C3B10] font-normal tracking-tight">
            Explore Our Collections
          </h2>
          <div className="w-16 h-0.5 bg-[#DBAB7D] mx-auto my-4" />
          <p className="text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
            Curated styles for every celebration, occasion and moment. Handwoven with heirloom dedication across India's premier artisanal weaving hubs.
          </p>
        </div>

        {/* Asymmetrical Editorial Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CATEGORIES.map((category, idx) => (
            <Link
              key={category.id}
              to={category.link}
              className={`group relative overflow-hidden bg-[#0C3B10] shadow-sm border border-[#0C3B10]/10 hover:border-[#DBAB7D] transition-all duration-500 ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
              }`}
            >
              {/* Image with zoom on hover */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out"
                loading="lazy"
              />

              {/* Gradient & Beige overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C3B10]/90 via-[#0C3B10]/40 to-transparent group-hover:from-[#0C3B10] group-hover:via-[#0C3B10]/60 transition-all duration-500" />
              <div className="absolute inset-0 bg-[#DBAB7D]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-[#DBAB7D] text-[#0C3B10] text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 shadow-md">
                  {category.featuredTag}
                </span>
              </div>

              {/* Text info bottom */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 z-10 flex flex-col justify-end">
                <span className="text-[10px] text-[#DBAB7D] uppercase tracking-[0.2em] font-medium mb-1">
                  {category.itemCount}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium mb-2 group-hover:text-[#DBAB7D] transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-white/80 font-light max-w-md line-clamp-1 mb-4 hidden sm:block">
                  {category.subtitle}
                </p>

                <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#DBAB7D] group-hover:text-white transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
