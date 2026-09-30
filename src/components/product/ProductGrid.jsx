import React from 'react';
import { ProductCard } from './ProductCard';
import { Sparkles } from 'lucide-react';

export const ProductGrid = ({ products, title, subtitle, emptyMessage }) => {
  if (!products || products.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-[#0C3B10]/10 p-8 my-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF7F2] border border-[#DBAB7D] flex items-center justify-center text-[#0C3B10] mb-3">
          <Sparkles className="w-6 h-6 text-[#DBAB7D]" />
        </div>
        <h3 className="font-serif text-2xl text-[#0C3B10] mb-2">No Matching Styles Found</h3>
        <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto">
          {emptyMessage || "We couldn't find any designs matching your selected filters. Try adjusting your search query or reset filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="text-center mb-10">
          {subtitle && (
            <span className="text-xs uppercase tracking-[0.25em] text-[#DBAB7D] font-semibold block mb-2">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0C3B10] tracking-tight">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Grid: 4 columns on large desktop, 3 on laptop, 2 on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
