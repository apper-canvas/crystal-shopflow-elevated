import { useState, useEffect } from "react";

export const useCart = () => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shopflow-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("shopflow-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => 
        cartItem.productId === item.productId && 
        JSON.stringify(cartItem.selectedVariant) === JSON.stringify(item.selectedVariant)
      );

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.productId === item.productId && 
          JSON.stringify(cartItem.selectedVariant) === JSON.stringify(item.selectedVariant)
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        return [...prevCart, item];
      }
    });
  };

  const removeFromCart = (productId, selectedVariant = null) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.productId === productId && 
          JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant))
      )
    );
  };

  const updateQuantity = (productId, quantity, selectedVariant = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariant);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId && 
        JSON.stringify(item.selectedVariant) === JSON.stringify(selectedVariant)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  };
};