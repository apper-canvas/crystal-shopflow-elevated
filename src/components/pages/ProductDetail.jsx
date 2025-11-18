import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import { useCart } from "@/hooks/useCart";
import { productService } from "@/services/api/productService";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await productService.getById(parseInt(id));
      setProduct(data);
      
      // Set default variant if available
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0]);
      }
    } catch (err) {
      setError("Product not found");
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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon key={i} name="Star" className="w-5 h-5 fill-accent text-accent" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <ApperIcon key="half" name="Star" className="w-5 h-5 fill-accent/50 text-accent" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <ApperIcon key={`empty-${i}`} name="Star" className="w-5 h-5 text-gray-300" />
      );
    }

    return stars;
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      selectedVariant
    });
    
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return <Loading variant="product-detail" />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background py-12">
        <ErrorView 
          error={error}
          onRetry={loadProduct}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <button 
            onClick={() => navigate("/")}
            className="hover:text-primary transition-colors"
          >
            Home
          </button>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="capitalize">{product.category}</span>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? "border-primary" 
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-500">
                  ({product.reviewCount} reviews)
                </span>
                <span className="text-sm text-gray-500 capitalize">
                  {product.category}
                </span>
              </div>

              <p className="text-4xl font-bold text-primary mb-4">
                {formatPrice(product.price)}
              </p>

              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Options:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedVariant === variant
                          ? "border-primary bg-blue-50 text-primary"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {variant.size && `${variant.size} `}
                      {variant.color && `${variant.color}`}
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Quantity:</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <ApperIcon name="Minus" className="w-4 h-4 text-gray-600" />
                </button>
                
                <span className="w-16 text-center font-semibold text-xl">
                  {quantity}
                </span>
                
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <ApperIcon name="Plus" className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <ApperIcon 
                name={product.inStock ? "Check" : "X"} 
                className={`w-5 h-5 ${product.inStock ? "text-success" : "text-error"}`} 
              />
              <span className={`font-medium ${product.inStock ? "text-success" : "text-error"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full"
                size="lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="ShoppingCart" className="w-5 h-5" />
                  <span>Add to Cart</span>
                </div>
              </Button>
              
              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                variant="accent"
                className="w-full"
                size="lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <ApperIcon name="Zap" className="w-5 h-5" />
                  <span>Buy Now</span>
                </div>
              </Button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <ApperIcon name="Truck" className="w-4 h-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <ApperIcon name="RotateCcw" className="w-4 h-4" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <ApperIcon name="Shield" className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <ApperIcon name="Headphones" className="w-4 h-4" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;