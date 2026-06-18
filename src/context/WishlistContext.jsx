import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

const API = import.meta.env.VITE_API_URL;

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(`${API}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      if (Array.isArray(data)) {
        setWishlist(data.map((p) => (typeof p === "object" ? p._id : p)));
      } else {
        console.log("Data is not an array:", data);
        setWishlist([]);
      }
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  };

  const toggleWishlist = async (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );

    try {
      await axios.post(
        `${API}/api/wishlist/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
          withCredentials: true,
        },
      );
    } catch (err) {
      fetchWishlist();
      console.error("Toggle wishlist error:", err);
    }
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isWishlisted, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
