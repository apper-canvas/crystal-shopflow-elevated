import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-toastify";

const ProductCard = ({ product, className }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
      selectedVariant: null
    });
    
    toast.success("Added to cart!");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon key={i} name="Star" className="w-4 h-4 fill-accent text-accent" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <ApperIcon key="half" name="Star" className="w-4 h-4 fill-accent/50 text-accent" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <ApperIcon key={`empty-${i}`} name="Star" className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("group", className)}
    >
      <Link to={`/product/${product.id}`}>
        <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
                <span className="text-sm text-gray-500 ml-1">
                  ({product.reviewCount})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {product.category}
                </p>
              </div>

              {product.inStock && (
                <button
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-primary to-blue-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
                  title="Add to cart"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;