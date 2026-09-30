import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, Sparkles, User, ShieldCheck, LogOut, ChevronDown, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { SearchModal } from './SearchModal';

export const Navbar = ({ onOpenAI }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { totalItemsCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isCustomer, isSeller, logout } = useAuth();

  // Handle scroll compression
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change or outside click
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/shop' },
    { label: 'Sarees', path: '/shop?category=Sarees' },
    { label: 'Kurtis', path: '/shop?category=Kurtis' },
    { label: 'Dresses', path: '/shop?category=Dresses' },
    { label: 'New Arrivals', path: '/shop?filter=new' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 bg-[#0C3B10] text-[#FFFFFF] ${
          isScrolled
            ? 'py-2.5 shadow-[0_4px_25px_rgba(0,0,0,0.3)] border-b border-[#DBAB7D]/25'
            : 'py-4 border-b border-[#DBAB7D]/20'
        }`}
      >
        {/* Top announcement bar */}
        {!isScrolled && (
          <div className="hidden sm:block border-b border-white/10 pb-2 mb-2 text-center text-[11px] tracking-[0.25em] text-[#DBAB7D] uppercase font-medium">
            ✦ Complimentary Express Shipping Across India on Orders Above ₹999 ✦
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* LEFT: Logo & Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-white hover:text-[#DBAB7D] p-1 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Vasudha Ethnic Logo"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm ring-1 ring-[#DBAB7D]/60 group-hover:ring-[#DBAB7D] transition-all bg-white"
                />
                <div className="flex flex-col whitespace-nowrap">
                  <span className="font-serif text-lg sm:text-2xl font-bold tracking-[0.18em] text-[#FFFFFF] group-hover:text-[#DBAB7D] transition-colors leading-none">
                    VASUDHA<span className="font-light text-[#DBAB7D]">ETHNIC</span>
                  </span>
                  <span className="text-[7.5px] sm:text-[8.5px] tracking-[0.25em] uppercase text-[#DBAB7D]/80 mt-1 hidden sm:block">
                    Haute Couture • Artisanal
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 2xl:gap-8 flex-shrink">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-[11px] xl:text-xs tracking-[0.12em] xl:tracking-[0.15em] uppercase font-medium transition-all relative py-1 whitespace-nowrap hover:text-[#DBAB7D] ${
                      isActive && link.path === location.pathname + location.search
                        ? 'text-[#DBAB7D] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#DBAB7D]'
                        : 'text-white/90'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT: Actions & Authentication */}
            <div className="flex items-center gap-1.5 sm:gap-3 xl:gap-4 flex-shrink-0">
              {/* AI Assistant Button (Desktop) */}
              <button
                onClick={onOpenAI}
                className="hidden md:flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 bg-[#DBAB7D] text-[#0C3B10] text-[11px] xl:text-xs font-bold tracking-wider uppercase shadow-md hover:bg-white transition-all transform hover:scale-[1.02] border border-[#DBAB7D] whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0C3B10]" />
                <span>Ask Vasudha AI</span>
              </button>

              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white/90 hover:text-[#DBAB7D] p-2 transition-colors relative"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="text-white/90 hover:text-[#DBAB7D] p-2 transition-colors relative"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#DBAB7D] text-[#0C3B10] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse-subtle">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="text-white/90 hover:text-[#DBAB7D] p-2 transition-colors relative"
                aria-label={`Shopping Bag (${totalItemsCount} items)`}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#DBAB7D] text-[#0C3B10] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* USER AUTH DROPDOWN / LOGIN BUTTON */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 py-1.5 px-2.5 bg-white/10 border border-[#DBAB7D]/40 text-white text-xs font-semibold hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-all"
                  >
                    <User className="w-3.5 h-3.5 text-[#DBAB7D]" />
                    <span className="max-w-[90px] truncate hidden sm:inline">
                      {isSeller ? 'Seller Portal' : `Hi, ${user?.name?.split(' ')[0] || 'Patron'}`}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-[#1A1A1A] border border-[#0C3B10]/15 shadow-2xl z-50 py-1 animate-fade-in text-xs">
                      <div className="px-4 py-2 border-b border-gray-100 bg-[#FAF7F2]">
                        <div className="font-bold text-[#0C3B10] truncate">{user?.name}</div>
                        <div className="text-[10px] text-gray-500 capitalize">{user?.role} Account</div>
                      </div>

                      {isCustomer && (
                        <>
                          <Link
                            to="/account"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 hover:bg-[#FAF7F2] hover:text-[#0C3B10]"
                          >
                            My Account
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 hover:bg-[#FAF7F2] hover:text-[#0C3B10]"
                          >
                            My Orders
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 hover:bg-[#FAF7F2] hover:text-[#0C3B10]"
                          >
                            Wishlist ({wishlistCount})
                          </Link>
                        </>
                      )}

                      {isSeller && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 bg-[#0C3B10] text-[#DBAB7D] font-bold hover:bg-[#DBAB7D] hover:text-[#0C3B10]"
                        >
                          Seller Command Center →
                        </Link>
                      )}

                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50 flex items-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-[#DBAB7D] text-[#0C3B10] text-xs font-bold tracking-wider uppercase hover:bg-white transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#0C3B10] text-[#FFFFFF] shadow-2xl z-10 flex flex-col justify-between border-r border-[#DBAB7D]/30 p-6 animate-slide-left">
            <div>
              {/* Header */}
              <div className="flex justify-between items-center pb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo.png"
                    alt="Vasudha Ethnic Logo"
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-[#DBAB7D]/60"
                  />
                  <div className="flex flex-col">
                    <span className="font-serif text-lg font-bold tracking-[0.2em] text-[#FFFFFF]">
                      VASUDHA<span className="text-[#DBAB7D]">ETHNIC</span>
                    </span>
                    <span className="text-[8px] tracking-[0.2em] uppercase text-[#DBAB7D]">
                      Luxury Indian Boutique
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-[#DBAB7D] p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Bar in Mobile */}
              <div className="my-4 pb-4 border-b border-white/10">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="text-xs text-white/80">
                      Signed in as <strong className="text-[#DBAB7D]">{user?.name}</strong>
                    </div>
                    <div className="flex gap-2 text-xs">
                      {isCustomer && (
                        <Link
                          to="/account"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-2.5 py-1 bg-white/10 text-white hover:text-[#DBAB7D]"
                        >
                          Account
                        </Link>
                      )}
                      {isCustomer && (
                        <Link
                          to="/orders"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-2.5 py-1 bg-white/10 text-white hover:text-[#DBAB7D]"
                        >
                          Orders
                        </Link>
                      )}
                      {isSeller && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-2.5 py-1 bg-[#DBAB7D] text-[#0C3B10] font-bold"
                        >
                          Seller Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="px-2.5 py-1 text-red-400 hover:text-red-300"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center py-2.5 bg-[#DBAB7D] text-[#0C3B10] text-xs font-bold uppercase tracking-wider"
                  >
                    Customer Sign In / Register
                  </Link>
                )}
              </div>

              {/* AI Button in Mobile */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAI();
                  }}
                  className="w-full py-2.5 px-4 bg-[#DBAB7D] text-[#0C3B10] text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask Vasudha AI</span>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-3">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.path}
                    className="block text-xs tracking-[0.15em] uppercase text-white/90 hover:text-[#DBAB7D] py-1.5 border-b border-white/5 transition-colors"
                  >
                    {link.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/wishlist"
                  className="block text-xs tracking-[0.15em] uppercase text-white/90 hover:text-[#DBAB7D] py-1.5 border-b border-white/5 transition-colors"
                >
                  Wishlist ({wishlistCount})
                </NavLink>
              </nav>
            </div>

            {/* Mobile Footer with Seller portal switch */}
            <div className="pt-6 border-t border-white/10 text-xs text-white/60 space-y-2">
              <Link
                to="/seller/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#DBAB7D] font-bold hover:underline flex items-center gap-1 block"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Seller Login Portal →</span>
              </Link>
              <p>📍 Jaipur • Varanasi • Kanchipuram</p>
            </div>
          </div>
        </div>
      )}

      {/* Smart Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
