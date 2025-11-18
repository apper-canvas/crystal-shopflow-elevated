import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="text-8xl font-bold text-primary mb-6"
          >
            404
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name="Search" className="w-10 h-10 text-gray-500" />
          </motion.div>

          {/* Title and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <Link to="/">
              <Button size="lg" className="w-full">
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="Home" className="w-5 h-5" />
                  <span>Back to Home</span>
                </div>
              </Button>
            </Link>
            
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full">
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="ShoppingBag" className="w-5 h-5" />
                  <span>Browse Products</span>
                </div>
              </Button>
            </Link>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-sm text-gray-500"
          >
            <p>
              Need help? Contact our{" "}
              <a 
                href="#" 
                className="text-primary hover:text-blue-700 font-medium transition-colors"
              >
                customer support
              </a>
              .
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;