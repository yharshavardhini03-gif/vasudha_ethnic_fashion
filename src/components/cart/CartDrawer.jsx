import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, Sparkles, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItemsCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    shippingFee,
    isFreeShipping,
    amountToFreeShipping,
    shippingProgress,
    grandTotal,
    FREE_SHIPPING_THRESHOLD
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-[120] animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FFFFFF] shadow-2xl flex flex-col justify-between z-10 animate-slide-left border-l border-[#DBAB7D]/30">
        {/* Header */}
        <div className="p-5 border-b border-[#0C3B10]/10 bg-[#0C3B10] text-[#FFFFFF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#DBAB7D]" />
            <h3 className="font-serif text-xl tracking-wider uppercase text-[#FFFFFF]">
              Your Bag ({totalItemsCount})
            </h3>
          </div>
          <button
            onClick={closeCart}
            className="text-white/80 hover:text-[#DBAB7D] p-1 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-[#FAF7F2] p-4 border-b border-[#DBAB7D]/20 text-xs">
          {isFreeShipping ? (
            <div className="flex items-center gap-2 text-[#0C3B10] font-semibold">
              <Sparkles className="w-4 h-4 text-[#DBAB7D] flex-shrink-0" />
              <span>Complimentary Express Shipping Unlocked! 🥂</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[#0C3B10]">
                <span>Add <strong>₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more for <strong>FREE Express Delivery</strong></span>
              </div>
              <div className="w-full bg-[#DBAB7D]/20 h-1.5 overflow-hidden">
                <div
                  className="bg-[#0C3B10] h-full transition-all duration-500 ease-out"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#DBAB7D] flex items-center justify-center text-[#DBAB7D]">
                <ShoppingBag className="w-8 h-8 text-[#0C3B10]" />
              </div>
              <h4 className="font-serif text-2xl text-[#0C3B10]">Your Bag is Empty</h4>
              <p className="text-xs text-[#666666] max-w-xs leading-relaxed">
                Discover our signature silk sarees, royal bridal lehengas, and artisanal Chikankari edits.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
                className="px-6 py-3 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-all border border-[#0C3B10]"
              >
                Explore Collections →
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="flex gap-4 p-3.5 bg-[#FAF7F2] border border-[#0C3B10]/10 relative group"
              >
                {/* Image */}
                <div className="w-20 h-24 bg-white border border-[#DBAB7D]/30 flex-shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs sm:text-sm font-serif text-[#0C3B10] font-semibold line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-[#FFFFFF] border border-[#DBAB7D]/40 text-[#0C3B10] px-1.5 py-0.5 font-medium uppercase">
                        Size: {item.size}
                      </span>
                      {item.color && (
                        <span className="text-[10px] text-[#666666] truncate max-w-[110px]">
                          {item.color}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Quantity Controls */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#0C3B10]/5">
                    <div className="flex items-center border border-[#0C3B10]/20 bg-white">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1 hover:bg-[#FAF7F2] text-[#0C3B10] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-[#0C3B10] min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1 hover:bg-[#FAF7F2] text-[#0C3B10] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#0C3B10]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice && (
                        <span className="block text-[10px] text-gray-400 line-through">
                          ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#0C3B10]/10 bg-white space-y-4">
            {/* Coupon Code section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#0C3B10]/5 border border-[#0C3B10]/20 p-2 text-xs">
                  <div className="flex items-center gap-1.5 text-[#0C3B10]">
                    <Tag className="w-3.5 h-3.5 text-[#DBAB7D]" />
                    <span className="font-semibold">{appliedCoupon.code}</span>
                    <span className="text-gray-500 text-[11px]">({appliedCoupon.label})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon (e.g. VASUDHA10)"
                    className="flex-1 bg-[#FAF7F2] border border-[#0C3B10]/20 px-3 py-1.5 text-xs text-[#0C3B10] placeholder:text-gray-400 uppercase font-medium focus:outline-none focus:border-[#0C3B10]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#0C3B10] text-[#FFFFFF] text-xs font-semibold uppercase tracking-wider hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-[#666666]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#0C3B10] font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#0C3B10] font-semibold">
                  <span>Discount</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-[#0C3B10] font-medium">
                  {shippingFee === 0 ? <span className="text-[#0C3B10] font-bold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#0C3B10]/10 flex justify-between text-sm sm:text-base font-bold text-[#0C3B10]">
                <span className="font-serif">Total Amount</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-gray-400">Taxes included. Handloom verification certified.</p>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 bg-[#0C3B10] text-[#FFFFFF] font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-all flex items-center justify-center gap-2 shadow-lg group border border-[#0C3B10]"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
