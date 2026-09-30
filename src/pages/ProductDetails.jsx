import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Star,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Ruler,
  ChevronDown,
  Check,
  Share2,
  ArrowRight
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { SizeGuideModal } from '../components/common/SizeGuideModal';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  // Find product by slug or ID
  const product = products.find((p) => p.slug === id || p.id === id) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState('details');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedSize(product.sizes?.[0] || 'Free Size');
      setSelectedColor(product.colors?.[0] || product.color || 'Standard');
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-serif text-2xl text-[#0C3B10]">Product Not Found</h2>
        <Link to="/shop" className="text-xs text-[#DBAB7D] font-bold uppercase mt-4 inline-block">
          Return to Collections →
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
      setDeliveryStatus({ error: 'Please enter a valid 6-digit Indian PIN code' });
      return;
    }
    setDeliveryStatus({
      success: true,
      message: `Express Delivery Available to PIN ${pincode} by ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`
    });
  };

  const handleAddToBag = () => {
    addToCart(product, selectedSize, selectedColor || product.color, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor || product.color, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on VasudhaEthnic`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard 📋', 'info');
    }
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-14 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="text-xs text-[#666666] mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-[#0C3B10]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#0C3B10]">Collections</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-[#0C3B10]">{product.category}</Link>
          <span>/</span>
          <span className="text-[#0C3B10] font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Grid (Gallery + Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 border border-[#0C3B10]/10 shadow-sm">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large View */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF7F2] border border-[#DBAB7D]/30 group">
              <img
                src={product.images?.[activeImageIndex] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110 cursor-zoom-in"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.isNew && (
                  <span className="bg-[#0C3B10] text-[#FFFFFF] text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 shadow-sm">
                    NEW ARRIVAL
                  </span>
                )}
                {product.tag && (
                  <span className="bg-[#DBAB7D] text-[#0C3B10] text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 shadow-sm">
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-10 shadow-md ${
                  isLiked
                    ? 'bg-[#0C3B10] text-[#DBAB7D]'
                    : 'bg-white/90 text-[#0C3B10] hover:bg-[#0C3B10] hover:text-[#DBAB7D]'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current text-[#DBAB7D]' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-[3/4] overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#0C3B10] opacity-100 shadow-sm'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details & Purchase Form */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#DBAB7D] font-bold tracking-[0.2em] uppercase">
                  {product.category} • {product.subCategory || 'Haute Couture'}
                </span>
                <div className="flex items-center gap-1 text-[#0C3B10] font-semibold bg-[#FAF7F2] px-2.5 py-1 border border-[#DBAB7D]/30">
                  <Star className="w-3.5 h-3.5 fill-[#DBAB7D] text-[#DBAB7D]" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-light">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#0C3B10] leading-tight">
                {product.name}
              </h1>

              {/* Pricing */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#0C3B10]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs bg-[#0C3B10] text-[#DBAB7D] font-bold px-2 py-0.5 uppercase tracking-wider">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Inclusive of all taxes. Free Express Shipping included.
              </p>
            </div>

            <div className="h-px bg-[#0C3B10]/10" />

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#1A1A1A] font-light leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatch & Selection */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-[#0C3B10] uppercase tracking-wider">
                  Select Shade: <strong className="text-[#DBAB7D]">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(product.colors || [product.color || 'Standard']).map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`py-1.5 px-3 text-xs font-semibold border transition-all ${
                      selectedColor === col
                        ? 'bg-[#0C3B10] text-[#FFFFFF] border-[#0C3B10] shadow-sm'
                        : 'bg-white border-[#0C3B10]/20 text-[#0C3B10] hover:border-[#DBAB7D]'
                    }`}
                  >
                    {col} {selectedColor === col && '✓'}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes && (
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#0C3B10] uppercase tracking-wider">
                    Select Size: <strong>{selectedSize}</strong>
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-[#DBAB7D] hover:text-[#0C3B10] font-semibold underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-[48px] py-2 px-3 text-xs font-bold border transition-all text-center ${
                        selectedSize === sz
                          ? 'bg-[#0C3B10] text-[#FFFFFF] border-[#0C3B10] shadow-sm'
                          : 'bg-white border-[#0C3B10]/20 text-[#0C3B10] hover:border-[#DBAB7D]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-emerald-800 font-semibold">
                ✓ In Stock
              </span>
              {product.stock <= 5 && (
                <span className="text-amber-800 font-medium">
                  — Only {product.stock} pieces left in boutique atelier!
                </span>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#0C3B10]/30 bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-[#0C3B10] hover:bg-[#FAF7F2]"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-[#0C3B10]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    className="px-3 py-2 text-[#0C3B10] hover:bg-[#FAF7F2]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToBag}
                  className="flex-1 py-3.5 px-6 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-all flex items-center justify-center gap-2 border border-[#0C3B10] shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO BAG</span>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 bg-[#DBAB7D] text-[#0C3B10] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#0C3B10] hover:text-white transition-all border border-[#DBAB7D] shadow-md flex items-center justify-center gap-2"
              >
                <span>BUY NOW WITH 1-CLICK</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pincode / Estimated Delivery Checker */}
            <div className="bg-[#FAF7F2] p-4 border border-[#DBAB7D]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0C3B10] uppercase tracking-wider">
                <Truck className="w-4 h-4 text-[#DBAB7D]" />
                <span>Delivery & Pincode Checker</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength="6"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 bg-white border border-[#0C3B10]/20 px-3 py-1.5 text-xs text-[#0C3B10] focus:outline-none focus:border-[#0C3B10]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0C3B10] text-white text-xs font-semibold uppercase hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors"
                >
                  Check
                </button>
              </form>
              {deliveryStatus && (
                <div className={`text-xs ${deliveryStatus.error ? 'text-red-600' : 'text-emerald-800 font-medium'}`}>
                  {deliveryStatus.error || deliveryStatus.message}
                </div>
              )}
              {!deliveryStatus && (
                <p className="text-[11px] text-gray-500 font-light">
                  Standard dispatch: 24–48 hours. Estimated delivery: 3–5 days across India.
                </p>
              )}
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-[#0C3B10]/10 pt-4 space-y-3 text-xs">
              {/* Product Details */}
              <div className="border-b border-[#0C3B10]/10 pb-3">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'details' ? '' : 'details')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#0C3B10]"
                >
                  <span>Product Highlights & Specs</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === 'details' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'details' && (
                  <ul className="mt-3 space-y-1.5 text-[#1A1A1A] font-light list-disc list-inside">
                    {product.details?.map((det, i) => (
                      <li key={i}>{det}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Fabric & Care */}
              <div className="border-b border-[#0C3B10]/10 pb-3">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'care' ? '' : 'care')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#0C3B10]"
                >
                  <span>Fabric Care & Preservation</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === 'care' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'care' && (
                  <ul className="mt-3 space-y-1.5 text-[#1A1A1A] font-light list-disc list-inside">
                    {product.care?.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Shipping & Authenticity */}
              <div className="border-b border-[#0C3B10]/10 pb-3">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? '' : 'shipping')}
                  className="w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#0C3B10]"
                >
                  <span>Authenticity Guarantee & Easy Returns</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="mt-3 space-y-2 text-[#1A1A1A] font-light">
                    <p>✦ 100% Silk Mark Certified authentic handloom weave.</p>
                    <p>✦ Hassle-free 7-day return/exchange window for unworn items with security tag intact.</p>
                    <p>✦ Complimentary door-step pickup across 18,000+ pin codes.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Share button */}
            <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
              <span>SKU: {product.sku || 'VE-COUTURE'}</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-[#0C3B10] hover:text-[#DBAB7D] font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Ensemble</span>
              </button>
            </div>
          </div>
        </div>

        {/* Complete The Look / Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#DBAB7D] font-bold block mb-1">
                Curated Harmony
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0C3B10]">
                Complete The Look
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#0C3B10]/20 p-3 z-30 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-[#0C3B10]">₹{product.price.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-gray-500 truncate max-w-[120px]">{product.name}</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddToBag}
            className="py-2.5 px-4 bg-[#0C3B10] text-[#FFFFFF] text-[11px] font-bold uppercase tracking-wider"
          >
            Add To Bag
          </button>
          <button
            onClick={handleBuyNow}
            className="py-2.5 px-4 bg-[#DBAB7D] text-[#0C3B10] text-[11px] font-bold uppercase tracking-wider"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
