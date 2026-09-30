import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, Store, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SellerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sellerLogin } = useAuth();

  const [sellerId, setSellerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectPath = location.state?.from?.pathname || '/admin';

  const handleSellerLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!sellerId || !password) {
      setErrorMsg('Please provide both seller identifier and password.');
      return;
    }

    setIsLoading(true);
    const res = await sellerLogin(sellerId, password);
    setIsLoading(false);

    if (res.success) {
      navigate(redirectPath);
    } else {
      setErrorMsg(res.error || 'Invalid seller credentials.');
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#0C3B10] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden animate-fade-in text-[#FFFFFF]">
      {/* Background motif glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#DBAB7D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#DBAB7D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white text-[#1A1A1A] p-8 sm:p-10 border-2 border-[#DBAB7D] shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <img 
            src="/logo.png" 
            alt="VasudhaEthnic Logo" 
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#DBAB7D] mx-auto shadow-lg bg-white"
          />
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#DBAB7D] block pt-2">
            ✦ Atelier Command Center ✦
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0C3B10]">
            VasudhaEthnic Seller Portal
          </h1>
          <p className="text-xs text-gray-500 font-light">
            Single Authorized Merchant Console for product, order, and inventory management.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 border-l-2 border-red-500 text-red-700 text-xs p-3 animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSellerLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
              Seller Email or ID *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                placeholder="atelier@vasudhaethnic.com"
                className="w-full bg-[#FAF7F2] border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-semibold uppercase text-[#0C3B10]">
                Password *
              </label>
              <span className="text-[10px] text-gray-400">Restricted Access</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF7F2] border border-gray-300 pl-9 pr-10 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors flex items-center justify-center gap-2 shadow-lg border border-[#0C3B10] mt-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'AUTHENTICATING...' : 'SIGN IN TO DASHBOARD'}</span>
            <ArrowRight className="w-4 h-4 text-[#DBAB7D]" />
          </button>
        </form>

        {/* Bottom Switch */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <Link to="/" className="hover:text-[#0C3B10] flex items-center gap-1">
            <Store className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>
          <Link to="/login" className="text-[#0C3B10] font-bold hover:underline">
            Looking for Customer Login?
          </Link>
        </div>
      </div>
    </div>
  );
};

