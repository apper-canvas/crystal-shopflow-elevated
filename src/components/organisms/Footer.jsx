import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="ShoppingBag" className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">ShopFlow</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">
              Your trusted online shopping destination. Discover quality products with fast shipping and excellent customer service.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ApperIcon name="Facebook" className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ApperIcon name="Twitter" className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ApperIcon name="Instagram" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/?category=Electronics" className="text-gray-400 hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/?category=Clothing" className="text-gray-400 hover:text-white transition-colors">Clothing</Link></li>
              <li><Link to="/?category=Home%20%26%20Garden" className="text-gray-400 hover:text-white transition-colors">Home & Garden</Link></li>
              <li><Link to="/?category=Sports" className="text-gray-400 hover:text-white transition-colors">Sports</Link></li>
              <li><Link to="/?category=Books" className="text-gray-400 hover:text-white transition-colors">Books</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers, new arrivals, and exclusive deals.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:border-primary focus:outline-none text-sm"
              />
              <button className="bg-gradient-to-r from-primary to-blue-600 px-6 py-2 rounded-r-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
                <ApperIcon name="Send" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 ShopFlow. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;