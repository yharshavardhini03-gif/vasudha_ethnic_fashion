import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User, Phone, Sparkles, ArrowRight, ShieldCheck, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, registerCustomer } = useAuth();

  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!loginId || !loginPassword) {
      setFormError('Please enter both your email/username and password.');
      return;
    }

    setIsLoading(true);
    const res = await login(loginId, loginPassword);
    setIsLoading(false);

    if (res.success) {
      navigate(redirectPath);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!regName || !regEmail || !regPassword) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setFormError('Passwords do not match. Please check and re-type.');
      return;
    }

    setIsLoading(true);
    const res = await registerCustomer({
      name: regName,
      email: regEmail,
      userId: regEmail,
      password: regPassword,
      confirmPassword: regConfirmPassword,
      phone: regPhone
    });
    setIsLoading(false);

    if (res.success) {
      navigate(redirectPath);
    }
  };

  return (
    <div className="min-h-[88vh] bg-[#FAF7F2] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl w-full bg-white border border-[#0C3B10]/10 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* LEFT: Editorial Indian Ethnic Image */}
        <div className="md:col-span-5 relative hidden md:block bg-[#0C3B10] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85"
            alt="Vasudha Ethnic Collection"
            className="w-full h-full object-cover object-top opacity-85 hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C3B10] via-[#0C3B10]/40 to-transparent" />

          {/* Floating Brand Story Tag */}
          <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
            <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#DBAB7D] block">
              ✦ Patron Sanctuary ✦
            </span>
            <h3 className="font-serif text-2xl font-light text-white leading-snug">
              Step Into The World of Indian Couture.
            </h3>
            <p className="text-[11px] text-white/75 font-light">
              Access your personalized wishlist, order timeline, and bespoke couture styling dossier.
            </p>
          </div>
        </div>

        {/* RIGHT: Login / Register Card */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Top Brand Header */}
            <div className="flex justify-between items-center pb-4 border-b border-[#0C3B10]/10">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <img 
                  src="/logo.png" 
                  alt="VasudhaEthnic" 
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#DBAB7D] bg-white shadow-sm"
                />
                <span className="font-serif text-xl font-bold tracking-[0.2em] text-[#0C3B10]">
                  VASUDHA<span className="text-[#DBAB7D]">ETHNIC</span>
                </span>
              </Link>
              <Link
                to="/seller/login"
                className="text-[11px] text-[#0C3B10] hover:text-[#DBAB7D] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#0C3B10]/20 px-2.5 py-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#DBAB7D]" />
                <span>Seller Portal →</span>
              </Link>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-[#0C3B10]/10 my-6">
              <button
                onClick={() => { setActiveTab('login'); setFormError(''); }}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition-all relative ${
                  activeTab === 'login'
                    ? 'text-[#0C3B10] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0C3B10]'
                    : 'text-gray-400 hover:text-[#0C3B10]'
                }`}
              >
                Customer Sign In
              </button>
              <button
                onClick={() => { setActiveTab('register'); setFormError(''); }}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition-all relative ${
                  activeTab === 'register'
                    ? 'text-[#0C3B10] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#0C3B10]'
                    : 'text-gray-400 hover:text-[#0C3B10]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Validation Error Alert */}
            {formError && (
              <div className="bg-red-50 border-l-2 border-red-500 text-red-700 text-xs p-3 mb-4 animate-fade-in">
                {formError}
              </div>
            )}

            {/* TAB 1: LOGIN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#0C3B10]">Welcome Back</h2>
                  <p className="text-xs text-[#666666] font-light">
                    Sign in to continue to your Vasudha account.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                    Email or Username *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full bg-[#FAF7F2] border border-gray-300 pl-9 pr-3 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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
                  className="w-full py-3.5 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors flex items-center justify-center gap-2 shadow-md mt-2 disabled:opacity-50"
                >
                  <span>{isLoading ? 'SIGNING IN...' : 'LOGIN'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#0C3B10]">Create Account</h2>
                  <p className="text-xs text-[#666666] font-light">
                    Join the Vasudha Circle for bespoke styling & order tracking.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Priyanshi Verma"
                    className="w-full bg-[#FAF7F2] border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0C3B10]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="w-full bg-[#FAF7F2] border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0C3B10]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98201 00000"
                      className="w-full bg-[#FAF7F2] border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0C3B10]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                      Password * (Min 6)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#FAF7F2] border border-gray-300 pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-[#0C3B10]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#FAF7F2] border border-gray-300 pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-[#0C3B10]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors flex items-center justify-center gap-2 shadow-md mt-2 disabled:opacity-50"
                >
                  <span>{isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Bottom helper */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <Link to="/" className="hover:text-[#0C3B10] underline">
              ← Continue as Guest Customer
            </Link>
            <Link to="/seller/login" className="text-[#0C3B10] font-bold hover:underline">
              Are you a Seller? Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

