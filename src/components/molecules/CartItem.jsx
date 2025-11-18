import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.productId, item.selectedVariant);
    } else {
      updateQuantity(item.productId, newQuantity, item.selectedVariant);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white"
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {item.name}
        </h4>
        <p className="text-lg font-bold text-primary mt-1">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <ApperIcon name="Minus" className="w-4 h-4 text-gray-600" />
        </button>
        
        <span className="w-8 text-center font-medium">
          {item.quantity}
        </span>
        
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <ApperIcon name="Plus" className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Remove Button */}
<button
        onClick={() => removeFromCart(item.productId, item.selectedVariant)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <ApperIcon name="Trash2" className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default CartItem;