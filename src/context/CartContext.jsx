import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const FREE_SHIPPING_THRESHOLD = 1999;
const STANDARD_SHIPPING_FEE = 150;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => storageService.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    storageService.saveCart(cartItems);
  }, [cartItems]);

  const addToCart = (product, selectedSize = null, selectedColor = null, quantity = 1) => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'Free Size';
    const color = selectedColor || product.color || 'Standard';
    const cartItemId = `${product.id}-${size}-${color}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: (product.images && product.images[0]) || '',
            category: product.category,
            fabric: product.fabric,
            size,
            color,
            quantity,
            slug: product.slug,
            maxStock: product.stock || 10
          }
        ];
      }
    });

    addToast(`Added "${product.name}" (${size}) to your bag 🛍️`, 'success');
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    addToast('Item removed from your bag', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'VASUDHA10') {
      setAppliedCoupon({ code: 'VASUDHA10', discountType: 'percentage', value: 10, label: '10% Royal Welcome Discount' });
      addToast('Coupon "VASUDHA10" applied successfully! 🎉', 'success');
      return { success: true, message: '10% discount applied!' };
    } else if (cleanCode === 'ROYAL500') {
      setAppliedCoupon({ code: 'ROYAL500', discountType: 'flat', value: 500, label: '₹500 Festive Celebration Discount' });
      addToast('Coupon "ROYAL500" applied successfully! 🎉', 'success');
      return { success: true, message: '₹500 flat discount applied!' };
    } else {
      addToast('Invalid coupon code. Try "VASUDHA10" or "ROYAL500"', 'error');
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Computations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.discountType === 'flat') {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
