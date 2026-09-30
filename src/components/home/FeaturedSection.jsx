import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ProductGrid } from '../product/ProductGrid';

export const FeaturedSection = () => {
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Sarees', 'Kurtis', 'Dresses', 'Lehengas'];

  const filteredProducts = activeTab === 'All'
    ? products.slice(0, 8)
    : products.filter((p) => p.category === activeTab).slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#0C3B10]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-[#DBAB7D] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated For You</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#0C3B10] font-normal tracking-tight">
            The Signature Edit
          </h2>
          <div className="w-16 h-0.5 bg-[#DBAB7D] mx-auto my-4" />
          <p className="text-xs sm:text-sm text-[#666666] font-light leading-relaxed">
            Signature pieces selected from the latest VasudhaEthnic collection, crafted for weddings, grand soirees, and timeless festive memories.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2 text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-[#0C3B10] text-[#FFFFFF] shadow-sm'
                  : 'bg-[#FAF7F2] text-[#0C3B10] hover:bg-[#DBAB7D]/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <ProductGrid products={filteredProducts} />

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-all duration-300 shadow-md border border-[#0C3B10]"
          >
            <span>VIEW ALL ETHNIC DESIGNS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
