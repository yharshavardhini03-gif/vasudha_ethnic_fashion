import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Sparkles, Check } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size'
  );
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isLiked = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, product.color, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative bg-[#FFFFFF] border border-[#0C3B10]/10 hover:border-[#DBAB7D] transition-all duration-300 flex flex-col justify-between hover:shadow-card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF7F2]">
        <Link to={`/product/${product.slug || product.id}`} className="block w-full h-full">
          <img
            src={isHovered && product.images?.[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="bg-[#0C3B10] text-[#FFFFFF] text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 shadow-sm">
              NEW
            </span>
          )}
          {product.tag && (
            <span className="bg-[#DBAB7D] text-[#0C3B10] text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 shadow-sm">
              {product.tag}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 shadow-sm ${
            isLiked
              ? 'bg-[#0C3B10] text-[#DBAB7D]'
              : 'bg-white/90 text-[#0C3B10] hover:bg-[#0C3B10] hover:text-[#DBAB7D]'
          }`}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-[#DBAB7D]' : ''}`} />
        </button>

        {/* Floating Quick Action Overlay on Desktop Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:flex flex-col gap-2 z-10">
          {/* Size picker */}
          {product.sizes && product.sizes.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 bg-black/40 backdrop-blur-sm p-1">
              <span className="text-[10px] text-white/80 uppercase font-medium mr-1">Size:</span>
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(sz);
                  }}
                  className={`text-[10px] px-1.5 py-0.5 font-bold transition-all ${
                    selectedSize === sz
                      ? 'bg-[#DBAB7D] text-[#0C3B10]'
                      : 'text-white/90 hover:text-[#DBAB7D]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all shadow-md ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#DBAB7D] text-[#0C3B10] hover:bg-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add ({selectedSize})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#666666] mb-1">
            <span className="uppercase tracking-widest text-[#DBAB7D] font-semibold">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#0C3B10] font-medium">
              <Star className="w-3 h-3 fill-[#DBAB7D] text-[#DBAB7D]" />
              <span>{product.rating || '4.8'}</span>
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug || product.id}`} className="block group-hover:text-[#0C3B10]">
            <h3 className="font-serif text-sm sm:text-base font-medium text-[#1A1A1A] line-clamp-1 leading-snug group-hover:text-[#0C3B10] transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-[11px] text-[#666666] font-light line-clamp-1 mt-0.5">
            {product.fabric}
          </p>
        </div>

        {/* Pricing & Mobile Quick Add */}
        <div className="mt-3 pt-2.5 border-t border-[#0C3B10]/5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-bold text-[#0C3B10]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] text-emerald-800 font-semibold tracking-wide">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 bg-[#0C3B10] text-[#DBAB7D] rounded-none hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
