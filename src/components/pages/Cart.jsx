import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CartItem from "@/components/molecules/CartItem";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";

const Cart = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Empty
            title="Your cart is empty"
            description="Add some amazing products to get started with your shopping journey"
            icon="ShoppingCart"
            action={{
              label: "Start Shopping",
              onClick: handleContinueShopping,
              icon: "ShoppingBag"
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart ({cart.length} items)
          </h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <CartItem item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-success font-medium">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Free Shipping Banner */}
              {shipping > 0 && (
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Truck" className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary font-medium">
                      Add {formatPrice(50 - subtotal)} more for free shipping!
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-3 mt-6">
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="CreditCard" className="w-5 h-5" />
                    <span>Proceed to Checkout</span>
                  </div>
                </Button>
                
                <Button
                  onClick={handleContinueShopping}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                    <span>Continue Shopping</span>
                  </div>
                </Button>
              </div>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="Shield" className="w-4 h-4 text-success" />
                  <span>Secure SSL Encryption</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="RotateCcw" className="w-4 h-4 text-success" />
                  <span>30-Day Return Policy</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="Headphones" className="w-4 h-4 text-success" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;