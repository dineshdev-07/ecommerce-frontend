import axios from "axios";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCancel, setLoadingCancel] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      if (error.response?.status === 401) {
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (orders.length > 0)
        sessionStorage.setItem("userOrdersScrollPos", window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [orders]);

  useLayoutEffect(() => {
    if (orders.length > 0) {
      const savedPosition = sessionStorage.getItem("userOrdersScrollPos");
      if (savedPosition)
        setTimeout(() => window.scrollTo(0, parseInt(savedPosition)), 50);
    }
  }, [orders]);

  const cancelOrderHandler = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      setLoadingCancel((prev) => ({ ...prev, [orderId]: true }));
      await axios.put(
        `${API}/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        },
      );
      alert("Order cancelled ❌");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    } finally {
      setLoadingCancel((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await fetch(`${API}/api/orders/${orderId}/invoice`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Invoice download failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBF5] to-[#EEF8ED] p-5 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="rounded-3xl border border-[#DDEFD8] bg-[#FFF8E7] p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[#2F7D32] flex items-center justify-center shadow-lg">
              <Package className="text-white w-8 h-8" />
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-[#2F7D32]">
                My Orders
              </h1>

              <p className="text-gray-600 mt-1">
                Track every purchase you've made with FreshCart.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse bg-white rounded-3xl border border-[#DDEFD8] p-6 h-40"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#DDEFD8] p-16 text-center">
            <div className="text-6xl mb-4">📦</div>

            <h2 className="text-2xl font-bold text-gray-800">No Orders Yet</h2>

            <p className="text-gray-500 mt-2">
              Looks like you haven't placed any orders.
            </p>

            <Link
              to="/"
              className="inline-block mt-6 bg-[#2F7D32] hover:bg-[#27682A] text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-[#DDEFD8] rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top */}

                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Left */}

                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400">
                        Order ID
                      </p>

                      <Link
                        to={`/order/${order._id}`}
                        className="text-[#2F7D32] text-lg font-bold hover:underline"
                      >
                        #{order._id.slice(-8)}
                      </Link>
                    </div>

                    <div>
                      <p className="text-xs uppercase text-gray-400">
                        Products
                      </p>

                      <p className="font-medium text-gray-700 mt-1">
                        {order.orderItems
                          ?.slice(0, 2)
                          .map((item) => item.name)
                          .join(", ")}

                        {order.orderItems?.length > 2 &&
                          ` +${order.orderItems.length - 2} more`}
                      </p>
                    </div>
                  </div>

                  {/* Center */}

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs uppercase text-gray-400">
                        Order Date
                      </p>

                      <h3 className="font-semibold mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </h3>
                    </div>

                    <div>
                      <p className="text-xs uppercase text-gray-400">Total</p>

                      <h2 className="text-3xl font-black text-[#2F7D32] mt-1">
                        ₹{order.totalPrice}
                      </h2>
                    </div>
                  </div>

                  {/* Right */}

                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold

                    ${
                      order.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>

                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold

                    ${
                      order.isCancelled
                        ? "bg-red-100 text-red-600"
                        : order.isDelivered
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                    >
                      {order.isCancelled
                        ? "Cancelled"
                        : order.isDelivered
                          ? "Delivered"
                          : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Bottom */}

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to={`/order/${order._id}`}
                    className="px-5 py-3 rounded-xl bg-[#EAF8EC] text-[#2F7D32] font-semibold hover:bg-[#DDF3DF] transition"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => downloadInvoice(order._id)}
                    className="px-5 py-3 rounded-xl bg-[#2F7D32] text-white hover:bg-[#27682A] transition font-semibold"
                  >
                    Download Invoice
                  </button>

                  {!order.isDelivered && !order.isCancelled && (
                    <button
                      disabled={loadingCancel[order._id]}
                      onClick={() => cancelOrderHandler(order._id)}
                      className="px-5 py-3 rounded-xl border border-red-400 text-red-600 hover:bg-red-50 transition font-semibold disabled:opacity-50"
                    >
                      {loadingCancel[order._id]
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  )}
                </div>

                {order.isCancelled && order.isPaid && (
                  <div className="mt-6 border-t border-[#E8E8E8] pt-5">
                    {order.isRefunded ? (
                      <div className="bg-green-50 text-green-700 rounded-xl px-4 py-3 font-medium">
                        ✅ Refund completed successfully.
                      </div>
                    ) : (
                      <div className="bg-blue-50 text-blue-700 rounded-xl px-4 py-3 font-medium">
                        💰 Refund is processing (3–5 business days).
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
