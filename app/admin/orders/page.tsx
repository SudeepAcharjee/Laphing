"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Loader2, 
  Search, 
  ShoppingBag, 
  MapPin, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  ExternalLink, 
  Download, 
  Eye, 
  X,
  PackageCheck,
  AlertCircle,
  Truck
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

interface Order {
  id: string;
  userId?: string;
  customerDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  items?: OrderItem[];
  quantity?: number;
  productName?: string;
  unitPrice?: number;
  basePrice?: number;
  discountPercent?: number;
  discountApplied?: number;
  totalAmount: number;
  status: string;
  createdAt: any;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  isOutsideDelhi?: boolean;
  isDelhiOrder?: boolean;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Order[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (
    orderId: string, 
    newStatus: string, 
    customerEmail?: string, 
    customerName?: string
  ) => {
    setIsUpdatingStatus(orderId);
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      // Update in selected order modal if open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      // Send Email Notification
      if (customerEmail) {
        try {
          const mailRes = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: customerEmail,
              type: "order_status",
              orderId,
              name: customerName || "Laphing Customer",
              newStatus,
            }),
          });
          
          const mailData = await mailRes.json();
          if (!mailRes.ok) {
            console.error("Mail API Error:", mailData);
          }
        } catch (mailErr) {
          console.error("Failed to send status update email", mailErr);
        }
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update status.");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const getFullAddressText = (order: Order) => {
    const cd = order.customerDetails || {};
    const street = cd.address || order.address || "";
    const city = cd.city || order.city || "";
    const state = cd.state || order.state || "";
    const pincode = cd.pincode || order.pincode || "";

    const parts: string[] = [];
    if (street) parts.push(street);
    const locationLine = [city, state].filter(Boolean).join(", ");
    if (locationLine && pincode) {
      parts.push(`${locationLine} - ${pincode}`);
    } else if (locationLine) {
      parts.push(locationLine);
    } else if (pincode) {
      parts.push(`PIN: ${pincode}`);
    }
    return parts.join("\n") || "No address provided";
  };

  const getShippingLabel = (order: Order) => {
    const cd = order.customerDetails || {};
    const name = cd.name || "Customer";
    const phone = cd.phone || order.phone || "N/A";
    const email = cd.email || "N/A";
    const address = getFullAddressText(order);
    return `NAME: ${name}\nPHONE: ${phone}\nEMAIL: ${email}\nADDRESS:\n${address}`;
  };

  const copyToClipboard = (text: string, orderId: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(orderId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      alert("No orders to export.");
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Email",
      "Phone",
      "Street Address",
      "City",
      "State",
      "Pincode",
      "Total Amount (INR)",
      "Payment ID",
      "Status",
      "Region",
    ];

    const rows = orders.map((o) => {
      const cd = o.customerDetails || {};
      const dateStr = o.createdAt?.toDate 
        ? o.createdAt.toDate().toISOString()
        : "";
      return [
        `"${o.id}"`,
        `"${dateStr}"`,
        `"${(cd.name || "").replace(/"/g, '""')}"`,
        `"${(cd.email || "").replace(/"/g, '""')}"`,
        `"${(cd.phone || o.phone || "").replace(/"/g, '""')}"`,
        `"${(cd.address || o.address || "").replace(/"/g, '""')}"`,
        `"${(cd.city || o.city || "").replace(/"/g, '""')}"`,
        `"${(cd.state || o.state || "").replace(/"/g, '""')}"`,
        `"${(cd.pincode || o.pincode || "").replace(/"/g, '""')}"`,
        o.totalAmount || 0,
        `"${(o.razorpayPaymentId || "").replace(/"/g, '""')}"`,
        `"${(o.status || "Processing").replace(/"/g, '""')}"`,
        `"${o.isOutsideDelhi ? "Outside Delhi Request" : "Delhi"}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laphing_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((o) => {
    const cd = o.customerDetails || {};
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      o.id.toLowerCase().includes(search) ||
      (cd.name && cd.name.toLowerCase().includes(search)) ||
      (cd.email && cd.email.toLowerCase().includes(search)) ||
      (cd.phone && cd.phone.toLowerCase().includes(search)) ||
      (cd.address && cd.address.toLowerCase().includes(search)) ||
      (cd.city && cd.city.toLowerCase().includes(search)) ||
      (cd.state && cd.state.toLowerCase().includes(search)) ||
      (cd.pincode && cd.pincode.toLowerCase().includes(search)) ||
      (o.address && o.address.toLowerCase().includes(search)) ||
      (o.razorpayPaymentId && o.razorpayPaymentId.toLowerCase().includes(search));

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "outside_delhi") return matchesSearch && o.isOutsideDelhi;
    return matchesSearch && (o.status || "Processing") === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "text-yellow-300 bg-yellow-500/20 border-yellow-500/40";
      case "Packed": return "text-blue-300 bg-blue-500/20 border-blue-500/40";
      case "Shipped": return "text-purple-300 bg-purple-500/20 border-purple-500/40";
      case "Delivered": return "text-emerald-300 bg-emerald-500/20 border-emerald-500/40";
      case "Order Request (Outside Delhi)": return "text-amber-300 bg-amber-500/20 border-amber-500/40";
      default: return "text-yellow-100 bg-yellow-100/10 border-yellow-100/20";
    }
  };

  return (
    <div className="animate-[fade-in-up_0.4s_ease-out_both] space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between border-b border-[#62161A] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <ShoppingBag className="w-7 h-7 text-[#FFDE59]" />
            Orders Management
          </h1>
          <p className="text-yellow-100/70 text-sm mt-1">
            Complete fulfillment overview with customer addresses, contact details, and payment verification.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-yellow-200/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, address, PIN, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#3D0F13] border border-[#62161A] rounded-xl pl-9 pr-4 py-2 text-sm text-yellow-50 placeholder-yellow-100/40 focus:outline-none focus:border-[#FFDE59] focus:ring-1 focus:ring-[#FFDE59] transition-all"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#3D0F13] border border-[#62161A] rounded-xl px-3 py-2 text-xs font-semibold text-yellow-100 focus:outline-none focus:border-[#FFDE59]"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="Processing">Processing</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="outside_delhi">Outside Delhi Requests</option>
          </select>

          {/* Export CSV button */}
          <button
            onClick={exportOrdersCSV}
            type="button"
            className="inline-flex items-center gap-2 bg-[#2D0A0D] hover:bg-[#3D0F13] text-yellow-200 border border-[#62161A] rounded-xl px-3.5 py-2 text-xs font-bold transition-colors hover:border-[#FFDE59]"
            title="Download CSV for courier label printing"
          >
            <Download className="w-3.5 h-3.5 text-[#FFDE59]" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Counter Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#3D0F13]/80 border border-[#62161A] rounded-xl p-3.5">
          <p className="text-xs text-yellow-100/60 font-medium">Total Orders</p>
          <p className="text-xl font-black text-white mt-0.5">{orders.length}</p>
        </div>
        <div className="bg-[#3D0F13]/80 border border-[#62161A] rounded-xl p-3.5">
          <p className="text-xs text-yellow-100/60 font-medium">Processing</p>
          <p className="text-xl font-black text-yellow-300 mt-0.5">
            {orders.filter((o) => (o.status || "Processing") === "Processing").length}
          </p>
        </div>
        <div className="bg-[#3D0F13]/80 border border-[#62161A] rounded-xl p-3.5">
          <p className="text-xs text-yellow-100/60 font-medium">Delhi (Ready)</p>
          <p className="text-xl font-black text-emerald-300 mt-0.5">
            {orders.filter((o) => !o.isOutsideDelhi).length}
          </p>
        </div>
        <div className="bg-[#3D0F13]/80 border border-[#62161A] rounded-xl p-3.5">
          <p className="text-xs text-yellow-100/60 font-medium">Outside Delhi Requests</p>
          <p className="text-xl font-black text-amber-300 mt-0.5">
            {orders.filter((o) => o.isOutsideDelhi).length}
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#3D0F13] border border-[#62161A] rounded-2xl overflow-hidden shadow-xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFDE59]/5 blur-[100px] pointer-events-none rounded-full" />
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#62161A] bg-[#2D0A0D]">
                <th className="py-4 px-5 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Order ID & Date</th>
                <th className="py-4 px-5 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-5 text-xs font-bold text-yellow-200/80 uppercase tracking-wider min-w-[280px]">Complete Delivery Address</th>
                <th className="py-4 px-5 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Total</th>
                <th className="py-4 px-5 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Payment ID</th>
                <th className="py-4 px-5 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Status</th>
                <th className="py-4 px-5 text-xs font-bold text-yellow-200/80 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#62161A]/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FFDE59] mx-auto" />
                    <p className="text-yellow-100/60 text-xs mt-2">Loading orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-yellow-100/50">
                    No orders match your query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const cd = order.customerDetails || {};
                  const streetAddress = cd.address || order.address || "";
                  const city = cd.city || order.city || "";
                  const state = cd.state || order.state || "";
                  const pincode = cd.pincode || order.pincode || "";
                  const phone = cd.phone || order.phone || "";
                  const hasCompleteAddress = Boolean(streetAddress || city || state || pincode);

                  return (
                    <tr key={order.id} className="hover:bg-[#520C11]/40 transition-colors group">
                      {/* Order ID & Date */}
                      <td className="py-4 px-5 align-top">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-white bg-[#240608] px-2 py-0.5 rounded border border-[#62161A]">
                            #{order.id.slice(0, 8)}
                          </span>
                        </div>
                        <div className="text-xs text-yellow-100/50 mt-1.5">
                          {order.createdAt?.toDate 
                            ? order.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                            : 'Just now'}
                        </div>
                        <div className="text-[11px] text-yellow-100/40">
                          {order.createdAt?.toDate 
                            ? order.createdAt.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
                            : ''}
                        </div>
                      </td>

                      {/* Customer Contact */}
                      <td className="py-4 px-5 align-top min-w-[180px]">
                        <div className="text-sm font-bold text-yellow-50">{cd.name || 'Customer'}</div>
                        <div className="text-xs text-yellow-100/70 mt-1 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-yellow-200/50 shrink-0" />
                          <span className="truncate max-w-[170px]" title={cd.email}>{cd.email || 'No email'}</span>
                        </div>
                        {phone && (
                          <div className="text-xs text-yellow-100/90 mt-1 flex items-center gap-1.5 font-mono">
                            <Phone className="w-3 h-3 text-yellow-200/50 shrink-0" />
                            <a href={`tel:${phone}`} className="hover:text-[#FFDE59] hover:underline">
                              {phone}
                            </a>
                          </div>
                        )}
                      </td>

                      {/* COMPLETE DELIVERY ADDRESS */}
                      <td className="py-4 px-5 align-top min-w-[280px] max-w-[340px]">
                        <div className="bg-[#240608]/80 border border-[#62161A] rounded-xl p-3 text-xs space-y-2 shadow-inner group-hover:border-[#FFDE59]/40 transition-colors">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-yellow-200 font-bold">
                              <MapPin className="w-3.5 h-3.5 text-[#FFDE59] shrink-0" />
                              <span className="truncate">
                                {[city, state].filter(Boolean).join(", ") || "India"}
                              </span>
                            </div>

                            <button
                              onClick={() => copyToClipboard(getShippingLabel(order), order.id)}
                              type="button"
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-yellow-200/70 hover:text-[#FFDE59] bg-[#3D0F13] px-2 py-0.5 rounded border border-[#62161A] hover:border-[#FFDE59]/50 transition-all shrink-0 cursor-pointer"
                              title="Copy full shipping label to clipboard"
                            >
                              {copiedId === order.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Street Address */}
                          <div className="text-yellow-100/90 text-xs leading-relaxed break-words bg-[#1a0405] p-2 rounded-lg border border-[#62161A]/40 font-normal">
                            {streetAddress || (
                              <span className="text-yellow-100/40 italic">
                                No house/street address recorded
                              </span>
                            )}
                          </div>

                          {/* Footer details: PIN code & region badge */}
                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#62161A]/60">
                            <span className="text-yellow-100/70">
                              PIN: <strong className="text-white font-mono">{pincode || "N/A"}</strong>
                            </span>
                            {order.isOutsideDelhi ? (
                              <span className="text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                Outside Delhi Request
                              </span>
                            ) : (
                              <span className="text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                Delhi (Direct)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Total Amount & Items */}
                      <td className="py-4 px-5 align-top">
                        <div className="text-base font-black text-[#FFDE59]">₹{order.totalAmount}</div>
                        <div className="text-xs text-yellow-100/60 mt-0.5">
                          {order.quantity 
                            ? `${order.quantity} pack(s)` 
                            : (order.items && order.items.length > 0 
                              ? `${order.items.reduce((acc, it) => acc + (it.quantity || 1), 0)} pack(s)` 
                              : "1 pack")}
                        </div>
                        {order.discountApplied && order.discountApplied > 0 ? (
                          <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                            -₹{order.discountApplied} off
                          </div>
                        ) : null}
                      </td>

                      {/* Payment ID */}
                      <td className="py-4 px-5 align-top">
                        {order.isOutsideDelhi ? (
                          <span className="text-[11px] font-bold text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md inline-block">
                            Pre-order Request
                          </span>
                        ) : (
                          <span className="font-mono text-xs bg-[#240608] border border-[#62161A] text-yellow-100/90 px-2.5 py-1 rounded-md inline-block max-w-[140px] truncate" title={order.razorpayPaymentId}>
                            {order.razorpayPaymentId || 'N/A'}
                          </span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-5 align-top">
                        <div className="relative">
                          <select
                            disabled={isUpdatingStatus === order.id}
                            value={order.status || "Processing"}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value, cd.email, cd.name)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none focus:ring-2 focus:ring-[#FFDE59] transition-all cursor-pointer ${getStatusColor(order.status || "Processing")}`}
                          >
                            <option value="Processing" className="bg-[#3D0F13] text-yellow-300">Processing</option>
                            <option value="Packed" className="bg-[#3D0F13] text-blue-300">Packed</option>
                            <option value="Shipped" className="bg-[#3D0F13] text-purple-300">Shipped</option>
                            <option value="Delivered" className="bg-[#3D0F13] text-emerald-300">Delivered</option>
                            <option value="Order Request (Outside Delhi)" className="bg-[#3D0F13] text-amber-300">Order Request (Outside Delhi)</option>
                          </select>
                          {isUpdatingStatus === order.id && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFDE59] absolute -top-1 -right-1" />
                          )}
                        </div>
                      </td>

                      {/* Action Button: View Modal */}
                      <td className="py-4 px-5 align-top text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          type="button"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-200 hover:text-white bg-[#240608] hover:bg-[#62161A] border border-[#62161A] rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#FFDE59]" />
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL ORDER & ADDRESS DETAILS MODAL */}
      {selectedOrder && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-[fade-in_0.2s_ease-out]"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-[#2D0A0D] border-2 border-[#62161A] rounded-2xl max-w-2xl w-full p-6 text-yellow-50 relative shadow-2xl space-y-6 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#62161A] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold bg-[#3D0F13] text-[#FFDE59] px-2.5 py-1 rounded-md border border-[#62161A]">
                    Order #{selectedOrder.id}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(selectedOrder.status || "Processing")}`}>
                    {selectedOrder.status || "Processing"}
                  </span>
                </div>
                <p className="text-xs text-yellow-100/60 mt-1.5">
                  Placed on {selectedOrder.createdAt?.toDate 
                    ? selectedOrder.createdAt.toDate().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) 
                    : 'Recent'}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-yellow-100/60 hover:text-white p-1 hover:bg-[#3D0F13] rounded-lg transition-colors"
                title="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Delivery Address Card */}
              <div className="bg-[#3D0F13] border border-[#62161A] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FFDE59]" />
                    Delivery Address
                  </h3>
                  <button
                    onClick={() => copyToClipboard(getShippingLabel(selectedOrder), `modal-${selectedOrder.id}`)}
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFDE59] hover:text-white bg-[#240608] px-2.5 py-1 rounded-md border border-[#62161A] transition-colors"
                  >
                    {copiedId === `modal-${selectedOrder.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Label</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-[#240608] border border-[#62161A]/80 rounded-lg p-3 text-xs space-y-2">
                  <div>
                    <span className="text-yellow-100/50 block text-[10px] uppercase font-bold tracking-wider">House / Street Address</span>
                    <p className="text-yellow-50 text-sm font-medium mt-0.5 break-words">
                      {selectedOrder.customerDetails?.address || selectedOrder.address || "No street address provided"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#62161A]/50">
                    <div>
                      <span className="text-yellow-100/50 block text-[10px] uppercase font-bold tracking-wider">City</span>
                      <p className="text-yellow-100 font-semibold">
                        {selectedOrder.customerDetails?.city || selectedOrder.city || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-yellow-100/50 block text-[10px] uppercase font-bold tracking-wider">State</span>
                      <p className="text-yellow-100 font-semibold">
                        {selectedOrder.customerDetails?.state || selectedOrder.state || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#62161A]/50">
                    <div>
                      <span className="text-yellow-100/50 block text-[10px] uppercase font-bold tracking-wider">PIN Code</span>
                      <p className="text-white font-mono font-bold text-sm">
                        {selectedOrder.customerDetails?.pincode || selectedOrder.pincode || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-yellow-100/50 block text-[10px] uppercase font-bold tracking-wider">Delivery Region</span>
                      <p className="font-semibold text-xs mt-0.5">
                        {selectedOrder.isOutsideDelhi ? (
                          <span className="text-amber-300">Outside Delhi</span>
                        ) : (
                          <span className="text-emerald-300">Delhi (Express)</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Contact Card */}
                <div className="pt-2 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-100/60">Recipient:</span>
                    <span className="font-bold text-white">{selectedOrder.customerDetails?.name || "Customer"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-100/60">Phone:</span>
                    <a 
                      href={`tel:${selectedOrder.customerDetails?.phone || selectedOrder.phone}`}
                      className="font-mono text-[#FFDE59] hover:underline"
                    >
                      {selectedOrder.customerDetails?.phone || selectedOrder.phone || "N/A"}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-100/60">Email:</span>
                    <span className="text-yellow-100 font-medium truncate max-w-[160px]" title={selectedOrder.customerDetails?.email}>
                      {selectedOrder.customerDetails?.email || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items & Payment Info */}
              <div className="space-y-4">
                {/* Items & Payment Card */}
                <div className="bg-[#3D0F13] border border-[#62161A] rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-[#FFDE59]" />
                    Order Summary
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-yellow-100">
                      <span>Instant Laphing Meal Kit</span>
                      <span className="font-bold text-white">
                        {selectedOrder.quantity || (selectedOrder.items && selectedOrder.items[0]?.quantity) || 1} Pack(s)
                      </span>
                    </div>

                    {selectedOrder.discountApplied && selectedOrder.discountApplied > 0 ? (
                      <div className="flex justify-between items-center text-emerald-400">
                        <span>Discount Applied:</span>
                        <span>-₹{selectedOrder.discountApplied}</span>
                      </div>
                    ) : null}

                    <div className="flex justify-between items-center text-sm font-extrabold text-[#FFDE59] pt-2 border-t border-[#62161A]">
                      <span>Total Paid:</span>
                      <span>₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-[#240608] border border-[#62161A]/70 rounded-lg p-2.5 text-xs space-y-1 mt-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-yellow-100/60">Payment ID:</span>
                      <span className="font-mono text-yellow-100 font-medium">
                        {selectedOrder.razorpayPaymentId || "N/A"}
                      </span>
                    </div>
                    {selectedOrder.razorpayOrderId && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-yellow-100/60">Razorpay Order:</span>
                        <span className="font-mono text-yellow-100/80">
                          {selectedOrder.razorpayOrderId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Change Status Card */}
                <div className="bg-[#3D0F13] border border-[#62161A] rounded-xl p-4 space-y-2">
                  <label className="text-xs font-bold text-yellow-100 block">
                    Update Order Status
                  </label>
                  <p className="text-[11px] text-yellow-100/60">
                    Changing status immediately sends a branded email update to the customer.
                  </p>
                  <select
                    value={selectedOrder.status || "Processing"}
                    onChange={(e) => updateOrderStatus(
                      selectedOrder.id, 
                      e.target.value, 
                      selectedOrder.customerDetails?.email, 
                      selectedOrder.customerDetails?.name
                    )}
                    className={`w-full text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#FFDE59] cursor-pointer ${getStatusColor(selectedOrder.status || "Processing")}`}
                  >
                    <option value="Processing" className="bg-[#3D0F13] text-yellow-300">Processing</option>
                    <option value="Packed" className="bg-[#3D0F13] text-blue-300">Packed</option>
                    <option value="Shipped" className="bg-[#3D0F13] text-purple-300">Shipped</option>
                    <option value="Delivered" className="bg-[#3D0F13] text-emerald-300">Delivered</option>
                    <option value="Order Request (Outside Delhi)" className="bg-[#3D0F13] text-amber-300">Order Request (Outside Delhi)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-3 border-t border-[#62161A]">
              <button
                onClick={() => setSelectedOrder(null)}
                type="button"
                className="bg-[#3D0F13] hover:bg-[#520C11] text-yellow-100 px-5 py-2 rounded-xl text-xs font-bold border border-[#62161A] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
