import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import FilterPanel from "@/components/molecules/FilterPanel";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const ProductGrid = ({ products, loading, error }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 1000 },
    minRating: 0,
    inStock: false
  });
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Rating" },
    { value: "newest", label: "Newest First" }
  ];

const filteredAndSortedProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    
    let filtered = products.filter(product => {
      // Ensure product exists and has required properties
      if (!product) return false;
      
      // Category filter - handle null/undefined category
      if (filters.categories.length > 0 && product.category) {
        if (!filters.categories.includes(product.category)) {
          return false;
        }
      }
      
      // Price filter - handle null/undefined price
      const productPrice = product.price || 0;
      if (productPrice < filters.priceRange.min || productPrice > filters.priceRange.max) {
        return false;
      }
      
      // Rating filter - handle null/undefined rating
      const productRating = product.rating || 0;
      if (productRating < filters.minRating) {
        return false;
      }
      
      // Stock filter - handle null/undefined stock status
      if (filters.inStock && !product.inStock) {
        return false;
      }
      
      return true;
    });

    // Sort products with null safety
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    return filtered;
  }, [products, filters, sortBy]);

  if (loading) {
    return <Loading variant="product-grid" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with controls */}
<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Our Products
          </h1>
<p className="text-gray-600 mt-2">
            Showing {filteredAndSortedProducts?.length || 0} of {Array.isArray(products) ? products.length : 0} products
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-blue-100"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid" 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <ApperIcon name="Grid3x3" className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list" 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <ApperIcon name="List" className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Filter" className="w-4 h-4" />
              <span>Filters</span>
            </div>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={cn(
          "lg:block",
          showFilters ? "block" : "hidden"
        )}>
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            className="sticky top-24"
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredAndSortedProducts.length === 0 ? (
            <Empty
              title="No products found"
              description="Try adjusting your filters or search for different products"
              icon="Search"
              action={{
                label: "Clear Filters",
                onClick: () => setFilters({
                  categories: [],
                  priceRange: { min: 0, max: 1000 },
                  minRating: 0,
                  inStock: false
                })
              }}
            />
          ) : (
            <AnimatePresence>
              <motion.div
                key={viewMode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "gap-6",
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
                    : "space-y-6"
                )}
              >
                {filteredAndSortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard 
                      product={product}
                      className={viewMode === "list" ? "flex" : ""}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;