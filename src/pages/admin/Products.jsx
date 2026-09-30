import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Copy,
  Eye,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { ALL_CATEGORIES } from '../../data/mockProducts';

export const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, deleteProduct, duplicateProduct, togglePublished, updateStock } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteModalProduct, setDeleteModalProduct] = useState(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fabric?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;

    let matchesStatus = true;
    if (statusFilter === 'published') matchesStatus = p.published !== false;
    if (statusFilter === 'draft') matchesStatus = p.published === false;
    if (statusFilter === 'low') matchesStatus = p.stock > 0 && p.stock <= 5;
    if (statusFilter === 'out') matchesStatus = p.stock === 0;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleDeleteConfirm = () => {
    if (deleteModalProduct) {
      deleteProduct(deleteModalProduct.id);
      setDeleteModalProduct(null);
    }
  };

  return (
    <div className="flex-1 bg-[#FAF7F2] min-h-screen">
      <AdminHeader
        title="Product Management & Catalog Operations"
        subtitle={`Total of ${products.length} bespoke Indian designs in your atelier.`}
      />

      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Top Control Bar */}
        <div className="bg-white p-6 border border-[#0C3B10]/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, SKU or fabric..."
                className="w-full bg-[#FAF7F2] border border-[#0C3B10]/20 pl-9 pr-3 py-2 text-xs text-[#0C3B10] focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-[#FAF7F2] border border-[#0C3B10]/20 py-2 px-3 text-xs text-[#0C3B10] font-semibold focus:outline-none"
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF7F2] border border-[#0C3B10]/20 py-2 px-3 text-xs text-[#0C3B10] font-semibold focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          {/* Add Product Button */}
          <Link
            to="/admin/products/new"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors flex items-center justify-center gap-2 shadow-sm border border-[#0C3B10]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Product</span>
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-[#0C3B10]/10 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0C3B10] text-[#FFFFFF]">
                <tr>
                  <th className="p-3.5 font-semibold tracking-wider">PRODUCT</th>
                  <th className="p-3.5 font-semibold tracking-wider">CATEGORY</th>
                  <th className="p-3.5 font-semibold tracking-wider">PRICE</th>
                  <th className="p-3.5 font-semibold tracking-wider">TOTAL STOCK</th>
                  <th className="p-3.5 font-semibold tracking-wider">STATUS</th>
                  <th className="p-3.5 font-semibold tracking-wider">CREATED</th>
                  <th className="p-3.5 font-semibold tracking-wider text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= 5;
                  const isOut = p.stock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-11 h-14 object-cover border border-[#DBAB7D]/30 flex-shrink-0"
                          />
                          <div>
                            <div className="font-serif font-bold text-sm text-[#0C3B10] line-clamp-1">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono">
                              SKU: {p.sku || p.id} • {p.fabric}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-[#0C3B10]">{p.category}</td>
                      <td className="p-3.5 font-bold text-[#0C3B10]">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-[#0C3B10]">{p.stock} units</div>
                        <div className="text-[10px] text-gray-400">
                          {p.sizes?.join(', ')}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => togglePublished(p.id)}
                          className="flex items-center gap-1.5 cursor-pointer"
                          title="Toggle Published / Draft"
                        >
                          {p.published !== false ? (
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-none">
                              Published
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-bold uppercase rounded-none">
                              Draft
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="p-3.5 text-gray-500 text-[11px]">
                        {p.createdAt || '2026-09-18'}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit */}
                          <Link
                            to={`/admin/products/edit/${p.id}`}
                            className="p-1.5 text-gray-600 hover:text-[#0C3B10] hover:bg-[#FAF7F2] transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {/* Duplicate */}
                          <button
                            onClick={() => duplicateProduct(p.id)}
                            className="p-1.5 text-gray-600 hover:text-[#0C3B10] hover:bg-[#FAF7F2] transition-colors"
                            title="Duplicate Product"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete with Modal */}
                          <button
                            onClick={() => setDeleteModalProduct(p)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove Product"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteModalProduct)}
        onClose={() => setDeleteModalProduct(null)}
        onConfirm={handleDeleteConfirm}
        productName={deleteModalProduct?.name}
      />
    </div>
  );
};
