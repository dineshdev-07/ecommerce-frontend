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
              categoryName.toLowerCase().trim()
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
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 text-2xl">
            ←
          </button>
          <h1 className="text-3xl font-bold capitalize">
            {categoryName} Products
          </h1>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;