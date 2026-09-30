import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { FilterSidebar } from '../components/product/FilterSidebar';
import { ProductGrid } from '../components/product/ProductGrid';
import { SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useProducts();

  const urlCategory = searchParams.get('category') || 'All';
  const urlSearch = searchParams.get('search') || '';
  const urlFilter = searchParams.get('filter') || '';

  const [filters, setFilters] = useState({
    category: urlCategory,
    search: urlSearch,
    maxPrice: 15000,
    sizes: [],
    colors: [],
    fabrics: [],
    inStockOnly: false,
    filterTag: urlFilter
  });

  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync URL changes to local filters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: searchParams.get('category') || 'All',
      search: searchParams.get('search') || '',
      filterTag: searchParams.get('filter') || ''
    }));
  }, [searchParams]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      search: '',
      maxPrice: 15000,
      sizes: [],
      colors: [],
      fabrics: [],
      inStockOnly: false,
      filterTag: ''
    });
    setSearchParams({});
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (filters.category !== 'All' && p.category !== filters.category) {
        return false;
      }

      // Search query
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.fabric.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.color.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Price filter
      if (p.price > filters.maxPrice) {
        return false;
      }

      // New arrivals filter
      if (filters.filterTag === 'new' && !p.isNew) {
        return false;
      }

      // Sizes filter
      if (filters.sizes.length > 0) {
        const hasSize = filters.sizes.some((size) =>
          p.sizes?.some((s) => s.toUpperCase() === size.toUpperCase() || s.toLowerCase().includes('free'))
        );
        if (!hasSize) return false;
      }

      // Colors filter
      if (filters.colors.length > 0) {
        const hasColor = filters.colors.some((c) =>
          p.color.toLowerCase().includes(c.toLowerCase()) ||
          p.name.toLowerCase().includes(c.toLowerCase())
        );
        if (!hasColor) return false;
      }

      // Fabrics filter
      if (filters.fabrics.length > 0) {
        const hasFabric = filters.fabrics.some((f) =>
          p.fabric.toLowerCase().includes(f.toLowerCase())
        );
        if (!hasFabric) return false;
      }

      // In stock
      if (filters.inStockOnly && p.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // 'featured'
    });
  }, [products, filters, sortBy]);

  // Active filter count
  const activeFiltersCount =
    (filters.category !== 'All' ? 1 : 0) +
    (filters.search ? 1 : 0) +
    (filters.maxPrice < 15000 ? 1 : 0) +
    filters.sizes.length +
    filters.colors.length +
    filters.fabrics.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.filterTag ? 1 : 0);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Banner / Header */}
        <div className="bg-[#0C3B10] text-[#FFFFFF] p-8 sm:p-12 mb-8 border border-[#DBAB7D]/30 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#DBAB7D]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#DBAB7D] block mb-2">
              ✦ Haute Couture Atelier ✦
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight">
              {filters.category !== 'All' ? filters.category : 'The Full Collection'}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 font-light mt-2 leading-relaxed">
              Explore authentic handlooms, Kanjivaram silks, Lucknowi chikankari, and regal bridal silhouettes.
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            resetFilters={handleResetFilters}
            isMobileOpen={isMobileFilterOpen}
            setIsMobileOpen={setIsMobileFilterOpen}
            totalResults={filteredProducts.length}
          />

          {/* Right: Products Area */}
          <div className="flex-1">
            {/* Top Toolbar: Results count, active badges, sort dropdown, mobile filter button */}
            <div className="bg-white p-4 border border-[#0C3B10]/10 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 bg-[#0C3B10] text-white text-xs font-semibold tracking-wider uppercase"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#DBAB7D]" />
                  <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
                </button>

                <div className="text-xs text-[#666666]">
                  Showing <strong className="text-[#0C3B10]">{filteredProducts.length}</strong> handcrafted designs
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#666666] font-medium hidden sm:inline">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#FAF7F2] border border-[#0C3B10]/20 text-xs text-[#0C3B10] font-semibold py-2 px-3 focus:outline-none focus:border-[#0C3B10] cursor-pointer"
                >
                  <option value="featured">Featured Collections</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Active Filters Badges */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white border border-[#0C3B10]/10 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mr-1">
                  Active Filters:
                </span>

                {filters.category !== 'All' && (
                  <span className="inline-flex items-center gap-1 bg-[#0C3B10] text-[#FFFFFF] px-2.5 py-1 text-[11px]">
                    Category: {filters.category}
                    <button onClick={() => setFilters((p) => ({ ...p, category: 'All' }))}>
                      <X className="w-3 h-3 text-[#DBAB7D]" />
                    </button>
                  </span>
                )}

                {filters.search && (
                  <span className="inline-flex items-center gap-1 bg-[#0C3B10] text-[#FFFFFF] px-2.5 py-1 text-[11px]">
                    Search: "{filters.search}"
                    <button onClick={() => setFilters((p) => ({ ...p, search: '' }))}>
                      <X className="w-3 h-3 text-[#DBAB7D]" />
                    </button>
                  </span>
                )}

                {filters.maxPrice < 15000 && (
                  <span className="inline-flex items-center gap-1 bg-[#0C3B10] text-[#FFFFFF] px-2.5 py-1 text-[11px]">
                    Under ₹{filters.maxPrice.toLocaleString('en-IN')}
                    <button onClick={() => setFilters((p) => ({ ...p, maxPrice: 15000 }))}>
                      <X className="w-3 h-3 text-[#DBAB7D]" />
                    </button>
                  </span>
                )}

                {filters.sizes.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 bg-[#FAF7F2] border border-[#0C3B10] text-[#0C3B10] px-2 py-0.5 text-[11px] font-medium">
                    Size: {s}
                    <button onClick={() => setFilters((p) => ({ ...p, sizes: p.sizes.filter((x) => x !== s) }))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {filters.colors.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 bg-[#FAF7F2] border border-[#0C3B10] text-[#0C3B10] px-2 py-0.5 text-[11px] font-medium">
                    Color: {c}
                    <button onClick={() => setFilters((p) => ({ ...p, colors: p.colors.filter((x) => x !== c) }))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {filters.fabrics.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 bg-[#FAF7F2] border border-[#0C3B10] text-[#0C3B10] px-2 py-0.5 text-[11px] font-medium">
                    {f}
                    <button onClick={() => setFilters((p) => ({ ...p, fabrics: p.fabrics.filter((x) => x !== f) }))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-red-700 hover:underline font-bold ml-auto"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};
