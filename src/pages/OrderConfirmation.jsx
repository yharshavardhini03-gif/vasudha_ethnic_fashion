import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, Package, Truck, ArrowRight, Printer, MapPin, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order || {
    id: "VE-1024",
    customer: {
      name: "Aishwarya Sharma",
      email: "aishwarya.s@gmail.com",
      phone: "+91 98201 44521",
      address: "Flat 402, Royale Heights, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050"
    },
    items: [
      {
        id: "ve-01",
        name: "Royal Emerald Kanjivaram Silk Saree",
        price: 4999,
        quantity: 1,
        size: "Free Size",
        color: "Emerald Green",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80"
      }
    ],
    amount: 4999,
    status: "Confirmed",
    paymentMethod: "UPI",
    trackingNumber: "EXP-VE-894120",
    estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  useEffect(() => {
    // Launch celebratory luxury confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0C3B10', '#DBAB7D', '#FAF7F2', '#145419']
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Main Card */}
        <div className="bg-white border border-[#0C3B10]/10 shadow-lg p-6 sm:p-12 text-center relative overflow-hidden">
          {/* Top Gold Ribbon Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0C3B10] via-[#DBAB7D] to-[#0C3B10]" />

          {/* Success Check Badge */}
          <div className="w-20 h-20 rounded-full bg-[#0C3B10] border-2 border-[#DBAB7D] flex items-center justify-center text-[#DBAB7D] mx-auto mb-6 shadow-xl animate-fade-up">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#DBAB7D] block mb-1">
            ✦ Payment & Order Successful ✦
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#0C3B10] font-normal tracking-tight mb-2">
            Order Confirmed
          </h1>

          <p className="text-xs sm:text-sm text-[#666666] font-light max-w-md mx-auto leading-relaxed mb-6">
            Thank you for shopping with <strong className="text-[#0C3B10]">VasudhaEthnic</strong>. Our master artisans have received your couture order and are preparing it for bespoke luxury packaging.
          </p>

          {/* Order Details Header Box */}
          <div className="bg-[#FAF7F2] p-4 sm:p-6 border border-[#DBAB7D]/40 text-left grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div>
              <span className="text-[10px] uppercase text-gray-500 font-bold block">Order Reference</span>
              <span className="font-serif text-base font-bold text-[#0C3B10]">{order.id}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-gray-500 font-bold block">Estimated Delivery</span>
              <span className="text-xs font-bold text-[#0C3B10]">{order.estimatedDelivery} (3–5 Days)</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-gray-500 font-bold block">Payment Method</span>
              <span className="text-xs font-bold text-[#0C3B10]">{order.paymentMethod}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-gray-500 font-bold block">Status</span>
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {order.status || 'Confirmed'}
              </span>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="text-left mb-8">
            <h3 className="font-serif text-sm uppercase tracking-wider text-[#0C3B10] font-bold pb-2 border-b border-[#0C3B10]/10 mb-4">
              Items in this Shipment
            </h3>
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-[#FAF7F2] border border-[#0C3B10]/5">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-16 object-cover border border-[#DBAB7D]/30"
                    />
                    <div>
                      <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#0C3B10]">{item.name}</h4>
                      <span className="text-[10px] text-gray-500">Size: {item.size} • Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-[#0C3B10]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Summary */}
          {order.customer && (
            <div className="text-left mb-8 p-4 border border-[#0C3B10]/10 bg-white text-xs space-y-1">
              <div className="flex items-center gap-1 text-[#0C3B10] font-bold uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#DBAB7D]" />
                <span>Shipping Destination:</span>
              </div>
              <p className="font-semibold text-[#1A1A1A]">{order.customer.name}</p>
              <p className="text-gray-600">{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
              <p className="text-gray-600">Contact: {order.customer.phone} | {order.customer.email}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors flex items-center justify-center gap-2 shadow-md border border-[#0C3B10]"
            >
              <Truck className="w-4 h-4 text-[#DBAB7D]" />
              <span>TRACK ORDER</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#DBAB7D] text-[#0C3B10] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#0C3B10] hover:text-white transition-colors flex items-center justify-center gap-2 shadow-md border border-[#DBAB7D]"
            >
              <Printer className="w-4 h-4" />
              <span>DOWNLOAD / PRINT INVOICE</span>
            </button>

            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 border border-[#0C3B10] text-[#0C3B10] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#FAF7F2] transition-colors flex items-center justify-center gap-2"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Track Order Modal */}
      {isTrackModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#DBAB7D]/40 max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="font-serif text-xl text-[#0C3B10] font-bold mb-1">
              Live Shipment Tracking
            </h3>
            <p className="text-xs text-[#666666] mb-4">
              Tracking ID: <strong>{order.trackingNumber || 'EXP-VE-894120'}</strong>
            </p>

            <div className="space-y-4 py-2 border-y border-gray-100 text-xs">
              <div className="flex items-start gap-3 text-[#0C3B10] font-bold">
                <div className="w-4 h-4 rounded-full bg-[#0C3B10] text-white flex items-center justify-center text-[10px]">✓</div>
                <div>
                  <div>Order Placed & Confirmed</div>
                  <div className="text-[10px] text-gray-500 font-normal">Jaipur Atelier HQ • Today</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-[#0C3B10] font-bold">
                <div className="w-4 h-4 rounded-full bg-[#DBAB7D] text-[#0C3B10] flex items-center justify-center text-[10px] animate-pulse">●</div>
                <div>
                  <div>Artisan Inspection & Luxury Packaging</div>
                  <div className="text-[10px] text-gray-500 font-normal">Handloom tag verification underway</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <div className="w-4 h-4 rounded-full border border-gray-300 text-center text-[10px]">○</div>
                <div>
                  <div>Handover to Express Courier</div>
                  <div className="text-[10px] font-normal">BlueDart / Delhivery Priority Air</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-400">
                <div className="w-4 h-4 rounded-full border border-gray-300 text-center text-[10px]">○</div>
                <div>
                  <div>Out for Delivery & Doorstep Handover</div>
                  <div className="text-[10px] font-normal">Estimated {order.estimatedDelivery}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsTrackModalOpen(false)}
                className="w-full py-2.5 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
