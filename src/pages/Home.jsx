import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Leaf, ShieldCheck, Sprout, Truck } from "lucide-react";

const API = import.meta.env.VITE_API_URL; // ✅ FIXED

const CACHE_KEY = "FreshCart_home";
const CACHE_TTL = 5 * 60 * 1000;

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
};

const bustCache = () => sessionStorage.removeItem(CACHE_KEY);

const Home = ({ search = "" }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [ads, setAds] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, []);

  const fetchData = useCallback(async (force = false) => {
    if (!force) {
      const cached = readCache();
      if (cached) {
        setProducts(cached.products);
        setAds(cached.ads);
        setOffers(cached.offers);
        return;
      }
    }

    try {
      const [prodRes, adsRes, offRes] = await Promise.all([
        fetch(`${API}/api/products`, { credentials: "include" }), // ✅ FIXED
        fetch(`${API}/api/ads`),
        fetch(`${API}/api/offers`),
      ]);

      const [products, ads, offers] = await Promise.all([
        prodRes.json(),
        adsRes.json(),
        offRes.json(),
      ]);

      setProducts(products);
      setAds(ads);
      setOffers(offers);
      writeCache({ products, ads, offers });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pinnedProducts = products
    .filter((p) => p.isPinned)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto p-4">

      {/* HERO */}
      <div className="bg-green-100 p-6 rounded-xl mb-6">
        <h1 className="text-3xl font-bold text-green-700">
          FreshCart 🌱
        </h1>
        <p className="text-gray-600 mt-2">
          Fresh groceries delivered to your door
        </p>
      </div>

      {/* OFFERS */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-3">Special Offers</h2>
        <div className="flex gap-4 overflow-x-auto">
          {offers.map((offer) => (
            <img
              key={offer._id}
              src={offer.image}
              alt="offer"
              className="w-64 h-36 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div>
        <h2 className="text-xl font-bold mb-4">Featured Products</h2>

        {pinnedProducts.length === 0 ? (
          <p className="text-gray-500">No products available</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pinnedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Home;