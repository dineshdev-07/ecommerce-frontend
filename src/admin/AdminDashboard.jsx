import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { jsPDF } from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faIndianRupeeSign,
  faRotateLeft,
  faArrowsRotate,
  faFilePdf,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const API = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchDashboard = useCallback(async () => {
    if (!userInfo?.isAdmin) {
      setError("Admin access required");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.get(`${API}/api/orders/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setData(res.data);
      setError("");
    } catch (err) {
      console.error("FRONTEND ERROR:", err);

      if (err.response?.status === 401) {
        setError("Admin login required");
      } else {
        setError("Failed to fetch dashboard data ❌");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userInfo?.isAdmin) {
      setLoading(false);
      return;
    }

    fetchDashboard();
  }, [fetchDashboard]);

  const normalizedData = {
    totalRevenue: data?.totalRevenue ?? 0,
    totalRefunded: data?.totalRefunded ?? 0,
    paidOrders: data?.paidOrders ?? 0,
    usersCount: data?.usersCount ?? 0,
    cancelledOrders: data?.cancelledOrders ?? 0,
    totalOrders: data?.totalOrders ?? 0,
    codOrders: data?.codOrders ?? 0,
    productsCount: data?.productsCount ?? 0,
    lowStockProducts: data?.lowStockProducts || [],
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width;
    const margin = 40;
    const brandColor = "#6FAF8E";

    doc.setFillColor(brandColor);
    doc.rect(0, 0, pageWidth, 100, "F");

    doc.setTextColor("#FFFFFF");
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("FRESHCART", margin, 55);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("ADMINISTRATION DASHBOARD REPORT", margin, 75);
    doc.text(
      `GENERATED: ${new Date().toLocaleDateString()}`,
      pageWidth - margin - 120,
      75,
    );

    let yPos = 140;
    const cardWidth = (pageWidth - margin * 2 - 20) / 2;
    const cardHeight = 65;

    const stats = [
      { label: "Net Revenue", value: `${normalizedData.totalRevenue}` },
      { label: "Refunded", value: `${normalizedData.totalRefunded}` },
      { label: "Paid Orders", value: normalizedData.paidOrders },
      { label: "Total Users", value: normalizedData.usersCount },
      { label: "Cancelled Orders", value: normalizedData.cancelledOrders },
      { label: "Total Orders", value: normalizedData.totalOrders },
      { label: "COD Orders", value: normalizedData.codOrders },
      { label: "Total Products", value: normalizedData.productsCount },
    ];

    stats.forEach((stat, index) => {
      const xPos = margin + (index % 2) * (cardWidth + 20);
      const currentRow = Math.floor(index / 2);
      const currentY = yPos + currentRow * (cardHeight + 15);

      // Light background for cards
      doc.setFillColor("#F8FAFC");
      doc.roundedRect(xPos, currentY, cardWidth, cardHeight, 6, 6, "F");

      // Card Accent (Small vertical bar on the left)
      doc.setFillColor(brandColor);
      doc.rect(xPos, currentY + 15, 3, 35, "F");

      // Label text
      doc.setFontSize(9);
      doc.setTextColor("#64748B");
      doc.setFont("helvetica", "bold");
      doc.text(stat.label.toUpperCase(), xPos + 15, currentY + 22);

      // Value text
      doc.setFontSize(16);
      doc.setTextColor("#1E293B");
      doc.text(`${stat.value}`, xPos + 15, currentY + 48);
    });

    yPos += Math.ceil(stats.length / 2) * (cardHeight + 15) + 40;

    // 3. LOW STOCK SECTION
    doc.setFontSize(16);
    doc.setTextColor(brandColor);
    doc.setFont("helvetica", "bold");
    doc.text("Inventory Alerts", margin, yPos);

    doc.setDrawColor(brandColor);
    doc.setLineWidth(1.5);
    doc.line(margin, yPos + 5, margin + 110, yPos + 5);

    yPos += 35;

    if (normalizedData.lowStockProducts.length === 0) {
      doc.setFontSize(11);
      doc.setTextColor("#64748B");
      doc.setFont("helvetica", "normal");
      doc.text("All inventory levels are currently healthy.", margin, yPos);
    } else {
      // Table Header
      doc.setFontSize(10);
      doc.setTextColor("#94A3B8");
      doc.text("PRODUCT NAME", margin, yPos);
      doc.text("REMAINING STOCK", pageWidth - margin - 100, yPos);

      yPos += 10;
      doc.setDrawColor("#E2E8F0");
      doc.setLineWidth(0.5);
      doc.line(margin, yPos, pageWidth - margin, yPos);

      yPos += 20;

      normalizedData.lowStockProducts.forEach((p) => {
        // Page break check
        if (yPos > 780) {
          doc.addPage();
          yPos = 50;
        }

        doc.setTextColor("#334155");
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(p.name, margin, yPos);

        doc.setTextColor("#EF4444"); // Red for alerts
        doc.setFont("helvetica", "bold");
        doc.text(`${p.quantity} Units`, pageWidth - margin - 100, yPos);

        yPos += 20;
        // Subtle row line
        doc.setDrawColor("#F1F5F9");
        doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5);
      });
    }

    // 4. FOOTER
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor("#94A3B8");
      doc.text(
        `FreshCart Business Report - Page ${i} of ${pageCount}`,
        pageWidth / 2,
        820,
        { align: "center" },
      );
    }

    doc.save(`FreshCart_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleResetMonthly = async () => {
    if (!window.confirm("Reset all monthly stats?")) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      };

      await axios.put(
        `${API}/api/orders/reset-monthly-data`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        },
      );

      alert("Monthly stats reset successfully ✅");
      fetchDashboard();
    } catch (err) {
      console.error(err);
      alert("Reset failed ❌");
    }
  };

 if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBEA]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600 text-lg font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}

  if (error)
    return (
      <div className="flex h-screen  items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <h2 className="text-xl text-red-500 font-semibold">{error}</h2>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FFFBEA] p-5 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-[#2E7D32]">Admin Dashboard</h1>

          <p className="text-gray-500 mt-2">
            Welcome back! Here's today's business summary.
          </p>
        </div>

        {/* Main Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Revenue"
            value={`₹${normalizedData.totalRevenue}`}
            icon={<FontAwesomeIcon icon={faIndianRupeeSign} />}
          />

          <StatCard
            title="Orders"
            value={normalizedData.totalOrders}
            icon={<FontAwesomeIcon icon={faBoxOpen} />}
          />

          <StatCard
            title="Customers"
            value={normalizedData.usersCount}
            icon={<FontAwesomeIcon icon={faUsers} />}
          />

          <StatCard
            title="Products"
            value={normalizedData.productsCount}
            icon={<FontAwesomeIcon icon={faBoxOpen} />}
          />
        </div>

        {/* Business Summary */}

        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Business Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MiniCard title="Paid Orders" value={normalizedData.paidOrders} />

            <MiniCard
              title="Refunded"
              value={`₹${normalizedData.totalRefunded}`}
            />

            <MiniCard
              title="Cancelled"
              value={normalizedData.cancelledOrders}
            />

            <MiniCard title="COD Orders" value={normalizedData.codOrders} />
          </div>
        </div>

        {/* Low Stock */}

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex justify-between items-center p-5 border-b">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Low Stock Products
              </h2>

              <p className="text-sm text-gray-500">
                Products that need restocking
              </p>
            </div>

            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              {normalizedData.lowStockProducts.length} Items
            </span>
          </div>

          {normalizedData.lowStockProducts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Inventory looks good 🎉
            </div>
          ) : (
            <div className="divide-y">
              {normalizedData.lowStockProducts.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-5 hover:bg-green-50 transition"
                >
                  <div>
                    <h3 className="font-semibold text-gray-700">{item.name}</h3>

                    <p className="text-sm text-gray-500">
                      Product needs restocking
                    </p>
                  </div>

                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                    {item.quantity} Left
                  </span>
                </div>
              ))}
            </div>
          )}
          {/* Dashboard Actions */}

          <div className="bg-white border border-gray-200 rounded-xl p-6 mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Dashboard Actions
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleExportPDF}
                className="flex-1 bg-[#2E7D32] hover:bg-[#256428] text-white py-3 rounded-lg font-medium transition"
              >
                <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                Export PDF Report
              </button>

              <button
                onClick={handleResetMonthly}
                className="flex-1 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white py-3 rounded-lg font-medium transition"
              >
                <FontAwesomeIcon icon={faArrowsRotate} className="mr-2" />
                Reset Monthly Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#2E7D32] transition">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{title}</p>

        <div className="text-[#2E7D32] text-xl">{icon}</div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
    </div>
  );
};

const MiniCard = ({ title, value }) => {
  return (
    <div className="bg-[#F8F8F8] border border-gray-200 rounded-xl p-4 text-center">
      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="text-2xl font-bold text-[#2E7D32] mt-2">{value}</h3>
    </div>
  );
};

export default AdminDashboard;
