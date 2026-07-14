import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

const API = import.meta.env.VITE_API_URL;

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const { data } = await axios.get(`${API}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      if (Array.isArray(data)) {
        setWishlist(Array.isArray(data) ? data.map((p) => p._id) : []);
      } else {
        console.log("Data is not an array:", data);
        setWishlist([]);
      }
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  };

  const toggleWishlist = async (productId) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    try {
      await axios.post(
        `${API}/api/wishlist/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        },
      );

      await fetchWishlist(); // refresh after backend update
    } catch (err) {
      console.error(err);
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
