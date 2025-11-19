import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    shipping: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States"
    },
    payment: {
      method: "card",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: ""
    }
  });

  const [errors, setErrors] = useState({});

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

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: ""
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    const { shipping } = formData;

    if (!shipping.firstName) newErrors["shipping.firstName"] = "First name is required";
    if (!shipping.lastName) newErrors["shipping.lastName"] = "Last name is required";
    if (!shipping.email) newErrors["shipping.email"] = "Email is required";
    if (!shipping.phone) newErrors["shipping.phone"] = "Phone is required";
    if (!shipping.address) newErrors["shipping.address"] = "Address is required";
    if (!shipping.city) newErrors["shipping.city"] = "City is required";
    if (!shipping.state) newErrors["shipping.state"] = "State is required";
    if (!shipping.zipCode) newErrors["shipping.zipCode"] = "ZIP code is required";

    // Email validation
    if (shipping.email && !/\S+@\S+\.\S+/.test(shipping.email)) {
      newErrors["shipping.email"] = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const { payment } = formData;

    if (payment.method === "card") {
      if (!payment.cardNumber) newErrors["payment.cardNumber"] = "Card number is required";
      if (!payment.expiryDate) newErrors["payment.expiryDate"] = "Expiry date is required";
      if (!payment.cvv) newErrors["payment.cvv"] = "CVV is required";
      if (!payment.nameOnCard) newErrors["payment.nameOnCard"] = "Name on card is required";

      // Card number validation (simple check)
      if (payment.cardNumber && payment.cardNumber.replace(/\s/g, "").length < 13) {
        newErrors["payment.cardNumber"] = "Invalid card number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const orderData = {
        items: cart,
        total,
        shippingAddress: formData.shipping,
        paymentMethod: formData.payment.method,
        status: "pending"
      };

      const order = await orderService.create(orderData);
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  const steps = [
    { number: 1, title: "Shipping", icon: "Truck" },
    { number: 2, title: "Payment", icon: "CreditCard" },
    { number: 3, title: "Review", icon: "Eye" }
  ];

  return (
<div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600">Complete your purchase</p>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.number ? "text-primary" : "text-gray-400"
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.number 
                      ? "bg-gradient-to-r from-primary to-blue-600 text-white" 
                      : "bg-gray-200 text-gray-400"
                  }`}>
                    {currentStep > step.number ? (
                      <ApperIcon name="Check" className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.number ? "bg-primary" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-card p-6"
            >
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Shipping Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={formData.shipping.firstName}
                      onChange={(e) => handleInputChange("shipping", "firstName", e.target.value)}
                      error={errors["shipping.firstName"]}
                    />
                    <Input
                      label="Last Name"
                      value={formData.shipping.lastName}
                      onChange={(e) => handleInputChange("shipping", "lastName", e.target.value)}
                      error={errors["shipping.lastName"]}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      value={formData.shipping.email}
                      onChange={(e) => handleInputChange("shipping", "email", e.target.value)}
                      error={errors["shipping.email"]}
                    />
                    <Input
                      label="Phone"
                      value={formData.shipping.phone}
                      onChange={(e) => handleInputChange("shipping", "phone", e.target.value)}
                      error={errors["shipping.phone"]}
                    />
                  </div>
                  
                  <Input
                    label="Address"
                    value={formData.shipping.address}
                    onChange={(e) => handleInputChange("shipping", "address", e.target.value)}
                    error={errors["shipping.address"]}
                  />
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      value={formData.shipping.city}
                      onChange={(e) => handleInputChange("shipping", "city", e.target.value)}
                      error={errors["shipping.city"]}
                    />
                    <Input
                      label="State"
                      value={formData.shipping.state}
                      onChange={(e) => handleInputChange("shipping", "state", e.target.value)}
                      error={errors["shipping.state"]}
                    />
                    <Input
                      label="ZIP Code"
                      value={formData.shipping.zipCode}
                      onChange={(e) => handleInputChange("shipping", "zipCode", e.target.value)}
                      error={errors["shipping.zipCode"]}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Payment Information
                  </h2>
                  
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.payment.method === "card"}
                          onChange={(e) => handleInputChange("payment", "method", e.target.value)}
                          className="text-primary"
                        />
                        <ApperIcon name="CreditCard" className="w-5 h-5 text-gray-600" />
                        <span>Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-primary">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.payment.method === "paypal"}
                          onChange={(e) => handleInputChange("payment", "method", e.target.value)}
                          className="text-primary"
                        />
                        <ApperIcon name="Wallet" className="w-5 h-5 text-gray-600" />
                        <span>PayPal</span>
                      </label>
                    </div>
                  </div>

                  {/* Card Details */}
                  {formData.payment.method === "card" && (
                    <div className="space-y-4">
                      <Input
                        label="Card Number"
                        value={formData.payment.cardNumber}
                        onChange={(e) => handleInputChange("payment", "cardNumber", e.target.value)}
                        error={errors["payment.cardNumber"]}
                        placeholder="1234 5678 9012 3456"
                      />
                      <Input
                        label="Name on Card"
                        value={formData.payment.nameOnCard}
                        onChange={(e) => handleInputChange("payment", "nameOnCard", e.target.value)}
                        error={errors["payment.nameOnCard"]}
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Expiry Date"
                          value={formData.payment.expiryDate}
                          onChange={(e) => handleInputChange("payment", "expiryDate", e.target.value)}
                          error={errors["payment.expiryDate"]}
                          placeholder="MM/YY"
                        />
                        <Input
                          label="CVV"
                          value={formData.payment.cvv}
                          onChange={(e) => handleInputChange("payment", "cvv", e.target.value)}
                          error={errors["payment.cvv"]}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Review Your Order
                  </h2>
                  
                  {/* Shipping Address */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-gray-600 text-sm">
                      {formData.shipping.firstName} {formData.shipping.lastName}<br />
                      {formData.shipping.address}<br />
                      {formData.shipping.city}, {formData.shipping.state} {formData.shipping.zipCode}<br />
                      {formData.shipping.email} | {formData.shipping.phone}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                    <p className="text-gray-600 text-sm capitalize">
                      {formData.payment.method === "card" ? "Credit/Debit Card" : "PayPal"}
                      {formData.payment.method === "card" && formData.payment.cardNumber && (
                        <span className="ml-2">
                          ending in {formData.payment.cardNumber.slice(-4)}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Order Items</h3>
                    {cart.map(item => (
                      <div key={item.productId} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                    <span>Back</span>
                  </div>
                </Button>

                {currentStep < 3 ? (
                  <Button onClick={handleNextStep}>
                    <div className="flex items-center space-x-2">
                      <span>Continue</span>
                      <ApperIcon name="ArrowRight" className="w-4 h-4" />
                    </div>
                  </Button>
                ) : (
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    variant="accent"
                  >
                    <div className="flex items-center space-x-2">
                      {loading ? (
                        <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                      ) : (
                        <ApperIcon name="CreditCard" className="w-4 h-4" />
                      )}
                      <span>{loading ? "Processing..." : "Place Order"}</span>
                    </div>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                {cart.map(item => (
                  <div key={item.productId} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-success font-medium">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Security Icons */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <ApperIcon name="Shield" className="w-4 h-4 text-success" />
                  <span>SSL Secured Checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <ApperIcon name="Lock" className="w-4 h-4 text-success" />
                  <span>Your payment info is protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;