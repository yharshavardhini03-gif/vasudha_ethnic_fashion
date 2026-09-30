import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Layers,
  BarChart3,
  Sparkles,
  Settings,
  Store,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/seller/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { label: 'Products', path: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { label: 'Add Product', path: '/admin/products/new', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'Inventory', path: '/admin/inventory', icon: <Layers className="w-4 h-4" /> },
    { label: 'Orders', path: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#0C3B10] text-[#FFFFFF] border-r border-[#DBAB7D]/30 min-h-screen flex flex-col justify-between p-4 sm:p-6 flex-shrink-0 shadow-2xl">
      <div>
        {/* Brand Header */}
        <div className="pb-6 mb-6 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="VasudhaEthnic Logo" 
              className="w-9 h-9 rounded-full object-cover ring-1 ring-[#DBAB7D] bg-white flex-shrink-0 shadow-sm"
            />
            <div>
              <span className="font-serif text-lg font-bold tracking-[0.15em] text-[#FFFFFF] block">
                VASUDHA<span className="text-[#DBAB7D]">ETHNIC</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#DBAB7D] block font-medium">
                Seller Command Center
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 px-3 mb-2">
            Atelier Management
          </div>
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors rounded-none ${
                  isActive
                    ? 'bg-[#DBAB7D] text-[#0C3B10] shadow-sm font-bold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Switch to Storefront & Logout */}
      <div className="pt-6 border-t border-white/10 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#DBAB7D] hover:text-white hover:bg-white/5 transition-colors"
        >
          <Store className="w-4 h-4 text-[#DBAB7D]" />
          <span>View Public Storefront</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Atelier</span>
        </button>

        <div className="px-3 text-[10px] text-white/40 pt-2 border-t border-white/5">
          Logged in: <strong className="text-white/80">{user?.email || user?.name || user?.userId || 'Authorized Seller'}</strong>
        </div>
      </div>
    </aside>
  );
};
