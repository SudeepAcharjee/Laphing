"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, IndianRupee, ShoppingBag, TrendingUp, Loader2, Package, BarChart2 } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    ordersToday: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for charting
  const [dailySignups, setDailySignups] = useState<Record<string, number>>({});
  const [dailyOrders, setDailyOrders] = useState<Record<string, number>>({});

  useEffect(() => {
    // Listen to Users for total users count and signups chart data
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats(prev => ({ ...prev, totalUsers: snapshot.size }));
      
      const signupsMap: Record<string, number> = {};
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.createdAt && data.createdAt.toDate) {
          const dateStr = data.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          signupsMap[dateStr] = (signupsMap[dateStr] || 0) + 1;
        }
      });
      setDailySignups(signupsMap);
    });

    // Listen to Orders for revenue, total orders, today's orders, recent orders, and chart data
    const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      let revenue = 0;
      let todayCount = 0;
      const recent: any[] = [];
      const ordersMap: Record<string, number> = {};
      
      const today = new Date();
      today.setHours(0,0,0,0);

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        revenue += (data.totalAmount || 0);
        
        if (data.createdAt && data.createdAt.toDate) {
          const d = data.createdAt.toDate();
          if (d >= today) {
            todayCount++;
          }
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          ordersMap[dateStr] = (ordersMap[dateStr] || 0) + 1;
        }

        if (recent.length < 5) {
          recent.push({ id: docSnap.id, ...data });
        }
      });

      setStats(prev => ({ 
        ...prev, 
        totalRevenue: revenue, 
        totalOrders: snapshot.size,
        ordersToday: todayCount
      }));
      setDailyOrders(ordersMap);
      setRecentOrders(recent);
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeOrders();
    };
  }, []);

  // Compute chart data for the last 7 days
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      data.push({
        date: dateStr,
        Signups: dailySignups[dateStr] || 0,
        Orders: dailyOrders[dateStr] || 0
      });
    }
    return data;
  }, [dailySignups, dailyOrders]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#FFDE59]" />
        <p className="text-yellow-100/70 font-semibold tracking-wide">Crunching real-time store metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-[fade-in-up_0.4s_ease-out_both] max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#62161A] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-yellow-100/70 text-sm mt-1">Real-time performance and metrics from your Laphing store.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-yellow-100/80 uppercase tracking-widest">Live Store</span>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue */}
        <div className="bg-[#3D0F13] border border-[#62161A] rounded-2xl p-6 relative overflow-hidden group hover:border-[#FFDE59]/60 hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#FFDE59]/10 blur-[45px] pointer-events-none rounded-full group-hover:bg-[#FFDE59]/20 transition-colors" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFDE59]/15 flex items-center justify-center border border-[#FFDE59]/30 text-[#FFDE59] shadow-inner">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-yellow-100/70 text-xs font-bold uppercase tracking-wider">Total Revenue</h3>
              <p className="text-2xl lg:text-3xl font-black text-white mt-0.5 group-hover:text-[#FFDE59] transition-colors">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#3D0F13] border border-[#62161A] rounded-2xl p-6 relative overflow-hidden group hover:border-[#FFDE59]/60 hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#FFDE59]/10 blur-[45px] pointer-events-none rounded-full group-hover:bg-[#FFDE59]/20 transition-colors" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center border border-amber-500/30 text-amber-300 shadow-inner">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-yellow-100/70 text-xs font-bold uppercase tracking-wider">Total Orders</h3>
              <p className="text-2xl lg:text-3xl font-black text-white mt-0.5 group-hover:text-[#FFDE59] transition-colors">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Orders Today */}
        <div className="bg-[#3D0F13] border border-[#62161A] rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/50 hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 blur-[45px] pointer-events-none rounded-full group-hover:bg-emerald-500/20 transition-colors" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30 text-emerald-300 shadow-inner">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-yellow-100/70 text-xs font-bold uppercase tracking-wider">Orders Today</h3>
              <p className="text-2xl lg:text-3xl font-black text-white mt-0.5 group-hover:text-emerald-300 transition-colors">{stats.ordersToday}</p>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-[#3D0F13] border border-[#62161A] rounded-2xl p-6 relative overflow-hidden group hover:border-[#FFDE59]/60 hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#FFDE59]/10 blur-[45px] pointer-events-none rounded-full group-hover:bg-[#FFDE59]/20 transition-colors" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFDE59]/15 flex items-center justify-center border border-[#FFDE59]/30 text-[#FFDE59] shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-yellow-100/70 text-xs font-bold uppercase tracking-wider">Total Users</h3>
              <p className="text-2xl lg:text-3xl font-black text-white mt-0.5 group-hover:text-[#FFDE59] transition-colors">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Analytics Chart */}
        <div className="bg-[#3D0F13] border border-[#62161A] rounded-2xl p-6 shadow-xl flex flex-col w-full relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 border-b border-[#62161A] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
              <BarChart2 className="w-5 h-5 text-[#FFDE59]" />
              7-Day Performance
            </h2>
            <span className="text-xs font-semibold text-yellow-100/60">Orders vs Signups</span>
          </div>
          <div className="w-full h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#520C11" vertical={false} />
                <XAxis dataKey="date" stroke="#e0b8b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#e0b8b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: '#520C11', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#240608', borderColor: '#741B20', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#FFDE59' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }} />
                <Bar dataKey="Signups" fill="#FFDE59" radius={[6, 6, 0, 0]} maxBarSize={36} />
                <Bar dataKey="Orders" fill="#f87171" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-[#3D0F13] border border-[#62161A] rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-6 border-b border-[#62161A] flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
              <Package className="w-5 h-5 text-[#FFDE59]" />
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-sm text-[#FFDE59] hover:underline font-bold flex items-center gap-1">
              View All Orders &rarr;
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#62161A] bg-[#2D0A0D]">
                  <th className="py-4 px-6 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Order ID</th>
                  <th className="py-4 px-6 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 text-xs font-bold text-yellow-200/80 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#62161A]/50">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-yellow-100/50">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    let statusColor = "text-yellow-100 bg-yellow-100/10 border-yellow-100/20";
                    if (order.status === "Processing") statusColor = "text-yellow-300 bg-yellow-500/20 border-yellow-500/30";
                    if (order.status === "Packed") statusColor = "text-blue-300 bg-blue-500/20 border-blue-500/30";
                    if (order.status === "Shipped") statusColor = "text-purple-300 bg-purple-500/20 border-purple-500/30";
                    if (order.status === "Delivered") statusColor = "text-emerald-300 bg-emerald-500/20 border-emerald-500/30";

                    return (
                      <tr key={order.id} className="hover:bg-[#520C11]/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="text-sm font-semibold text-white">#{order.id.slice(0, 8)}</div>
                          <div className="text-xs text-yellow-100/50 mt-0.5">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-semibold text-yellow-100">{order.customerDetails?.name || 'Customer'}</div>
                          <div className="text-xs text-yellow-100/50 mt-0.5">{order.customerDetails?.city || 'India'}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-base font-extrabold text-[#FFDE59]">₹{order.totalAmount}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor}`}>
                            {order.status || 'Processing'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
