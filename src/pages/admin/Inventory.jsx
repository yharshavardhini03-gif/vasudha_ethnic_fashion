import React, { useState } from 'react';
import { Layers, Search, AlertTriangle, Plus, Minus, RefreshCw, CheckCircle2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { AdminHeader } from '../../components/admin/AdminHeader';

export const AdminInventory = () => {
  const { products, updateVariantStock, updateStock } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'low', 'out'

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterMode === 'low') return matchesSearch && p.stock > 0 && p.stock <= 5;
    if (filterMode === 'out') return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  const allSizesHeader = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

  // Helper to get total stock for a specific size on a product
  const getSizeStock = (product, size) => {
    if (!product.variants || product.variants.length === 0) {
      if (product.sizes?.includes(size)) return Math.floor(product.stock / (product.sizes.length || 1));
      return '-';
    }
    const matching = product.variants.filter((v) => v.size.toUpperCase() === size.toUpperCase());
    if (matching.length === 0) return '-';
    return matching.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

  return (
    <div className="flex-1 bg-[#FAF7F2] min-h-screen">
      <AdminHeader
        title="Inventory & Variant Stock Management"
        subtitle="Manage live boutique stock levels across all size and color variations."
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
                placeholder="Search by product name or SKU..."
                className="w-full bg-[#FAF7F2] border border-[#0C3B10]/20 pl-9 pr-3 py-2 text-xs text-[#0C3B10] focus:outline-none"
              />
            </div>

            {/* Quick stock filters */}
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 border border-[#0C3B10]/10">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 text-xs font-semibold uppercase ${
                  filterMode === 'all' ? 'bg-[#0C3B10] text-white' : 'text-[#0C3B10] hover:text-[#DBAB7D]'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setFilterMode('low')}
                className={`px-3 py-1 text-xs font-semibold uppercase ${
                  filterMode === 'low' ? 'bg-[#0C3B10] text-white' : 'text-[#0C3B10] hover:text-[#DBAB7D]'
                }`}
              >
                Low Stock ({products.filter((p) => p.stock > 0 && p.stock <= 5).length})
              </button>
              <button
                onClick={() => setFilterMode('out')}
                className={`px-3 py-1 text-xs font-semibold uppercase ${
                  filterMode === 'out' ? 'bg-[#0C3B10] text-white' : 'text-[#0C3B10] hover:text-[#DBAB7D]'
                }`}
              >
                Out of Stock ({products.filter((p) => p.stock === 0).length})
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-600">
            Total Units in Stock: <strong className="font-bold text-[#0C3B10]">{products.reduce((s, p) => s + (p.stock || 0), 0)}</strong>
          </div>
        </div>

        {/* Inventory Matrix Table */}
        <div className="bg-white border border-[#0C3B10]/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0C3B10] text-[#FFFFFF]">
                <tr>
                  <th className="p-3.5 font-semibold tracking-wider">PRODUCT & SKU</th>
                  <th className="p-3.5 font-semibold tracking-wider text-center">TOTAL STOCK</th>
                  {allSizesHeader.map((sz) => (
                    <th key={sz} className="p-3.5 font-semibold tracking-wider text-center">
                      {sz}
                    </th>
                  ))}
                  <th className="p-3.5 font-semibold tracking-wider">STATUS</th>
                  <th className="p-3.5 font-semibold tracking-wider text-right">QUICK ADJUST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= 5;
                  const isOut = p.stock === 0;

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isLow
                          ? 'bg-[#DBAB7D]/10 hover:bg-[#DBAB7D]/20'
                          : isOut
                          ? 'bg-red-50/50 hover:bg-red-50'
                          : 'hover:bg-[#FAF7F2]/60'
                      }`}
                    >
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-14 object-cover border border-[#DBAB7D]/30 flex-shrink-0"
                          />
                          <div>
                            <Link
                              to={`/admin/products/edit/${p.id}`}
                              className="font-serif font-bold text-sm text-[#0C3B10] hover:text-[#DBAB7D] line-clamp-1 block"
                            >
                              {p.name}
                            </Link>
                            <div className="text-[10px] text-gray-500 font-mono">
                              {p.sku || p.id} • {p.fabric}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Total Stock */}
                      <td className="p-3.5 text-center font-bold text-sm text-[#0C3B10]">
                        {p.stock} units
                      </td>

                      {/* Size columns */}
                      {allSizesHeader.map((sz) => {
                        const stockForSize = getSizeStock(p, sz);
                        return (
                          <td
                            key={sz}
                            className={`p-3.5 text-center ${
                              stockForSize !== '-' && stockForSize > 0
                                ? 'font-bold text-[#0C3B10]'
                                : 'text-gray-300'
                            }`}
                          >
                            {stockForSize}
                          </td>
                        );
                      })}

                      {/* Status badge */}
                      <td className="p-3.5">
                        {isOut ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold uppercase">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 bg-[#DBAB7D] text-[#0C3B10] text-[10px] font-bold uppercase shadow-sm">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                            Healthy
                          </span>
                        )}
                      </td>

                      {/* Quick Adjust buttons */}
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center border border-[#0C3B10]/20 bg-white">
                          <button
                            onClick={() => updateStock(p.id, Math.max(0, p.stock - 1))}
                            className="p-1 hover:bg-[#FAF7F2] text-[#0C3B10] transition-colors"
                            title="Decrease total stock"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#0C3B10] min-w-[24px] text-center">
                            {p.stock}
                          </span>
                          <button
                            onClick={() => updateStock(p.id, p.stock + 1)}
                            className="p-1 hover:bg-[#FAF7F2] text-[#0C3B10] transition-colors"
                            title="Increase total stock"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
