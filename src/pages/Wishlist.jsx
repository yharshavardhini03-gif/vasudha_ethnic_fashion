import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/product/ProductCard';

export const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveAllToBag = () => {
    wishlist.forEach((item) => {
      addToCart(item, item.sizes?.[0] || 'Free Size', item.color, 1);
    });
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-[#0C3B10]/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[#DBAB7D] text-xs font-semibold tracking-[0.2em] uppercase mb-1">
              <Heart className="w-4 h-4 fill-current" />
              <span>Saved Couture</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#0C3B10]">
              My Wishlist ({wishlist.length})
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={handleMoveAllToBag}
              className="px-6 py-3 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-[#DBAB7D]" />
              <span>Move All to Bag</span>
            </button>
          )}
        </div>

        {/* Content */}
        {wishlist.length === 0 ? (
          <div className="bg-white p-12 sm:p-16 text-center border border-[#0C3B10]/10 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#DBAB7D] flex items-center justify-center text-[#DBAB7D] mx-auto">
              <Heart className="w-8 h-8 text-[#0C3B10]" />
            </div>
            <h2 className="font-serif text-2xl text-[#0C3B10]">Your Wishlist is Empty</h2>
            <p className="text-xs text-[#666666] leading-relaxed">
              Explore our handcrafted collections and click the heart icon on any saree, lehenga, or anarkali to save your favorites here.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0C3B10] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
