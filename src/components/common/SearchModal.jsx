import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Kanjivaram Silk Saree',
    'Chanderi Anarkali',
    'Chikankari Kurti under 2000',
    'Wedding Lehengas'
  ]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { products } = useProducts();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter products live
  const matchingProducts = query.trim().length > 1
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q)
        );
      }).slice(0, 4)
    : [];

  const handleSearchSubmit = (searchWord) => {
    const finalQuery = (searchWord || query).trim();
    if (!finalQuery) return;

    if (!recentSearches.includes(finalQuery)) {
      setRecentSearches((prev) => [finalQuery, ...prev.slice(0, 4)]);
    }
    onClose();
    navigate(`/shop?search=${encodeURIComponent(finalQuery)}`);
  };

  const trendingTags = [
    'Pure Silk Sarees',
    'Bridal Lehengas',
    'Kurti under ₹2500',
    'Organza Floral',
    'Emerald Green Outfits',
    'Velvet Gharara'
  ];

  return (
    <div className="fixed inset-0 z-[110] bg-[#0C3B10]/95 backdrop-blur-md flex flex-col animate-fade-in text-[#FFFFFF]">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-center pb-6 border-b border-[#DBAB7D]/30">
          <span className="font-serif text-2xl tracking-[0.2em] text-[#DBAB7D]">
            VASUDHAETHNIC
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white/80 hover:text-[#DBAB7D] transition-colors p-2 text-sm tracking-widest uppercase font-medium"
            aria-label="Close search"
          >
            <span>Close</span>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Big Search Input */}
        <div className="mt-10 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
            className="relative"
          >
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-[#DBAB7D]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sarees, kurtis, dresses, fabrics or occasions..."
              className="w-full bg-transparent pl-12 pr-12 py-4 text-xl sm:text-3xl font-serif text-[#FFFFFF] placeholder:text-white/40 focus:outline-none border-b-2 border-[#DBAB7D] transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </form>
          <div className="mt-2 text-xs text-[#DBAB7D]/80 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try natural queries like "Wedding dress under ₹3000" or "Emerald Silk Saree"</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left Column: Recent & Trending */}
          <div className="md:col-span-4 space-y-8">
            {/* Trending */}
            <div>
              <div className="flex items-center gap-2 text-[#DBAB7D] text-xs uppercase tracking-[0.2em] font-semibold mb-3">
                <TrendingUp className="w-4 h-4" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSearchSubmit(tag)}
                    className="text-xs px-3 py-1.5 border border-[#DBAB7D]/30 bg-white/5 hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-all text-white/90"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div>
              <div className="text-white/60 text-xs uppercase tracking-[0.2em] font-semibold mb-3">
                Recent Inquiries
              </div>
              <ul className="space-y-2">
                {recentSearches.map((term, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleSearchSubmit(term)}
                      className="text-sm text-white/80 hover:text-[#DBAB7D] flex items-center justify-between w-full group transition-colors py-1"
                    >
                      <span>{term}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#DBAB7D]" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Live Matching Products */}
          <div className="md:col-span-8">
            <div className="text-white/60 text-xs uppercase tracking-[0.2em] font-semibold mb-4">
              {query ? `Suggested Styles (${matchingProducts.length})` : 'Popular Recommendations'}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(query ? matchingProducts : products.slice(0, 4)).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onClose();
                    navigate(`/product/${item.slug || item.id}`);
                  }}
                  className="group cursor-pointer bg-white/5 border border-white/10 hover:border-[#DBAB7D] p-2.5 transition-all"
                >
                  <div className="aspect-[3/4] overflow-hidden mb-2 bg-[#0C3B10]">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-[11px] text-[#DBAB7D] tracking-wider uppercase font-medium truncate">
                    {item.category}
                  </div>
                  <h4 className="text-xs font-serif text-white group-hover:text-[#DBAB7D] line-clamp-1 transition-colors">
                    {item.name}
                  </h4>
                  <div className="text-xs font-semibold text-white mt-1">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {query && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => handleSearchSubmit()}
                  className="px-6 py-2.5 bg-[#DBAB7D] text-[#0C3B10] text-xs font-bold tracking-[0.15em] uppercase hover:bg-white transition-colors"
                >
                  View All Results for "{query}" →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
