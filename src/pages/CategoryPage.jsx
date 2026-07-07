import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const API = import.meta.env.VITE_API_URL;

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/api/products`, {
          credentials: "include",
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          const categoryFiltered = data.filter(
            (p) =>
              p.category?.toLowerCase().trim() ===
              categoryName.toLowerCase().trim(),
          );
          setAllProducts(categoryFiltered);
        }
      } catch (err) {
        console.error("Category fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, allProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-[#6FAF8E] rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 py-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full border hover:bg-gray-100 transition"
        >
          ←
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold capitalize text-gray-800">
            {categoryName}
          </h1>
          <p className="text-sm text-gray-500">
            {filteredProducts.length} Products
          </p>
        </div>
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-gray-500 text-lg font-medium">
            No products available
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-[#6FAF8E] text-white px-5 py-2 rounded-lg hover:bg-green-600"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
