import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const API = import.meta.env.VITE_API_URL;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const mergeCartData = (items) => {
    const merged = items.reduce((acc, current) => {
      const productId = current.product?._id || current.product || current._id;
      const existing = acc.find(
        (item) => (item.product?._id || item.product || item._id) === productId,
      );
      if (existing) {
        existing.quantity += current.quantity;
      } else {
        acc.push({ ...current });
      }
      return acc;
    }, []);
    return merged;
  };

  const fetchCart = async () => {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
    console.log("TOKEN:", token);
    console.log("API:", `${API}/api/cart`);

    if (!token) return; // Don't call API

    try {
      const res = await axios.get(`${API}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

      console.log("CART TOKEN:", token);
      const { data } = await axios.post(
        `${API}/api/cart`,
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );
      console.log("ADD TO CART RESPONSE:", data);
      const rawItems = Array.isArray(data)
        ? data
        : data.items || data.cartItems || [];
      setCartItems(mergeCartData(rawItems));
    } catch (err) {
      console.error("Add to Cart Error:", err);
      alert("Could not add to cart. Please try again.");
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, fetchCart, setCartItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
