import React from 'react';
import { X, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import { ALL_CATEGORIES, ALL_FABRICS, ALL_SIZES } from '../../data/mockProducts';

export const FilterSidebar = ({
  filters,
  setFilters,
  resetFilters,
  isMobileOpen,
  setIsMobileOpen,
  totalResults
}) => {
  const colorOptions = [
    { name: 'Emerald Green', hex: '#0C3B10' },
    { name: 'Gold & Beige', hex: '#DBAB7D' },
    { name: 'Ruby Red', hex: '#8B181B' },
    { name: 'Ivory & Cream', hex: '#FAF7F2' },
    { name: 'Deep Pine', hex: '#16541b' },
  ];

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? 'All' : category
    }));
  };

  const handleFabricToggle = (fabric) => {
    setFilters((prev) => {
      const exists = prev.fabrics.includes(fabric);
      return {
        ...prev,
        fabrics: exists ? prev.fabrics.filter((f) => f !== fabric) : [...prev.fabrics, fabric]
      };
    });
  };

  const handleSizeToggle = (size) => {
    setFilters((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size]
      };
    });
  };

  const handleColorToggle = (colorName) => {
    setFilters((prev) => {
      const exists = prev.colors.includes(colorName);
      return {
        ...prev,
        colors: exists ? prev.colors.filter((c) => c !== colorName) : [...prev.colors, colorName]
      };
    });
  };

  const filterContent = (
    <div className="space-y-6 text-xs text-[#1A1A1A]">
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between pb-4 border-b border-[#0C3B10]/10">
        <div className="flex items-center gap-2 text-[#0C3B10] font-serif text-lg font-bold">
          <SlidersHorizontal className="w-4 h-4 text-[#DBAB7D]" />
          <span>Refine Selection</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-[11px] text-[#0C3B10] hover:text-[#DBAB7D] flex items-center gap-1 font-semibold uppercase tracking-wider"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Section */}
      <div>
        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#0C3B10] mb-3">
          Category
        </h4>
        <div className="space-y-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`w-full text-left py-1.5 px-2.5 text-xs transition-colors flex items-center justify-between ${
                filters.category === cat
                  ? 'bg-[#0C3B10] text-[#FFFFFF] font-semibold'
                  : 'text-[#666666] hover:text-[#0C3B10] hover:bg-[#FAF7F2]'
              }`}
            >
              <span>{cat}</span>
              {filters.category === cat && <span className="text-[#DBAB7D]">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="pt-4 border-t border-[#0C3B10]/10">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#0C3B10]">
            Max Price
          </h4>
          <span className="font-bold text-[#0C3B10]">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="1500"
          max="15000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: parseInt(e.target.value, 10) }))}
          className="w-full accent-[#0C3B10] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#666666] mt-1">
          <span>₹1,500</span>
          <span>₹15,000+</span>
        </div>
      </div>

      {/* Size Filter */}
      <div className="pt-4 border-t border-[#0C3B10]/10">
        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#0C3B10] mb-3">
          Available Size
        </h4>
        <div className="grid grid-cols-4 gap-1.5">
          {ALL_SIZES.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`py-1.5 text-xs font-semibold border transition-all text-center ${
                  isSelected
                    ? 'bg-[#0C3B10] text-[#FFFFFF] border-[#0C3B10]'
                    : 'bg-white border-[#0C3B10]/20 text-[#0C3B10] hover:border-[#DBAB7D]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="pt-4 border-t border-[#0C3B10]/10">
        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#0C3B10] mb-3">
          Color Palette
        </h4>
        <div className="space-y-2">
          {colorOptions.map((col) => {
            const isSelected = filters.colors.includes(col.name);
            return (
              <button
                key={col.name}
                onClick={() => handleColorToggle(col.name)}
                className={`flex items-center gap-2.5 w-full py-1 text-left ${
                  isSelected ? 'font-bold text-[#0C3B10]' : 'text-[#666666] hover:text-[#0C3B10]'
                }`}
              >
                <div
                  className="w-4 h-4 border border-black/20 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: col.hex }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs">{col.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fabric Filter */}
      <div className="pt-4 border-t border-[#0C3B10]/10">
        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#0C3B10] mb-3">
          Artisanal Fabric
        </h4>
        <div className="space-y-1.5">
          {ALL_FABRICS.map((fabric) => {
            const isSelected = filters.fabrics.includes(fabric);
            return (
              <label
                key={fabric}
                className="flex items-center gap-2 cursor-pointer py-1 hover:text-[#0C3B10] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleFabricToggle(fabric)}
                  className="accent-[#0C3B10] w-3.5 h-3.5"
                />
                <span className={`text-xs ${isSelected ? 'font-semibold text-[#0C3B10]' : 'text-[#666666]'}`}>
                  {fabric}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* In Stock Only Toggle */}
      <div className="pt-4 border-t border-[#0C3B10]/10">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-[#0C3B10] uppercase tracking-wider">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
            className="accent-[#0C3B10] w-4 h-4 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Column */}
      <div className="hidden lg:block w-64 flex-shrink-0 bg-white p-6 border border-[#0C3B10]/10 sticky top-28 self-start shadow-sm">
        {filterContent}
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl p-6 z-10 overflow-y-auto animate-slide-left">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <span className="font-serif text-lg font-bold text-[#0C3B10]">Filters</span>
              <button onClick={() => setIsMobileOpen(false)} className="p-1">
                <X className="w-5 h-5 text-[#0C3B10]" />
              </button>
            </div>
            {filterContent}
            <div className="mt-6 pt-4 border-t">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-full py-3 bg-[#0C3B10] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest"
              >
                Apply Filters ({totalResults})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
