import React from 'react';
import { X, Sparkles, Star, ShoppingBag, Truck, ShieldCheck, Check } from 'lucide-react';

export const ProductPreviewModal = ({ isOpen, onClose, productData, onPublish }) => {
  if (!isOpen) return null;

  const totalStock = productData.variants?.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0) || productData.stock || 0;
  const discount = productData.originalPrice
    ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border-2 border-[#DBAB7D] max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-[#0C3B10]"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2 text-[#DBAB7D] mb-1">
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Customer Storefront Simulation</span>
        </div>
        <h3 className="font-serif text-2xl text-[#0C3B10] font-bold mb-6">
          Live Product Preview
        </h3>

        {/* Storefront Product Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border border-gray-100 p-4 bg-[#FAF7F2]">
          {/* Left: Image */}
          <div className="md:col-span-5 aspect-[3/4] bg-white border border-[#DBAB7D]/40 overflow-hidden relative">
            <img
              src={productData.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85'}
              alt={productData.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 bg-[#0C3B10] text-[#DBAB7D] text-[9px] font-bold uppercase px-2 py-0.5">
              {productData.tag || 'New Collection'}
            </span>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#DBAB7D]">
                {productData.category} • {productData.fabric}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#0C3B10] leading-tight">
                {productData.name || 'Untitled Couture Dress'}
              </h2>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#0C3B10]">
                  ₹{Number(productData.price || 0).toLocaleString('en-IN')}
                </span>
                {productData.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{Number(productData.originalPrice).toLocaleString('en-IN')}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-[10px] bg-[#0C3B10] text-[#DBAB7D] font-bold px-2 py-0.5 uppercase">
                    Save {discount}%
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-600 line-clamp-3">
              {productData.description || 'Exquisite handcrafted silhouette tailored with master artisan craft.'}
            </p>

            {/* Colors */}
            {productData.colors?.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1.5">
                  Available Shades ({productData.colors.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {productData.colors.map((c) => (
                    <span key={c} className="px-2.5 py-1 bg-white border border-[#0C3B10]/20 text-xs font-semibold text-[#0C3B10]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {productData.sizes?.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1.5">
                  Sizes in Stock:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {productData.sizes.map((s) => (
                    <span key={s} className="px-3 py-1 bg-white border border-[#0C3B10] text-xs font-bold text-[#0C3B10]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery & Status */}
            <div className="pt-2 border-t border-gray-200 text-xs space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>{totalStock} units available in boutique inventory</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                <Truck className="w-3.5 h-3.5 text-[#DBAB7D]" />
                <span>Delivery: {productData.delivery?.time || '3–5 days'} across India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50"
          >
            Back to Editor
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onPublish();
            }}
            className="px-8 py-2.5 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors"
          >
            Publish Product Now
          </button>
        </div>
      </div>
    </div>
  );
};
