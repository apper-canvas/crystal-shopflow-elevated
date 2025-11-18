import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { orderService } from "@/services/api/orderService";
import { format } from "date-fns";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await orderService.getById(parseInt(orderId));
      setOrder(data);
    } catch (err) {
      setError("Order not found");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5); // 5 days from now
    return format(deliveryDate, "EEEE, MMMM d");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <Loading />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background py-12">
        <ErrorView 
          error={error}
          onRetry={loadOrder}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Check" className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase
          </p>
          <p className="text-lg text-gray-500">
            Order #{order.id} • Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
          </p>
        </motion.div>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-card p-8 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shipping Information
              </h2>
              <div className="space-y-2 text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.email}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Delivery Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Delivery Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <ApperIcon name="Truck" className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium text-gray-900">Estimated Delivery</p>
                    <p className="text-sm text-gray-600">{getEstimatedDelivery()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <ApperIcon name="Package" className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">Tracking</p>
                    <p className="text-sm text-gray-600">We'll email you tracking info soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-card p-8 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Order Details
          </h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  {item.selectedVariant && (
                    <p className="text-sm text-gray-500">
                      {item.selectedVariant.size && `Size: ${item.selectedVariant.size} `}
                      {item.selectedVariant.color && `Color: ${item.selectedVariant.color}`}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatPrice(item.price)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="border-t mt-6 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.total * 0.85)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{formatPrice(order.total * 0.07)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatPrice(order.total * 0.08)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What's Next?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Order Processing</h3>
                <p className="text-sm text-gray-600">
                  We're preparing your items for shipment. You'll receive a confirmation email shortly.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Tracking Info</h3>
                <p className="text-sm text-gray-600">
                  Once shipped, we'll send you tracking details so you can monitor your package.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              <div className="flex items-center space-x-2">
                <ApperIcon name="ShoppingBag" className="w-5 h-5" />
                <span>Continue Shopping</span>
              </div>
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Download" className="w-5 h-5" />
              <span>Download Receipt</span>
            </div>
          </Button>
        </motion.div>

        {/* Support Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 p-6 bg-white rounded-lg shadow-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            Our customer support team is here to help with any questions about your order.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <ApperIcon name="Mail" className="w-4 h-4" />
              <span>support@shopflow.com</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <ApperIcon name="Phone" className="w-4 h-4" />
              <span>1-800-SHOPFLOW</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;