import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Package,
  CreditCard,
  Phone,
  XCircle,
  CheckCircle,
  RefreshCcw,
  Tag,
  Percent,
  Star,
  Gift,
  Eye,
  ShoppingCart,
  Calendar,
  TrendingDown,
  Shield,
  HelpCircle,
  Truck,
  Clock,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;


const Row = ({ icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    orange: "bg-orange-50 border-orange-100 text-orange-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
  };
  return (
    <div
      className={`flex items-center justify-between border rounded-lg px-2.5 py-1 ${colors[color] || colors.blue}`}
    >
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[9px] font-bold">{label}</span>
      </div>
      <span className="text-[9px] font-black">{value}</span>
    </div>
  );
};

const FactorRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1 text-purple-400">
      {icon}
      <span className="text-[8px] text-gray-500">{label}</span>
    </div>
    <span className="text-[8px] font-black text-purple-600">{value}</span>
  </div>
);

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const { data } = await axios.get(
  `${API}/api/orders/admin/${id}`,
  {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  }
);
      setOrder(data);
    } catch {
      setError("Order not found ❌");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateOrderStatus = async (action) => {
    try {
      setBtnLoading(true);
      const url =
        action === "cancel"
          ? `${API}/api/orders/admin/${id}/cancel`
          : `${API}/api/orders/${id}/${action}`;
      await axios.put(url, {}, { withCredentials: true });
      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} order`);
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-black text-[#6FAF8E] animate-pulse text-sm tracking-widest">
        Syncing Admin Portal...
      </div>
    );
  if (error || !order)
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 gap-4">
        <XCircle size={50} className="text-red-500" />
        <p className="font-bold text-gray-600">{error}</p>
      </div>
    );

  const itemsPriceSum = order.orderItems.reduce(
    (acc, i) => acc + i.price * i.qty,
    0,
  );
  const _localUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const isPlusMember = !!(order.user?.isPlusMember || _localUser?.isPlusMember);
  const deliveryFee = isPlusMember ? 0 : itemsPriceSum >= 299 ? 0 : 39;

  const showDeliverBtn = !order.isDelivered && !order.isCancelled;
  const showCancelBtn = !order.isDelivered && !order.isCancelled;
  const showRefundBtn = order.isPaid && order.isCancelled && !order.isRefunded;

  const statusChips = [
    {
      show: order.isPaid,
      label: `Paid · ${order.paymentMethod}`,
      bg: "bg-green-100 text-green-700",
    },
    { show: !order.isPaid, label: "Unpaid", bg: "bg-red-100 text-red-600" },
    {
      show: order.isDelivered,
      label: "Delivered",
      bg: "bg-blue-100 text-blue-700",
    },
    {
      show: order.isCancelled,
      label: "Cancelled",
      bg: "bg-orange-100 text-orange-700",
    },
    {
      show: order.isRefunded,
      label: "Refunded",
      bg: "bg-purple-100 text-purple-700",
    },
  ].filter((s) => s.show);

  return (
   <div className="min-h-screen bg-[#FFFBEA] p-5 rounded-2xl">
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b px-3 sm:px-6 lg:px-8 py-3 sm:py-4 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-xl text-[#6FAF8E] shrink-0 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg lg:text-xl font-black uppercase italic truncate">
                Admin: Order Control
              </h1>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-mono font-bold truncate">
                ID: {order._id}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto shrink-0">
            
            {showCancelBtn && (
              <button
                disabled={btnLoading}
                onClick={() => updateOrderStatus("cancel")}
                className="flex-1 sm:flex-none bg-red-50 text-red-600 border border-red-200 px-3 sm:px-5 py-2.5 rounded-xl font-black text-[10px] sm:text-xs flex items-center justify-center gap-1.5 hover:bg-red-100 transition disabled:opacity-60"
              >
                <XCircle size={13} />
                <span className="hidden xs:inline">CANCEL </span>ORDER
              </button>
            )}
            {showRefundBtn && (
              <button
                disabled={btnLoading}
                onClick={() => updateOrderStatus("refund")}
                className="flex-1 sm:flex-none bg-orange-500 text-white px-3 sm:px-5 py-2.5 rounded-xl font-black text-[10px] sm:text-xs flex items-center justify-center gap-1.5 hover:bg-orange-600 shadow-lg shadow-orange-200 animate-bounce disabled:opacity-60"
              >
                <RefreshCcw size={13} />
                <span className="hidden xs:inline">PROCESS </span>REFUND
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-3 sm:p-5 lg:p-8 flex flex-col xl:flex-row gap-6 lg:gap-8">
        <div className="flex-[2] min-w-0 space-y-4 sm:space-y-6">
          <div className="flex flex-wrap gap-2">
            {statusChips.map(({ label, bg }) => (
              <span
                key={label}
                className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${bg}`}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                icon: (
                  <CreditCard
                    size={18}
                    className={order.isPaid ? "text-green-600" : "text-red-500"}
                  />
                ),
                label: "Payment Status",
                value: order.isPaid
                  ? `PAID (${order.paymentMethod})`
                  : "UNPAID",
                bg: order.isPaid
                  ? "bg-green-50 border-green-100"
                  : "bg-red-50 border-red-100",
              },
              {
                icon: (
                  <Package
                    size={18}
                    className={
                      order.isDelivered ? "text-blue-600" : "text-gray-400"
                    }
                  />
                ),
                label: "Delivery Status",
                value: order.isDelivered
                  ? "DELIVERED"
                  : order.orderStatus === "Out for Delivery"
                    ? "EN ROUTE"
                    : "PROCESSING",
                bg: order.isDelivered
                  ? "bg-blue-50 border-blue-100"
                  : order.orderStatus === "Out for Delivery"
                    ? "bg-purple-50 border-purple-100"
                    : "bg-gray-50 border-gray-100",
              },
              {
                icon: (
                  <RefreshCcw
                    size={18}
                    className={
                      order.isRefunded ? "text-purple-600" : "text-orange-500"
                    }
                  />
                ),
                label: "Order Lifecycle",
                value: order.isRefunded
                  ? "REFUNDED"
                  : order.isCancelled
                    ? "CANCELLED"
                    : "ACTIVE",
                bg: order.isCancelled
                  ? "bg-orange-50 border-orange-100"
                  : "bg-gray-50 border-gray-100",
              },
            ].map(({ icon, label, value, bg }) => (
              <div
                key={label}
                className={`p-4 sm:p-5 rounded-[24px] sm:rounded-[32px] border ${bg}`}
              >
                {icon}
                <p className="text-[8px] sm:text-[9px] font-black uppercase text-gray-400 mt-2">
                  {label}
                </p>
                <h3 className="text-xs sm:text-sm font-bold uppercase mt-0.5">
                  {value}
                </h3>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[28px] sm:rounded-[40px] border border-gray-100 overflow-visible shadow-sm">
            <div className="px-4 sm:px-6 py-4 border-b bg-gray-50/50 flex justify-between items-center rounded-t-[28px] sm:rounded-t-[40px]">
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400">
                Order Items
              </h3>
              <span className="text-[9px] sm:text-[10px] font-bold bg-white px-3 py-1 rounded-full border">
                {order.orderItems?.length || 0} Products
              </span>
            </div>
            <div className="p-3 sm:p-5 space-y-3">
              {order.orderItems?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-2xl sm:rounded-3xl gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : `${API},${item.image}`
                      }
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain bg-white rounded-lg p-1 shrink-0"
                      alt=""
                    />
                    <div className="min-w-0">
                      <div className="flex items-center flex-wrap gap-1">
                        <h4 className="text-xs sm:text-sm font-bold truncate">
                          {item.name}
                        </h4>
                        
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-gray-400 font-black mt-0.5">
                        ₹{item.price} × {item.qty}
                        {item.mrp && item.mrp > item.price && (
                          <span className="ml-1 line-through text-gray-300">
                            ₹{item.mrp}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="font-black italic text-sm sm:text-base shrink-0">
                    ₹{item.price * item.qty}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="xl:w-80 2xl:w-96 space-y-4 sm:space-y-6">
          <div className="bg-[#1A1A1A] p-6 sm:p-8 rounded-[36px] sm:rounded-[48px] text-white shadow-xl">
            <p className="text-[10px] sm:text-[11px] font-black text-[#6FAF8E] uppercase mb-1 tracking-widest">
              Total Revenue
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter mb-6 sm:mb-8">
              ₹{order.totalPrice}
            </h2>
            <div className="space-y-3 sm:space-y-4 border-t border-white/10 pt-5 sm:pt-6 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-white">₹{itemsPriceSum}</span>
              </div>
              <div className="flex justify-between text-gray-500 items-center">
                <div className="flex items-center gap-1.5">
                  <Truck size={12} className="text-gray-400" />
                  <span>Delivery</span>
                </div>
                <span
                  className={
                    deliveryFee === 0 ? "text-[#6FAF8E]" : "text-white"
                  }
                >
                  {deliveryFee === 0
                    ? isPlusMember
                      ? "FREE (Plus)"
                      : "FREE"
                    : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-3 sm:p-4 rounded-2xl">
                <span className="text-[#6FAF8E]">Final Amount</span>
                <span className="text-lg sm:text-xl font-black text-[#6FAF8E]">
                  ₹{order.totalPrice}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-8 rounded-[28px] sm:rounded-[40px] border border-gray-100 shadow-sm">
            <MapPin className="text-[#6FAF8E] mb-3" size={18} />
            <p className="text-[9px] sm:text-[10px] font-black uppercase text-gray-400">
              Shipping To
            </p>
            <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed mb-3 mt-1">
              {order.shippingAddress?.address}
              <br />
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
            </p>
            <div className="flex items-center gap-2 text-[#6FAF8E] font-black text-xs">
              <Phone size={12} /> {order.shippingAddress?.phone}
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-[28px] sm:rounded-[40px] border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-500">
              <Calendar size={13} className="text-[#6FAF8E] shrink-0" />
              <span>
                Placed:{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-gray-500">
              <Clock size={13} className="text-[#6FAF8E] shrink-0" />
              <span>
                Time:{" "}
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {order.isDelivered && order.deliveredAt && (
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-green-600">
                <CheckCircle size={13} className="shrink-0" />
                <span>
                  Delivered:{" "}
                  {new Date(order.deliveredAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrderDetails;

