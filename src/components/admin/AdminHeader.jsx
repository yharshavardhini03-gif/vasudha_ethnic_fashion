import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Sparkles, User, RefreshCw, ShieldCheck } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';

export const AdminHeader = ({ title, subtitle }) => {
  const { lowStockCount, resetToSampleData } = useProducts();
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-[#0C3B10]/10 py-4 px-6 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#0C3B10] font-bold">
          {title || "Good morning, Seller 👋"}
        </h1>
        <p className="text-xs text-[#666666] font-light mt-0.5">
          {subtitle || "Manage your high-end collections, live orders, and artisan inventory."}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Low stock alerts badge */}
        {lowStockCount > 0 && (
          <Link
            to="/admin/inventory"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] border border-[#DBAB7D] text-xs font-semibold text-[#0C3B10] hover:bg-[#DBAB7D] transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-amber-700" />
            <span>{lowStockCount} Low Stock</span>
          </Link>
        )}

        {/* Seller avatar */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#0C3B10] text-[#DBAB7D] flex items-center justify-center font-serif text-xs font-bold shadow-sm">
            VE
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-[#0C3B10] truncate max-w-[140px]">
              {user?.name || 'Vasudha Atelier'}
            </div>
            <div className="text-[10px] text-gray-500">Boutique Owner</div>
          </div>
        </div>
      </div>
    </header>
  );
};
