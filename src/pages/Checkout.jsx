import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Tag,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';

export const Checkout = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    shippingFee,
    discountAmount,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCart();
  const { createOrder } = useProducts();
  const { addToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1); // 1: Info & Delivery, 2: Payment, 3: Review
  const [formData, setFormData] = useState({
    firstName: 'Aishwarya',
    lastName: 'Sharma',
    email: 'aishwarya.sharma@example.com',
    phone: '+91 98201 44521',
    address: 'Flat 402, Royale Heights, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    shippingMethod: 'express', // 'express' (free/included) or 'priority'
    paymentMethod: 'upi', // 'upi', 'card', 'netbanking', 'cod'
    upiId: 'aishwarya@okhdfcbank',
    cardNumber: '4532 •••• •••• 8821',
    cardExp: '08/28',
    cardCvv: '•••'
  });

  const [couponCode, setCouponCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-24 text-center">
        <div className="max-w-md mx-auto bg-white p-10 border border-[#0C3B10]/10 shadow-sm space-y-4">
          <h2 className="font-serif text-2xl text-[#0C3B10]">Your Bag is Empty</h2>
          <p className="text-xs text-[#666666]">
            Please add your favorite items to your shopping bag before proceeding to checkout.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors"
          >
            Explore Collections →
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCouponSubmit = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    applyCoupon(couponCode);
    setCouponCode('');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!formData.firstName || !formData.phone || !formData.address || !formData.pincode) {
        addToast('Please complete all required shipping fields', 'error');
        return;
      }
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    // Simulate luxury order creation & processing
    await new Promise((res) => setTimeout(res, 1200));

    const orderData = {
      customer: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      },
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image
      })),
      amount: grandTotal,
      subtotal,
      shippingFee,
      discountAmount,
      paymentMethod:
        formData.paymentMethod === 'upi'
          ? `UPI (${formData.upiId})`
          : formData.paymentMethod === 'card'
          ? 'Credit Card (HDFC)'
          : formData.paymentMethod === 'netbanking'
          ? 'NetBanking'
          : 'Cash on Delivery (COD)'
    };

    const created = createOrder(orderData);
    clearCart();
    setIsSubmitting(false);
    navigate('/order-success', { state: { order: created } });
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-10">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#DBAB7D] block mb-1">
            ✦ Secure Atelier Checkout ✦
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0C3B10]">
            Complete Your Purchase
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#0C3B10]/15 -translate-y-1/2 -z-0" />
            
            {[
              { step: 1, label: '01 Delivery' },
              { step: 2, label: '02 Payment' },
              { step: 3, label: '03 Review' }
            ].map((s) => (
              <div
                key={s.step}
                className="relative z-10 flex flex-col items-center cursor-pointer"
                onClick={() => s.step < currentStep && setCurrentStep(s.step)}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-sm font-bold transition-all ${
                    currentStep >= s.step
                      ? 'bg-[#0C3B10] text-[#DBAB7D] border-2 border-[#DBAB7D]'
                      : 'bg-white text-[#666666] border border-[#0C3B10]/20'
                  }`}
                >
                  {currentStep > s.step ? '✓' : s.step}
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider mt-2 ${
                  currentStep >= s.step ? 'text-[#0C3B10]' : 'text-[#666666]'
                }`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Grid (Form + Order Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Checkout Form Steps */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 border border-[#0C3B10]/10 shadow-sm">
            {/* STEP 1: Delivery Information */}
            {currentStep === 1 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div className="border-b border-[#0C3B10]/10 pb-4">
                  <h2 className="font-serif text-xl text-[#0C3B10] font-bold">
                    Shipping & Delivery Address
                  </h2>
                  <p className="text-xs text-[#666666] font-light">
                    Where should we deliver your heirloom garment package?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0C3B10] mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF7F2] border border-[#0C3B10]/20 px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0C3B10] mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF7F2] border border-[#0C3B10]/20 px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0C3B10] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF7F2] border border-[#0C3B10]/20 px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0C3B10] mb-1">
                      Phone Number (WhatsApp Updates) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF7F2] border border-[#0C3B10]/20 px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0C3B10] mb-1">
                    Street Address & Apartment / Landmark *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF7F2] border border-[#0C3B10]/20 px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0C3B10] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF7F2] border border-[#0C3B10]/20 px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0C3B10] mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF7F2] border border-[#0C3B10]/20 px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0C3B10] mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength="6"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF7F2] border border-[#0C3B10]/20 px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <span>Continue To Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Payment Options */}
            {currentStep === 2 && (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div className="border-b border-[#0C3B10]/10 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl text-[#0C3B10] font-bold">
                      Select Payment Method
                    </h2>
                    <p className="text-xs text-[#666666] font-light">
                      256-Bit SSL Encrypted & Bank Authenticated
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[#DBAB7D] text-xs">
                    <Lock className="w-4 h-4" />
                    <span>Secure</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* UPI Option */}
                  <label
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                      formData.paymentMethod === 'upi'
                        ? 'border-[#0C3B10] bg-[#FAF7F2]'
                        : 'border-gray-200 hover:border-[#DBAB7D]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                      className="mt-1 accent-[#0C3B10]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0C3B10]">
                          Instant UPI (GPay, PhonePe, Paytm, QR)
                        </span>
                        <span className="text-[10px] bg-[#DBAB7D] text-[#0C3B10] px-2 py-0.5 font-bold uppercase">
                          Fastest
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Zero transaction fees with instant confirmation.
                      </p>
                      {formData.paymentMethod === 'upi' && (
                        <div className="mt-3 p-3 bg-white border border-[#0C3B10]/20 space-y-2">
                          <label className="text-[10px] uppercase font-bold text-gray-500">
                            Enter UPI ID
                          </label>
                          <input
                            type="text"
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleInputChange}
                            placeholder="username@okhdfcbank"
                            className="w-full bg-[#FAF7F2] border border-gray-300 px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Card Option */}
                  <label
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-[#0C3B10] bg-[#FAF7F2]'
                        : 'border-gray-200 hover:border-[#DBAB7D]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="mt-1 accent-[#0C3B10]"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0C3B10]">
                        Credit / Debit Card (Visa, MasterCard, Amex)
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        All major Indian and international cards accepted.
                      </p>
                      {formData.paymentMethod === 'card' && (
                        <div className="mt-3 p-3 bg-white border border-[#0C3B10]/20 grid grid-cols-2 gap-2">
                          <div className="col-span-2">
                            <input
                              type="text"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              placeholder="Card Number"
                              className="w-full bg-[#FAF7F2] border border-gray-300 px-3 py-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              name="cardExp"
                              value={formData.cardExp}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              className="w-full bg-[#FAF7F2] border border-gray-300 px-3 py-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <input
                              type="password"
                              name="cardCvv"
                              value={formData.cardCvv}
                              onChange={handleInputChange}
                              placeholder="CVV"
                              maxLength="4"
                              className="w-full bg-[#FAF7F2] border border-gray-300 px-3 py-1.5 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#0C3B10] bg-[#FAF7F2]'
                        : 'border-gray-200 hover:border-[#DBAB7D]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="mt-1 accent-[#0C3B10]"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0C3B10]">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Pay cash or UPI upon package inspection at delivery.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="py-3 px-6 border border-[#0C3B10] text-[#0C3B10] text-xs font-bold uppercase tracking-wider hover:bg-[#FAF7F2]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors"
                  >
                    Review Order →
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Review & Place Order */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-b border-[#0C3B10]/10 pb-4">
                  <h2 className="font-serif text-xl text-[#0C3B10] font-bold">
                    Review & Confirm Order
                  </h2>
                  <p className="text-xs text-[#666666] font-light">
                    Please review your shipping details and payment choice before placing the order.
                  </p>
                </div>

                {/* Delivery summary */}
                <div className="p-4 bg-[#FAF7F2] border border-[#0C3B10]/10 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-[#0C3B10]">
                    <span>Shipping To:</span>
                    <button onClick={() => setCurrentStep(1)} className="text-[#DBAB7D] underline">
                      Edit
                    </button>
                  </div>
                  <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
                  <p className="text-gray-600">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
                  <p className="text-gray-600">Phone: {formData.phone} | Email: {formData.email}</p>
                </div>

                {/* Payment summary */}
                <div className="p-4 bg-[#FAF7F2] border border-[#0C3B10]/10 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-[#0C3B10]">
                    <span>Payment Choice:</span>
                    <button onClick={() => setCurrentStep(2)} className="text-[#DBAB7D] underline">
                      Edit
                    </button>
                  </div>
                  <p className="capitalize font-semibold text-[#0C3B10]">{formData.paymentMethod.toUpperCase()}</p>
                  <p className="text-gray-600">Total payable: ₹{grandTotal.toLocaleString('en-IN')}</p>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="py-3 px-6 border border-[#0C3B10] text-[#0C3B10] text-xs font-bold uppercase tracking-wider"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handlePlaceOrder}
                    className="flex-1 py-4 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-all flex items-center justify-center gap-2 shadow-xl border border-[#0C3B10] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-[#DBAB7D]" />
                        <span>PROCESSING COUTURE ORDER...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#DBAB7D]" />
                        <span>PLACE ORDER • ₹{grandTotal.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 border border-[#0C3B10]/10 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#0C3B10] uppercase tracking-wider pb-3 border-b border-[#0C3B10]/10">
                Order Summary ({cartItems.length} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex gap-3 py-2 border-b border-gray-100 text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-18 object-cover border border-[#DBAB7D]/30 flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-semibold text-[#0C3B10] line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] text-gray-500">Size: {item.size} • Qty: {item.quantity}</span>
                      </div>
                      <div className="font-bold text-[#0C3B10]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <div className="pt-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#0C3B10]/5 border border-[#0C3B10]/20 p-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[#0C3B10]">
                      <Tag className="w-3.5 h-3.5 text-[#DBAB7D]" />
                      <span className="font-bold">{appliedCoupon.code}</span>
                      <span className="text-gray-500 text-[11px]">({appliedCoupon.label})</span>
                    </div>
                    <button onClick={removeCoupon} className="text-xs text-red-600 hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon (e.g. VASUDHA10)"
                      className="flex-1 bg-[#FAF7F2] border border-[#0C3B10]/20 px-3 py-1.5 text-xs text-[#0C3B10] uppercase focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#0C3B10] text-[#FFFFFF] text-xs font-semibold uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Subtotal breakdown */}
              <div className="pt-3 border-t border-[#0C3B10]/10 space-y-2 text-xs text-[#666666]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#0C3B10] font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Coupon Discount</span>
                    <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="text-[#0C3B10] font-semibold">
                    {shippingFee === 0 ? <span className="text-emerald-800 font-bold">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#0C3B10]/10 flex justify-between text-base font-bold text-[#0C3B10]">
                  <span className="font-serif">Grand Total</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="p-4 bg-[#FAF7F2] border border-[#DBAB7D]/40 text-xs text-[#0C3B10] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#DBAB7D] flex-shrink-0" />
              <span>Handcrafted guarantee • 7-day hassle-free doorstep returns • Silk Mark certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
