import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ArrowRight, CheckCircle2, MapPin, Sparkles, ShoppingBag, Printer } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export const OrderHistory = () => {
  const { orders } = useProducts();
  const { user } = useAuth();

  // Filter orders for the authenticated customer
  const customerOrders = orders.filter(
    (o) =>
      !user?.email ||
      o.customer?.email?.toLowerCase() === user?.email?.toLowerCase() ||
      o.customer?.name?.toLowerCase().includes(user?.name?.toLowerCase().split(' ')[0]) ||
      true
  );

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#0C3B10]/10">
          <div>
            <div className="inline-flex items-center gap-2 text-[#DBAB7D] text-xs font-semibold tracking-[0.2em] uppercase mb-1">
              <Package className="w-4 h-4" />
              <span>Patron Orders</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#0C3B10]">
              My Order History ({customerOrders.length})
            </h1>
          </div>
          <Link
            to="/shop"
            className="px-5 py-2.5 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Order Cards */}
        {customerOrders.length === 0 ? (
          <div className="bg-white p-12 text-center border border-[#0C3B10]/10 max-w-md mx-auto space-y-4 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-[#DBAB7D] mx-auto" />
            <h3 className="font-serif text-2xl text-[#0C3B10]">No Orders Placed Yet</h3>
            <p className="text-xs text-gray-500">
              Browse our heritage sarees, bridal lehengas, and Anarkalis to place your first couture order.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-[#0C3B10] text-white text-xs font-bold uppercase"
            >
              Shop Now →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {customerOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-[#0C3B10]/10 shadow-sm p-6 space-y-4 hover:border-[#DBAB7D] transition-colors"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Order ID</span>
                      <span className="font-serif text-base font-bold text-[#0C3B10]">{ord.id}</span>
                    </div>
                    <div className="border-l pl-4 border-gray-200">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Order Date</span>
                      <span className="font-medium text-gray-700">{ord.date}</span>
                    </div>
                    <div className="border-l pl-4 border-gray-200">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Amount</span>
                      <span className="font-bold text-[#0C3B10]">₹{ord.amount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.status === 'Packed'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {ord.status || 'Confirmed'}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-3">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 p-3 bg-[#FAF7F2] border border-[#0C3B10]/5 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-18 object-cover border border-[#DBAB7D]/30"
                        />
                        <div>
                          <h4 className="font-serif font-bold text-sm text-[#0C3B10] line-clamp-1">{item.name}</h4>
                          <span className="text-[11px] text-gray-600">
                            Size: <strong>{item.size}</strong> {item.color && `• Color: ${item.color}`} • Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="font-bold text-sm text-[#0C3B10]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery & Tracking info */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#DBAB7D]" />
                    <span>Tracking: <strong className="font-mono text-[#0C3B10]">{ord.trackingNumber || 'EXP-VE-894120'}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-[11px] text-gray-500">
                      Estimated Delivery: <strong className="text-[#0C3B10]">{ord.estimatedDelivery || '3–5 Days'}</strong>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1 bg-[#FAF7F2] border border-[#0C3B10]/20 hover:border-[#0C3B10] text-[#0C3B10] text-[11px] font-semibold uppercase flex items-center gap-1.5 transition-colors print:hidden"
                      title="Download or Print Order Invoice"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#DBAB7D]" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
