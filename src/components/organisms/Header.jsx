import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import { useCart } from "@/hooks/useCart";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
    setIsSearchOpen(false);
  };

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Books",
    "Beauty",
    "Automotive"
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingBag" className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              ShopFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Home
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-primary font-medium transition-colors">
                <span>Categories</span>
                <ApperIcon name="ChevronDown" className="w-4 h-4" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => navigate(`/?category=${encodeURIComponent(category)}`)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <ApperIcon name="Search" className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <ApperIcon name="ShoppingCart" className="w-6 h-6" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-primary to-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </motion.span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <SearchBar onSearch={handleSearch} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <nav className="space-y-4">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  Home
                </Link>
                
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Categories</p>
                  <div className="pl-4 space-y-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          navigate(`/?category=${encodeURIComponent(category)}`);
                          setIsMenuOpen(false);
                        }}
                        className="block text-gray-600 hover:text-primary transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;