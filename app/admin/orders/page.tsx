"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Search, ShoppingBag } from "lucide-react";

interface Order {
  id: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    city: string;
  };
  totalAmount: number;
  status: string;
  createdAt: any;
  razorpayPaymentId: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Order[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string, customerEmail: string, customerName: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      // Send Email Notification
      try {
        const mailRes = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: customerEmail,
            subject: `Order Status Update: ${newStatus} - de Laphing co.`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #f0e6e6;">
                <div style="background-color: #741117; padding: 28px 20px; text-align: center;">
                  <img src="cid:brandlogo" alt="de Laphing co." width="170" style="display: block; margin: 0 auto 8px auto; max-width: 170px; height: auto;" />
                  <div style="color: #FFDE59; font-size: 22px; font-weight: 900; letter-spacing: 0.5px; text-transform: lowercase;">de Laphing co.</div>
                </div>
                <div style="padding: 28px 24px;">
                  <h3 style="margin-top: 0; color: #741117; font-size: 20px;">Order Status Update</h3>
                  <p style="font-size: 15px; line-height: 1.6; color: #444;">Dear ${customerName || 'Customer'},</p>
                  <p style="font-size: 15px; line-height: 1.6; color: #444;">We are writing to formally inform you that there has been an update regarding your recent order (Order ID: #${orderId.slice(0, 8)}).</p>
                  <p style="font-size: 15px; line-height: 1.6; color: #444;">Your order status has been updated to: <strong style="color: #741117; background: #FFDE59; padding: 4px 10px; border-radius: 6px; display: inline-block;">${newStatus}</strong></p>
                  <p style="font-size: 15px; line-height: 1.6; color: #444;">We are working diligently to ensure your package reaches you safely and on time. If you have any questions or concerns regarding this update, please feel free to reply directly to this email.</p>
                  <br/>
                  <p style="font-size: 14px; line-height: 1.6; color: #555; border-top: 1px solid #f0e6e6; padding-top: 16px;">
                    Warm regards,<br/>
                    <strong style="color: #741117;">de Laphing co. Delivery Team</strong>
                  </p>
                </div>
              </div>
            `,
          }),
        });
        
        const mailData = await mailRes.json();
        if (!mailRes.ok) {
          console.error("Mail API Error:", mailData);
          alert("Status updated in database, but failed to send email to customer: " + (mailData.error || "Unknown error"));
        }
      } catch (mailErr) {
        console.error("Failed to send status update email", mailErr);
        alert("Status updated, but network error prevented sending the email.");
      }
      
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update status.");
    }
  };

  const filteredOrders = orders.filter((o) => 
    o.customerDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "text-yellow-300 bg-yellow-500/20 border-yellow-500/30";
      case "Packed": return "text-blue-300 bg-blue-500/20 border-blue-500/30";
      case "Shipped": return "text-purple-300 bg-purple-500/20 border-purple-500/30";
      case "Delivered": return "text-emerald-300 bg-emerald-500/20 border-emerald-500/30";
      default: return "text-yellow-100 bg-yellow-100/10 border-yellow-100/20";
    }
  };

  return (
    <div className="animate-[fade-in-up_0.4s_ease-out_both] space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-[#62161A] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <ShoppingBag className="w-7 h-7 text-[#FFDE59]" />
            Orders
          </h1>
          <p className="text-yellow-100/70 text-sm mt-1">Manage, update, and track customer orders in real-time.</p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 text-yellow-200/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 bg-[#3D0F13] border border-[#62161A] rounded-xl pl-9 pr-4 py-2 text-sm text-yellow-50 placeholder-yellow-100/40 focus:outline-none focus:border-[#FFDE59] focus:ring-1 focus:ring-[#FFDE59] transition-all"
          />
        </div>
      </div>

      <div className="bg-[#3D0F13] border border-[#62161A] rounded-2xl overflow-hidden shadow-xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFDE59]/5 blur-[100px] pointer-events-none rounded-full" />
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#62161A] bg-[#2D0A0D]">
                <th className="py-4 px-6 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Order ID & Date</th>
                <th className="py-4 px-6 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Total</th>
                <th className="py-4 px-6 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Payment ID</th>
                <th className="py-4 px-6 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#62161A]/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FFDE59] mx-auto" />
                    <p className="text-yellow-100/60 text-xs mt-2">Loading orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-yellow-100/50">
                    No orders match your query.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#520C11]/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-white">#{order.id.slice(0, 8)}</div>
                      <div className="text-xs text-yellow-100/50 mt-0.5">
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-bold text-yellow-50">{order.customerDetails?.name || 'Customer'}</div>
                      <div className="text-xs text-yellow-100/60 mt-0.5">{order.customerDetails?.email}</div>
                      <div className="text-xs text-yellow-100/50">{order.customerDetails?.city || 'India'} • {order.customerDetails?.phone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-base font-black text-[#FFDE59]">₹{order.totalAmount}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs bg-[#240608] border border-[#62161A] text-yellow-100/80 px-2.5 py-1 rounded-md inline-block">
                        {order.razorpayPaymentId || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status || "Processing"}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value, order.customerDetails?.email, order.customerDetails?.name)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none focus:ring-2 focus:ring-[#FFDE59] transition-all cursor-pointer ${getStatusColor(order.status || "Processing")}`}
                      >
                        <option value="Processing" className="bg-[#3D0F13] text-yellow-300">Processing</option>
                        <option value="Packed" className="bg-[#3D0F13] text-blue-300">Packed</option>
                        <option value="Shipped" className="bg-[#3D0F13] text-purple-300">Shipped</option>
                        <option value="Delivered" className="bg-[#3D0F13] text-emerald-300">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
