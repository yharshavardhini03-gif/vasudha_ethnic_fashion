import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Save,
  Eye,
  CheckCircle2,
  Layers,
  Image as ImageIcon,
  Palette,
  Truck,
  Plus,
  X
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { VariantMatrix } from '../../components/admin/VariantMatrix';
import { ProductPreviewModal } from '../../components/admin/ProductPreviewModal';
import { ALL_CATEGORIES, ALL_FABRICS, ALL_SIZES, DEFAULT_COLORS } from '../../data/mockProducts';

export const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useProducts();

  const isEditing = Boolean(id);
  const existingProduct = isEditing ? products.find((p) => p.id === id || p.slug === id) : null;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dresses',
    subCategory: 'Anarkali Sets',
    price: '',
    originalPrice: '',
    description: '',
    fabric: 'Georgette',
    tag: 'Artisan Handwoven',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Green', 'Maroon'],
    variants: [
      { size: 'S', color: 'Green', stock: 2 },
      { size: 'M', color: 'Green', stock: 5 },
      { size: 'L', color: 'Green', stock: 3 },
      { size: 'XL', color: 'Green', stock: 1 },
      { size: 'S', color: 'Maroon', stock: 1 },
      { size: 'M', color: 'Maroon', stock: 3 },
      { size: 'L', color: 'Maroon', stock: 2 },
      { size: 'XL', color: 'Maroon', stock: 0 }
    ],
    delivery: {
      time: '3–5 days',
      shippingCharge: 99,
      freeThreshold: 999,
      returnAvailable: true,
      returnPeriod: '7 days'
    },
    published: true
  });

  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#0C3B10');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || '',
        category: existingProduct.category || 'Dresses',
        subCategory: existingProduct.subCategory || '',
        price: existingProduct.price || '',
        originalPrice: existingProduct.originalPrice || '',
        description: existingProduct.description || '',
        fabric: existingProduct.fabric || 'Georgette',
        tag: existingProduct.tag || 'Boutique Exclusive',
        images: existingProduct.images || [],
        sizes: existingProduct.sizes || ['Free Size'],
        colors: existingProduct.colors || [existingProduct.color || 'Standard'],
        variants: existingProduct.variants || [
          { size: existingProduct.sizes?.[0] || 'Free Size', color: existingProduct.color || 'Standard', stock: existingProduct.stock || 10 }
        ],
        delivery: existingProduct.delivery || {
          time: '3–5 days',
          shippingCharge: 99,
          freeThreshold: 999,
          returnAvailable: true,
          returnPeriod: '7 days'
        },
        published: existingProduct.published !== undefined ? existingProduct.published : true
      });
    }
  }, [existingProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      const newSizes = exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size];

      // Update variants array to include/remove size
      let updatedVariants = prev.variants.filter((v) => newSizes.includes(v.size));
      if (!exists) {
        prev.colors.forEach((col) => {
          if (!updatedVariants.some((v) => v.size === size && v.color === col)) {
            updatedVariants.push({ size, color: col, stock: 5 });
          }
        });
      }

      return {
        ...prev,
        sizes: newSizes,
        variants: updatedVariants
      };
    });
  };

  const handleColorToggle = (colorName) => {
    setFormData((prev) => {
      const exists = prev.colors.includes(colorName);
      const newColors = exists ? prev.colors.filter((c) => c !== colorName) : [...prev.colors, colorName];

      let updatedVariants = prev.variants.filter((v) => newColors.includes(v.color));
      if (!exists) {
        prev.sizes.forEach((sz) => {
          if (!updatedVariants.some((v) => v.size === sz && v.color === colorName)) {
            updatedVariants.push({ size: sz, color: colorName, stock: 3 });
          }
        });
      }

      return {
        ...prev,
        colors: newColors,
        variants: updatedVariants
      };
    });
  };

  const handleAddCustomColor = (e) => {
    e.preventDefault();
    if (!customColorName.trim()) return;
    const name = customColorName.trim();
    if (!formData.colors.includes(name)) {
      handleColorToggle(name);
    }
    setCustomColorName('');
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert('Please provide product name and price');
      return;
    }

    if (isEditing) {
      updateProduct(existingProduct.id, {
        ...formData,
        price: parseInt(formData.price, 10),
        originalPrice: parseInt(formData.originalPrice || formData.price * 1.3, 10)
      });
    } else {
      addProduct({
        ...formData,
        price: parseInt(formData.price, 10),
        originalPrice: parseInt(formData.originalPrice || formData.price * 1.3, 10)
      });
    }

    navigate('/admin/products');
  };

  return (
    <div className="flex-1 bg-[#FAF7F2] min-h-screen">
      <AdminHeader
        title={isEditing ? `Edit Design: ${existingProduct?.name}` : "+ Add New Dress / Product"}
        subtitle="Configure basic specs, upload multi-angle photography, and build the size x color inventory matrix."
      />

      <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
        {/* Back navigation & header actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/admin/products"
            className="text-xs text-[#0C3B10] hover:text-[#DBAB7D] font-bold uppercase flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2 border border-[#0C3B10] text-[#0C3B10] text-xs font-bold uppercase tracking-wider hover:bg-white flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#DBAB7D]" />
              <span>Live Customer Preview</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#DBAB7D] hover:text-[#0C3B10] flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Save className="w-3.5 h-3.5 text-[#DBAB7D]" />
              <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: Basic Information */}
          <div className="bg-white p-6 sm:p-8 border border-[#0C3B10]/10 shadow-sm space-y-6">
            <div className="pb-3 border-b border-[#0C3B10]/10 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#0C3B10]">
                01. Basic Garment Information
              </h3>
              <span className="text-[10px] text-gray-400 uppercase font-bold">* Required Fields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Royal Green Anarkali or Floral Silk Saree"
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#0C3B10]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2.5 text-xs text-[#0C3B10] font-semibold"
                >
                  {ALL_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Fabric Type *
                </label>
                <select
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2.5 text-xs text-[#0C3B10] font-semibold"
                >
                  {ALL_FABRICS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="2199"
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2.5 text-xs font-bold text-[#0C3B10]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Original MRP (₹)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="2999"
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2.5 text-xs text-gray-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Boutique Description & Weave Artistry *
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the 32-kali flare, Pitta zari work, dupattas, and celebratory occasions..."
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2.5 text-xs text-[#1A1A1A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Image Upload */}
          <div className="bg-white p-6 sm:p-8 border border-[#0C3B10]/10 shadow-sm space-y-4">
            <div className="pb-3 border-b border-[#0C3B10]/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0C3B10]">
                <ImageIcon className="w-4 h-4 text-[#DBAB7D]" />
                <h3 className="font-serif text-lg font-bold">
                  02. Product Image Gallery
                </h3>
              </div>
              <span className="text-[10px] text-gray-400">Drag/upload or paste image URLs</span>
            </div>

            <ImageUploader
              images={formData.images}
              setImages={(newImgs) => setFormData((prev) => ({ ...prev, images: typeof newImgs === 'function' ? newImgs(prev.images) : newImgs }))}
            />
          </div>

          {/* SECTION 3: Sizes & Colors Management */}
          <div className="bg-white p-6 sm:p-8 border border-[#0C3B10]/10 shadow-sm space-y-6">
            <div className="pb-3 border-b border-[#0C3B10]/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0C3B10]">
                <Palette className="w-4 h-4 text-[#DBAB7D]" />
                <h3 className="font-serif text-lg font-bold">
                  03. Sizes & Available Color Palette
                </h3>
              </div>
            </div>

            {/* Sizes selector */}
            <div>
              <label className="block font-semibold uppercase text-xs text-[#0C3B10] mb-2">
                Select Available Sizes:
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((sz) => {
                  const isSelected = formData.sizes.includes(sz);
                  return (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => handleSizeToggle(sz)}
                      className={`py-2 px-4 text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-[#0C3B10] text-[#FFFFFF] border-[#0C3B10] shadow-sm'
                          : 'bg-[#FAF7F2] border-gray-300 text-gray-700 hover:border-[#DBAB7D]'
                      }`}
                    >
                      {sz} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors selector */}
            <div>
              <label className="block font-semibold uppercase text-xs text-[#0C3B10] mb-2">
                Select Available Colors:
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {DEFAULT_COLORS.map((col) => {
                  const isSelected = formData.colors.includes(col.name);
                  return (
                    <button
                      type="button"
                      key={col.name}
                      onClick={() => handleColorToggle(col.name)}
                      className={`flex items-center gap-2 py-1.5 px-3 text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-[#0C3B10] text-white border-[#0C3B10]'
                          : 'bg-[#FAF7F2] border-gray-300 text-gray-700 hover:border-[#DBAB7D]'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                      {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Input */}
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  placeholder="Add custom color (e.g. Rani Pink)..."
                  className="flex-1 bg-[#FAF7F2] border border-gray-300 px-3 py-1.5 text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomColor}
                  className="px-3 py-1.5 bg-[#DBAB7D] text-[#0C3B10] text-xs font-bold uppercase hover:bg-[#0C3B10] hover:text-white transition-colors"
                >
                  + Add Color
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 4: Size x Color Inventory Matrix */}
          <div className="bg-white p-6 sm:p-8 border border-[#0C3B10]/10 shadow-sm space-y-4">
            <div className="pb-3 border-b border-[#0C3B10]/10">
              <h3 className="font-serif text-lg font-bold text-[#0C3B10]">
                04. Size × Color Inventory Matrix
              </h3>
              <p className="text-xs text-gray-500 font-light">
                Directly specify stock quantities per variant. Totals and out-of-stock tags are computed in real time.
              </p>
            </div>

            <VariantMatrix
              sizes={formData.sizes}
              colors={formData.colors}
              variants={formData.variants}
              setVariants={(newVars) => setFormData((prev) => ({ ...prev, variants: typeof newVars === 'function' ? newVars(prev.variants) : newVars }))}
            />
          </div>

          {/* SECTION 5: Delivery Information */}
          <div className="bg-white p-6 sm:p-8 border border-[#0C3B10]/10 shadow-sm space-y-4">
            <div className="pb-3 border-b border-[#0C3B10]/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0C3B10]">
                <Truck className="w-4 h-4 text-[#DBAB7D]" />
                <h3 className="font-serif text-lg font-bold">
                  05. Delivery & Return Terms
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Delivery Time
                </label>
                <input
                  type="text"
                  value={formData.delivery.time}
                  onChange={(e) => setFormData((p) => ({ ...p, delivery: { ...p.delivery, time: e.target.value } }))}
                  placeholder="3–5 days"
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Shipping Charge (₹)
                </label>
                <input
                  type="number"
                  value={formData.delivery.shippingCharge}
                  onChange={(e) => setFormData((p) => ({ ...p, delivery: { ...p.delivery, shippingCharge: parseInt(e.target.value, 10) || 0 } }))}
                  placeholder="99"
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-[#0C3B10] mb-1">
                  Free Shipping Threshold (₹)
                </label>
                <input
                  type="number"
                  value={formData.delivery.freeThreshold}
                  onChange={(e) => setFormData((p) => ({ ...p, delivery: { ...p.delivery, freeThreshold: parseInt(e.target.value, 10) || 0 } }))}
                  placeholder="999"
                  className="w-full bg-[#FAF7F2] border border-gray-300 p-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-6 bg-white border border-[#0C3B10]/10 flex items-center justify-between">
            <Link
              to="/admin/products"
              className="text-xs text-gray-500 hover:underline uppercase font-bold"
            >
              Cancel
            </Link>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="px-6 py-3 border border-[#0C3B10] text-[#0C3B10] text-xs font-bold uppercase tracking-wider hover:bg-[#FAF7F2]"
              >
                Preview Live
              </button>
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#DBAB7D] hover:text-[#0C3B10] transition-colors shadow-lg"
              >
                {isEditing ? 'Save Changes' : 'Publish Product'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Live Preview Modal */}
      <ProductPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        productData={formData}
        onPublish={handleSubmit}
      />
    </div>
  );
};
