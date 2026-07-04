import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Heart } from "lucide-react";
import { calculateDiscountedPrice } from "../utils/offerUtils";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product, isLowestPriceItem = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const liked = isWishlisted(product._id);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
  const loyaltyPoints = Number(userInfo?.loyaltyPoints || 0);
  const isNewUser = !!(userInfo && userInfo.firstOrderCompleted === false);
  const isLoyal = loyaltyPoints >= 20;
  const isPlusMember = userInfo?.isPlusMember || false;

  // ── Clamp stock: negative DB values treated as 0 ────────────────────────────
  const stock = Math.max(0, Number(product.quantity) || 0);
  const isOutOfStock = stock === 0;
  const isLowStock = stock >= 1 && stock <= 10;
  const mrp = Number(product.price) || 0;

  const offerData = calculateDiscountedPrice(
    product,
    { isNewUser, loyaltyPoints, isPlusMember },
    { isLowestPriceItem, isFirstOrder: isNewUser, quantityIndex: 0 },
  );

  const finalPrice = offerData.finalPrice;
  const totalDiscount = offerData.totalDiscount;
  const totalSavings = mrp - finalPrice;

  const showNewUserBadge =
    isNewUser &&
    isLowestPriceItem &&
    totalDiscount > offerData.baseDiscount + offerData.expiryDiscount;
  const showLoyalBadge =
    !showNewUserBadge && isLoyal && offerData.appliedLabel === "LOYALTY OFFER";
  const showPlusBadge = !showNewUserBadge && !showLoyalBadge && isPlusMember;

  // ── Status line: one consistent line height for every card ──────────────────
  const statusLine = isOutOfStock ? (
    <p className="text-red-500 text-[8px] xs:text-[9px] sm:text-[10px] font-bold">
      No stock
    </p>
  ) : isLowStock ? (
    <p className="text-orange-500 text-[8px] xs:text-[9px] sm:text-[10px] font-bold">
      ⚠ Only {stock} left
    </p>
  ) : showNewUserBadge ? (
    <p className="text-blue-600 text-[8px] xs:text-[9px] sm:text-[10px] font-bold">
      🎁 20% Extra!
    </p>
  ) : showLoyalBadge ? (
    <p className="text-purple-600 text-[8px] xs:text-[9px] sm:text-[10px] font-bold">
      👤 Loyalty Applied
    </p>
  ) : isPlusMember ? (
    <p className="text-amber-600 text-[8px] xs:text-[9px] sm:text-[10px] font-bold">
      ⭐ Plus Price
    </p>
  ) : isLoyal ? (
    <p className="text-gray-400 text-[7px] xs:text-[8px] sm:text-[9px]">
      Loyalty offer eligible
    </p>
  ) : (
    <p className="text-gray-400 text-[7px] xs:text-[8px] sm:text-[9px]">
      20 pts = Loyalty Price
    </p>
  );

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="relative bg-gray-50">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/250"}
          alt={product.name}
          className="h-44 w-full object-contain p-4 transition duration-300 group-hover:scale-105"
        />

        {/* Wishlist Bottom Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
        >
          <Heart
            size={20}
            className={
              liked
                ? "fill-red-500 text-red-500"
                : "text-gray-500 hover:text-red-500"
            }
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="h-4 text-xs font-medium uppercase tracking-wide text-gray-400 truncate">
          {product.brand}
        </p>

       <h3 className="mt-1 h-10 line-clamp-2 text-sm font-semibold text-gray-800">
          {product.name}
        </h3>

        <div className="mt-3 h-7 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">₹{finalPrice}</span>

          {mrp > finalPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{mrp}</span>

              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                {totalDiscount}% OFF
              </span>
            </>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isOutOfStock) addToCart({ ...product, finalPrice });
          }}
          disabled={isOutOfStock}
          className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold transition ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400"
              : "bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
