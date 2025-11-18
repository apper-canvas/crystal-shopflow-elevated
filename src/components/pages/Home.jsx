import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductGrid from "@/components/organisms/ProductGrid";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";

const Home = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchQuery = searchParams.get("search");
  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    loadProducts();
  }, [searchQuery, categoryFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      let data = await productService.getAll();
      
      // Apply search filter
      if (searchQuery) {
        data = data.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply category filter
      if (categoryFilter) {
        data = data.filter(product => 
          product.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {!searchQuery && !categoryFilter && (
        <section className="relative bg-gradient-to-r from-primary to-blue-600 text-white py-20">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  ShopFlow
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Discover amazing products with fast shipping and unbeatable prices. 
                Your perfect shopping experience starts here.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}
                  className="bg-gradient-to-r from-accent to-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="ShoppingBag" className="w-5 h-5" />
                    <span>Shop Now</span>
                  </div>
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="Truck" className="w-5 h-5" />
                    <span>Free Shipping</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Page Header for filtered results */}
      {(searchQuery || categoryFilter) && (
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {searchQuery && (
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Search Results for "{searchQuery}"
                </h1>
              )}
              {categoryFilter && (
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {categoryFilter}
                </h1>
              )}
              <p className="text-xl text-gray-600">
                Find the perfect products for you
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section id="products" className="py-8">
        <ProductGrid 
          products={products}
          loading={loading}
          error={error}
        />
      </section>

      {/* Features Section */}
      {!searchQuery && !categoryFilter && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose ShopFlow?
              </h2>
              <p className="text-xl text-gray-600">
                We're committed to providing you with the best shopping experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Truck" className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Shipping</h3>
                <p className="text-gray-600">
                  Free shipping on orders over $50. Get your products delivered in 2-3 business days.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Shield" className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
                <p className="text-gray-600">
                  Your payment information is encrypted and secure. Shop with confidence.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="RotateCcw" className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Returns</h3>
                <p className="text-gray-600">
                  Not satisfied? Return any item within 30 days for a full refund.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;