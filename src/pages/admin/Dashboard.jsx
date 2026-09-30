import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  Layers,
  Store
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { AdminHeader } from '../../components/admin/AdminHeader';

export const AdminDashboard = () => {
  const {
    products,
    orders,
    activityLog,
    totalRevenue,
    totalProducts,
    publishedProducts,
    lowStockCount,
    outOfStockCount,
    updateOrderStatus
  } = useProducts();

  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      title: "Gross Store Revenue",
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: "+18.4% monthly growth",
      icon: <TrendingUp className="w-5 h-5 text-[#DBAB7D]" />,
      bg: "bg-[#0C3B10] text-[#FFFFFF]",
      textColor: "text-[#FFFFFF]"
    },
    {
      title: "Total Catalog Items",
      value: totalProducts,
      change: `${publishedProducts} published in store`,
      icon: <Package className="w-5 h-5 text-[#0C3B10]" />,
      bg: "bg-white text-[#0C3B10]",
      textColor: "text-[#0C3B10]"
    },
    {
      title: "Customer Orders",
      value: orders.length,
      change: `${orders.filter((o) => o.status === 'Pending').length} pending dispatch`,
      icon: <ShoppingBag className="w-5 h-5 text-[#0C3B10]" />,
      bg: "bg-white text-[#0C3B10]",
      textColor: "text-[#0C3B10]"
    },
    {
      title: "Low / Out of Stock",
      value: `${lowStockCount} / ${outOfStockCount}`,
      change: "Items requiring weaver replenishment",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bg: "bg-white text-[#0C3B10]",
      textColor: "text-[#0C3B10]"
    }
  ];

  return (
    <div className="flex-1 bg-[#FAF7F2] min-h-screen">
      <AdminHeader
        title="VasudhaEthnic Seller Command"
        subtitle="Good morning, Master Atelier. Here is your store's live pulse."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`p-6 border border-[#0C3B10]/10 shadow-sm flex flex-col justify-between ${stat.bg}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold tracking-wider opacity-80">
                  {stat.title}
                </span>
                <div className="p-2 bg-white/10 rounded-none border border-[#DBAB7D]/30">
                  {stat.icon}
                </div>
              </div>
              <div>
                <div className={`font-serif text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
                <div className="text-[11px] opacity-70 mt-1">{stat.change}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Bar */}
        <div className="bg-white p-6 border border-[#0C3B10]/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#DBAB7D]" />
            <h3 className="font-serif text-lg font-bold text-[#0C3B10]">
              Quick Atelier Actions
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products/new"
              className="px-5 py-2.5 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ ADD NEW PRODUCT</span>
            </Link>
            <Link
              to="/admin/orders"
              className="px-4 py-2.5 border border-[#0C3B10] text-[#0C3B10] text-xs font-bold uppercase tracking-wider hover:bg-[#FAF7F2] transition-colors"
            >
              Manage Orders
            </Link>
            <Link
              to="/admin/inventory"
              className="px-4 py-2.5 border border-[#0C3B10] text-[#0C3B10] text-xs font-bold uppercase tracking-wider hover:bg-[#FAF7F2] transition-colors"
            >
              Variant Stock
            </Link>
          </div>
        </div>

        {/* 2-Column Grid: Recent Orders + Real-time Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 border border-[#0C3B10]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#0C3B10]/10">
              <h3 className="font-serif text-lg font-bold text-[#0C3B10]">
                Recent Orders Pipeline
              </h3>
              <Link
                to="/admin/orders"
                className="text-xs text-[#DBAB7D] font-bold uppercase hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] text-[#0C3B10] font-bold border-b border-[#0C3B10]/10">
                    <th className="p-3">ORDER</th>
                    <th className="p-3">CUSTOMER</th>
                    <th className="p-3">TOTAL</th>
                    <th className="p-3">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="p-3 font-serif font-bold text-[#0C3B10]">{ord.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-[#1A1A1A]">{ord.customer?.name}</div>
                        <div className="text-[10px] text-gray-500">{ord.customer?.city}</div>
                      </td>
                      <td className="p-3 font-bold text-[#0C3B10]">
                        ₹{ord.amount?.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          className="bg-white border border-[#0C3B10]/20 text-[11px] p-1 text-[#0C3B10] font-semibold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Log Feed (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-6 border border-[#0C3B10]/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#0C3B10]/10">
              <div className="flex items-center gap-2 text-[#0C3B10]">
                <Clock className="w-4 h-4 text-[#DBAB7D]" />
                <h3 className="font-serif text-lg font-bold">
                  Recent Store Activity
                </h3>
              </div>
              <span className="text-[10px] bg-[#FAF7F2] text-[#0C3B10] px-2 py-0.5 font-bold uppercase">
                Live Audit
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {activityLog.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start justify-between gap-3 p-2.5 bg-[#FAF7F2] border-l-2 border-[#0C3B10] text-xs hover:border-[#DBAB7D] transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-800 font-bold mt-0.5">✓</span>
                    <span className="font-medium text-[#1A1A1A] leading-snug">{act.text}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
