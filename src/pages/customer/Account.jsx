import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Package, Heart, LogOut, ShieldCheck, Sparkles, Edit3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

export const Account = () => {
  const { user, logout, updateProfile } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(profileData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-[#0C3B10] text-[#FFFFFF] p-6 sm:p-10 border border-[#DBAB7D]/30 shadow-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full border-2 border-[#DBAB7D] bg-white/10 flex items-center justify-center font-serif text-2xl font-bold text-[#DBAB7D]">
              {user?.name?.[0] || 'V'}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#DBAB7D] block mb-1">
                ✦ Patron Profile ✦
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Hi, {user?.name || 'Patron'}
              </h1>
              <p className="text-xs text-white/75 font-light">
                User ID: <strong className="font-mono text-[#DBAB7D]">{user?.userId}</strong> • {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white/30 text-xs font-semibold uppercase hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            to="/orders"
            className="p-5 bg-white border border-[#0C3B10]/10 hover:border-[#DBAB7D] shadow-sm flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#FAF7F2] text-[#0C3B10] group-hover:bg-[#0C3B10] group-hover:text-[#DBAB7D] transition-colors">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-[#0C3B10]">Order History</h3>
                <p className="text-[11px] text-gray-500">Track current & past shipments</p>
              </div>
            </div>
          </Link>

          <Link
            to="/wishlist"
            className="p-5 bg-white border border-[#0C3B10]/10 hover:border-[#DBAB7D] shadow-sm flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#FAF7F2] text-[#0C3B10] group-hover:bg-[#0C3B10] group-hover:text-[#DBAB7D] transition-colors">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-[#0C3B10]">Saved Wishlist</h3>
                <p className="text-[11px] text-gray-500">{wishlistCount} saved designs</p>
              </div>
            </div>
          </Link>

          <Link
            to="/shop"
            className="p-5 bg-white border border-[#0C3B10]/10 hover:border-[#DBAB7D] shadow-sm flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#FAF7F2] text-[#0C3B10] group-hover:bg-[#0C3B10] group-hover:text-[#DBAB7D] transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-[#0C3B10]">Curated Shop</h3>
                <p className="text-[11px] text-gray-500">Explore new collections</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Profile & Shipping Information Form */}
        <div className="bg-white p-6 sm:p-8 border border-[#0C3B10]/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#0C3B10]/10">
            <h2 className="font-serif text-xl font-bold text-[#0C3B10]">
              Personal Information & Default Delivery Address
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-[#0C3B10] hover:text-[#DBAB7D] font-bold uppercase flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2.5 text-xs focus:outline-none disabled:opacity-75"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2.5 text-xs focus:outline-none disabled:opacity-75"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+91 98201 44521"
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2.5 text-xs focus:outline-none disabled:opacity-75"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Delivery Address
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  placeholder="Flat, Street, Landmark"
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2.5 text-xs focus:outline-none disabled:opacity-75"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  City
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2 text-xs focus:outline-none disabled:opacity-75"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  State
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.state}
                  onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2 text-xs focus:outline-none disabled:opacity-75"
                />
              </div>
              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profileData.pincode}
                  onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2 text-xs focus:outline-none disabled:opacity-75"
                />
              </div>
            </div>

            {isEditing && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0C3B10] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
