import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  PieChart,
  Sparkles,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { AdminHeader } from '../../components/admin/AdminHeader';

export const AdminAnalytics = () => {
  const { analytics, totalRevenue, orders, products } = useProducts();

  const maxDayRevenue = Math.max(...analytics.salesByDay.map((d) => d.revenue));

  const handleDownloadReviewCSV = () => {
    const headers = 'Metric,Value\n';
    const rows = [
      `Total Gross Revenue,₹${totalRevenue}`,
      `Average Order Value,₹${analytics.averageOrderValue}`,
      `Total Patrons,${analytics.totalCustomers}`,
      `Monthly Growth,${analytics.monthlyGrowth}`,
      `Total Orders Recorded,${orders.length}`,
      `Active Catalog Products,${products.length}`,
      '\nDay,Sales Revenue,Units Sold',
      ...analytics.salesByDay.map((d) => `${d.day},${d.revenue},${d.orders}`)
    ].join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VasudhaEthnic_Boutique_Review_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-[#FAF7F2] min-h-screen">
      <AdminHeader
        title="Boutique Intelligence & Sales Performance"
        subtitle="In-depth breakdown of catalog revenue, category shares, and seasonal demand."
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Actions Bar */}
        <div className="flex justify-end">
          <button
            onClick={handleDownloadReviewCSV}
            className="px-4 py-2 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors flex items-center gap-2 border border-[#0C3B10] shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#DBAB7D]" />
            <span>Download Boutique Performance Review (.CSV)</span>
          </button>
        </div>

        {/* Top KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#0C3B10] text-[#FFFFFF] p-6 border border-[#DBAB7D]/40 shadow-sm space-y-2">
            <div className="text-xs uppercase tracking-wider text-[#DBAB7D] font-bold">
              Total Gross Merchandise
            </div>
            <div className="font-serif text-3xl font-bold">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-emerald-300 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{analytics.monthlyGrowth} this month</span>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#0C3B10]/10 shadow-sm space-y-2">
            <div className="text-xs uppercase tracking-wider text-[#0C3B10] font-bold">
              Average Order Value (AOV)
            </div>
            <div className="font-serif text-3xl font-bold text-[#0C3B10]">
              ₹{analytics.averageOrderValue.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-gray-500">
              High tier luxury cart standard
            </div>
          </div>

          <div className="bg-white p-6 border border-[#0C3B10]/10 shadow-sm space-y-2">
            <div className="text-xs uppercase tracking-wider text-[#0C3B10] font-bold">
              Total Customers
            </div>
            <div className="font-serif text-3xl font-bold text-[#0C3B10]">
              {analytics.totalCustomers}
            </div>
            <div className="text-xs text-emerald-800 font-semibold">
              42% repeat patron rate
            </div>
          </div>

          <div className="bg-white p-6 border border-[#0C3B10]/10 shadow-sm space-y-2">
            <div className="text-xs uppercase tracking-wider text-[#0C3B10] font-bold">
              AI Conversion Lift
            </div>
            <div className="font-serif text-3xl font-bold text-[#0C3B10]">
              +31.2%
            </div>
            <div className="text-xs text-[#DBAB7D] font-bold">
              Vasudha AI styling sessions
            </div>
          </div>
        </div>

        {/* 2-Column Visual Charts: Revenue Velocity & Category Share */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Velocity Bar Chart (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-[#0C3B10]/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#0C3B10]/10">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0C3B10]">
                  Weekly Revenue Velocity
                </h3>
                <p className="text-xs text-gray-500">Daily sales breakdown across previous 7 days</p>
              </div>
              <span className="text-xs bg-[#FAF7F2] text-[#0C3B10] font-bold px-3 py-1 border border-[#0C3B10]/20">
                Weekly Total: ₹3,18,000
              </span>
            </div>

            {/* Custom Bar Graph */}
            <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-gray-200">
              {analytics.salesByDay.map((d) => {
                const heightPercent = Math.round((d.revenue / maxDayRevenue) * 100);
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-[#0C3B10] text-white text-[10px] py-1 px-2 pointer-events-none whitespace-nowrap z-10 shadow-lg border border-[#DBAB7D]">
                      ₹{d.revenue.toLocaleString('en-IN')} ({d.orders} orders)
                    </div>

                    <div className="w-full max-w-[36px] bg-[#FAF7F2] h-48 flex items-end overflow-hidden border border-[#0C3B10]/10">
                      <div
                        className="w-full bg-[#0C3B10] group-hover:bg-[#DBAB7D] transition-all duration-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#0C3B10]">{d.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span>Peak sales occurring during Friday-Sunday evening hours</span>
              <span className="text-[#0C3B10] font-bold">142 Orders this week</span>
            </div>
          </div>

          {/* Category Performance Breakdown (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-[#0C3B10]/10 shadow-sm space-y-6">
            <div className="pb-3 border-b border-[#0C3B10]/10">
              <h3 className="font-serif text-xl font-bold text-[#0C3B10]">
                Category Contribution
              </h3>
              <p className="text-xs text-gray-500">Revenue split across ethnic apparel segments</p>
            </div>

            <div className="space-y-4">
              {analytics.categoryShare.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#0C3B10]">{cat.category}</span>
                    <span className="font-semibold text-gray-700">
                      ₹{cat.revenue.toLocaleString('en-IN')} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF7F2] h-2.5 overflow-hidden border border-[#0C3B10]/10">
                    <div
                      className="h-full bg-[#0C3B10] transition-all duration-700"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Heirlooms Table */}
        <div className="bg-white p-6 sm:p-8 border border-[#0C3B10]/10 shadow-sm space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#0C3B10] pb-3 border-b border-[#0C3B10]/10">
            Top Performing Couture Pieces
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.topProducts.map((prod, idx) => (
              <div key={idx} className="p-4 bg-[#FAF7F2] border border-[#DBAB7D]/40 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#DBAB7D]">
                  Rank #{idx + 1}
                </div>
                <h4 className="font-serif text-sm font-bold text-[#0C3B10] line-clamp-1">
                  {prod.name}
                </h4>
                <div className="flex justify-between text-xs pt-1 border-t border-gray-200">
                  <span>Sold: <strong>{prod.sold} units</strong></span>
                  <span className="font-bold text-[#0C3B10]">₹{prod.revenue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
