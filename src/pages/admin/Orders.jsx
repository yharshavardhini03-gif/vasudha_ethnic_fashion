import React, { useState } from 'react';
import { Search, Eye, Filter, CheckCircle2, Truck, Package, X, Sparkles } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { AdminHeader } from '../../components/admin/AdminHeader';

export const AdminOrders = () => {
  const { orders, updateOrderStatus } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

  return (
    <div className="flex-1 bg-[#FAF7F2] min-h-screen">
      <AdminHeader
        title="Customer Orders & Dispatch Pipeline"
        subtitle={`Tracking ${orders.length} orders across Indian and international shipping networks.`}
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Controls */}
        <div className="bg-white p-6 border border-[#0C3B10]/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Order ID, Customer, City..."
                className="w-full bg-[#FAF7F2] border border-[#0C3B10]/20 pl-9 pr-3 py-2 text-xs text-[#0C3B10] focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF7F2] border border-[#0C3B10]/20 py-2 px-3 text-xs text-[#0C3B10] font-semibold focus:outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-gray-500">
            Total Order Volume: <strong className="text-[#0C3B10]">₹{filteredOrders.reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-[#0C3B10]/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0C3B10] text-[#FFFFFF]">
                <tr>
                  <th className="p-3.5 font-semibold tracking-wider">ORDER ID</th>
                  <th className="p-3.5 font-semibold tracking-wider">DATE</th>
                  <th className="p-3.5 font-semibold tracking-wider">CUSTOMER</th>
                  <th className="p-3.5 font-semibold tracking-wider">ITEMS</th>
                  <th className="p-3.5 font-semibold tracking-wider">AMOUNT</th>
                  <th className="p-3.5 font-semibold tracking-wider">STATUS</th>
                  <th className="p-3.5 font-semibold tracking-wider text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="p-3.5 font-serif font-bold text-sm text-[#0C3B10]">
                      {ord.id}
                    </td>
                    <td className="p-3.5 text-gray-600">{ord.date}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-[#1A1A1A]">{ord.customer?.name}</div>
                      <div className="text-[10px] text-gray-500">{ord.customer?.city}, {ord.customer?.state}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-xs text-gray-700 font-medium">
                        {ord.items?.length} {ord.items?.length === 1 ? 'item' : 'items'}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate max-w-[150px]">
                        {ord.items?.map((i) => i.name).join(', ')}
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-[#0C3B10]">
                      ₹{ord.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                        className={`text-[11px] font-bold uppercase p-1.5 border rounded-none ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : ord.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : ord.status === 'Packed'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : ord.status === 'Confirmed'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-gray-50 text-gray-800 border-gray-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-[#FAF7F2] border border-[#0C3B10]/20 text-[#0C3B10] hover:bg-[#0C3B10] hover:text-white transition-colors text-xs font-semibold uppercase flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#DBAB7D]/40 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-[#0C3B10]"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-between pb-4 border-b border-[#0C3B10]/10 mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#DBAB7D]">
                  Order Dossier
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0C3B10]">
                  Order #{selectedOrder.id}
                </h3>
              </div>
              <span className="text-xs bg-[#FAF7F2] px-3 py-1 border font-bold text-[#0C3B10]">
                {selectedOrder.status}
              </span>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF7F2] border border-[#0C3B10]/10 text-xs mb-6">
              <div>
                <h4 className="font-bold uppercase text-[#0C3B10] mb-1">Customer Information</h4>
                <p className="font-semibold">{selectedOrder.customer?.name}</p>
                <p className="text-gray-600">{selectedOrder.customer?.email}</p>
                <p className="text-gray-600">{selectedOrder.customer?.phone}</p>
              </div>
              <div>
                <h4 className="font-bold uppercase text-[#0C3B10] mb-1">Delivery Address</h4>
                <p className="text-gray-700">{selectedOrder.customer?.address}</p>
                <p className="text-gray-700">{selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}</p>
                <p className="text-gray-500 mt-1 font-mono">Tracking: {selectedOrder.trackingNumber || 'PENDING'}</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3 mb-6">
              <h4 className="font-bold text-xs uppercase text-[#0C3B10]">Ensemble Garments</h4>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-16 object-cover border border-[#DBAB7D]/30" />
                    <div>
                      <div className="font-bold text-[#0C3B10]">{item.name}</div>
                      <div className="text-gray-500">Size: {item.size} • Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-bold text-sm text-[#0C3B10]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#0C3B10]/10 flex justify-between items-center text-xs">
              <div>
                <span>Payment: <strong>{selectedOrder.paymentMethod || 'Prepaid Online'}</strong></span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 block text-[10px]">Total Paid Amount</span>
                <span className="font-serif text-xl font-bold text-[#0C3B10]">
                  ₹{selectedOrder.amount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
