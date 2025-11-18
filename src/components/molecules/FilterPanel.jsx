import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterPanel = ({ filters, onFiltersChange, className }) => {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    rating: true
  });

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Beauty",
    "Automotive"
  ];

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handlePriceChange = (key, value) => {
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [key]: parseFloat(value) || 0
      }
    });
  };

  const handleRatingChange = (rating) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: { min: 0, max: 1000 },
      minRating: 0,
      inStock: false
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.minRating > 0 || 
    filters.inStock ||
    filters.priceRange.min > 0 || 
    filters.priceRange.max < 1000;

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-primary transition-colors"
      >
        {title}
        <motion.div
          animate={{ rotate: openSections[section] ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="ChevronDown" className="w-4 h-4" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {openSections[section] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ApperIcon
        key={i}
        name="Star"
        className={cn(
          "w-4 h-4",
          i < count ? "fill-accent text-accent" : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-card p-6", className)}>
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <FilterSection title="Categories" section="category">
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" section="price">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary focus:ring-2 focus:ring-blue-100"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-primary focus:ring-2 focus:ring-blue-100"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Minimum Rating" section="rating">
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={cn(
                  "flex items-center space-x-2 w-full text-left p-2 rounded-lg transition-all hover:bg-gray-50",
                  filters.minRating === rating && "bg-blue-50 border border-primary"
                )}
              >
                <div className="flex items-center space-x-1">
                  {renderStars(rating)}
                </div>
                <span className="text-sm text-gray-600">& Up</span>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* In Stock */}
        <div className="pt-4">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => onFiltersChange({
                ...filters,
                inStock: e.target.checked
              })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <span className="text-sm text-gray-700 group-hover:text-primary transition-colors font-medium">
              In Stock Only
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;