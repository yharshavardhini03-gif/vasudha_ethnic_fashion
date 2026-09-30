import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, MessageSquare, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    addToast('Welcome to the Vasudha Circle! 🥂 You will receive our royal edits & private offers.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#0C3B10] text-[#FFFFFF] border-t border-[#DBAB7D]/30 pt-16 pb-8 relative overflow-hidden">
      {/* Background motif accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#DBAB7D]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Col 1 & 2: Brand Story & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Vasudha Ethnic Logo"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-[#DBAB7D]/60"
              />
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#FFFFFF]">
                VASUDHA<span className="text-[#DBAB7D]">ETHNIC</span>
              </span>
            </Link>
            <p className="text-sm text-white/80 leading-relaxed font-light max-w-sm">
              Where Indian tradition meets modern elegance. Born from a passionate lineage of textile connoisseurs, curating heritage handlooms, pure zari silks, and bespoke festive silhouettes for the contemporary woman.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <div className="flex items-center gap-2 text-[#DBAB7D] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Join the Vasudha Circle</span>
              </div>
              <p className="text-xs text-white/60 mb-3">
                Receive private showroom invites, bridal previews & exclusive member benefits.
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-white/10 border border-[#DBAB7D]/40 text-white placeholder:text-white/40 text-xs px-4 py-3 focus:outline-none focus:border-[#DBAB7D] w-full font-light"
                />
                <button
                  type="submit"
                  className="bg-[#DBAB7D] text-[#0C3B10] px-5 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors flex items-center justify-center flex-shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Col 3: Collections */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#DBAB7D] border-b border-white/10 pb-2">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <Link to="/shop?category=Sarees" className="hover:text-[#DBAB7D] transition-colors">
                  Pure Silk Sarees
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Dresses" className="hover:text-[#DBAB7D] transition-colors">
                  Anarkalis & Gowns
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Kurtis" className="hover:text-[#DBAB7D] transition-colors">
                  Chikankari Kurtis
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Lehengas" className="hover:text-[#DBAB7D] transition-colors">
                  Couture Lehengas
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Ethnic%20Sets" className="hover:text-[#DBAB7D] transition-colors">
                  Festive Co-ord Sets
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=new" className="hover:text-[#DBAB7D] transition-colors font-medium">
                  ✦ New Arrivals 2026
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#DBAB7D] border-b border-white/10 pb-2">
              Customer Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <Link to="/shop" className="hover:text-[#DBAB7D] transition-colors">
                  Size & Fit Guide
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-[#DBAB7D] transition-colors">
                  Shipping & Customs
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#DBAB7D] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#DBAB7D] transition-colors">
                  My Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-[#DBAB7D] hover:underline font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Seller Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Boutique Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#DBAB7D] border-b border-white/10 pb-2">
              Boutique Studio
            </h4>
            <div className="space-y-3 text-xs text-white/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#DBAB7D] flex-shrink-0 mt-0.5" />
                <span>Vasudha Flagship Atelier, 108 Heritage Boulevard, Jaipur, Rajasthan 302001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#DBAB7D] flex-shrink-0" />
                <a href="https://wa.me/919820144521" target="_blank" rel="noreferrer" className="hover:text-[#DBAB7D] transition-colors">
                  WhatsApp: +91 98201 44521
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#DBAB7D] flex-shrink-0" />
                <a href="mailto:concierge@vasudhaethnic.com" className="hover:text-[#DBAB7D] transition-colors">
                  concierge@vasudhaethnic.com
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#DBAB7D]/50 flex items-center justify-center text-[#DBAB7D] hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <span className="text-xs text-white/70">@vasudhaethnic</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© 2026 VasudhaEthnic. All rights reserved. Handcrafted in India with pride.</p>
          <div className="flex items-center gap-6">
            <span>Authentic Handloom Certified</span>
            <span>Secure 256-bit SSL Checkout</span>
            <span>Silk Mark Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
