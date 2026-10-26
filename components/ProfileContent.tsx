"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  Copy,
  LogOut,
  Loader2,
  Check,
  User,
  Phone,
  Mail,
  MapPin,
  CheckSquare,
  Package,
  Edit2,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfileContent() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const router = useRouter();

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/?auth=login");
      } else {
        setUser(currentUser);
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData(data);
            setEditForm({
              name: data.name || "",
              phone: data.phone || "",
              address: data.address || "",
            });
          } else {
            // Fallback profile if doc doesn't exist
            const fallbackData = {
              name: currentUser.displayName || currentUser.email?.split("@")[0] || "Friend",
              email: currentUser.email,
              phone: "",
              address: "",
              referralCode: "laphing-vip",
              referralsCount: 0,
              discountAvailable: 20,
            };
            setUserData(fallbackData);
            setEditForm({
              name: fallbackData.name,
              phone: "",
              address: "",
            });
          }

          // Fetch User Orders
          try {
            const ordersQ = query(
              collection(db, "orders"),
              where("userId", "==", currentUser.uid)
            );
            const ordersSnap = await getDocs(ordersQ);
            const ordersData: any[] = [];
            ordersSnap.forEach((docSnap) => {
              ordersData.push({ id: docSnap.id, ...docSnap.data() });
            });

            ordersData.sort((a, b) => {
              const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
              const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
              return timeB - timeA;
            });
            setUserOrders(ordersData);
          } catch (err) {
            console.error("Failed to fetch orders", err);
          }
        } catch (err) {
          console.error("Failed to fetch user data", err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const copyReferralLink = () => {
    if (userData?.referralCode) {
      const link = `${window.location.origin}?ref=${userData.referralCode}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address,
      });

      setUserData({ ...userData, ...editForm });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Processing":
        return "text-[#FFDE59] bg-[#FFDE59]/15 border-[#FFDE59]/30";
      case "Packed":
        return "text-amber-300 bg-amber-400/15 border-amber-400/30";
      case "Shipped":
        return "text-sky-300 bg-sky-400/15 border-sky-400/30";
      case "Delivered":
        return "text-emerald-300 bg-emerald-400/15 border-emerald-400/30";
      default:
        return "text-white/80 bg-white/10 border-white/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFDE59] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#741117]" />
      </div>
    );
  }

  if (!user || !userData) return null;

  const userInitial = (userData.name?.trim()?.[0] || user.email?.[0] || "L").toUpperCase();
  const discountAvailable = userData.discountAvailable || 20;

  return (
    <div className="min-h-screen w-full bg-[#FFDE59] text-[#741117] flex flex-col justify-between select-none">
      
      {/* Brand Navbar */}
      <Navbar />

      {/* Main Full-Width Content Container on Yellow Background */}
      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 flex-1 space-y-8 sm:space-y-10">
        
        {/* ================= PROFILE DETAILS CARD ================= */}
        <section className="relative w-full bg-[#741117] text-white border-2 border-[#540B10] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
          
          {/* Subtle Warm Yellow Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFDE59]/10 rounded-full blur-[110px] pointer-events-none" />

          {/* Top Actions: Member Badge / Edit / Sign Out */}
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/15">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFDE59] animate-pulse" />
              <span className="font-inter font-bold text-[#FFDE59] text-[13px] sm:text-[14px] uppercase tracking-wider">
                My Profile
              </span>
            </div>

            <div className="flex items-center gap-3">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 bg-[#FFDE59] hover:bg-[#FFE58A] text-[#741117] px-4 py-1.5 rounded-full font-inter font-bold text-[13px] transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-white/80 hover:text-white px-3 py-1.5 rounded-full font-inter font-medium text-[13px] hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Save Feedback Banner */}
          {saveSuccess && (
            <div className="mt-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
              <CheckSquare className="w-4 h-4 shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Profile Details or Edit Form */}
          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4 max-w-xl">
              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#FFDE59] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-[#520C11] border border-[#FFDE59]/30 rounded-xl py-2.5 px-3.5 text-[15px] text-white placeholder-white/40 focus:outline-none focus:border-[#FFDE59] transition-all"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#FFDE59] block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="+91 (pre-order delivery updates)"
                  className="w-full bg-[#520C11] border border-[#FFDE59]/30 rounded-xl py-2.5 px-3.5 text-[15px] text-white placeholder-white/40 focus:outline-none focus:border-[#FFDE59] transition-all"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#FFDE59] block mb-1">
                  Delivery Address
                </label>
                <textarea
                  rows={2}
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="Street, City, Pincode"
                  className="w-full bg-[#520C11] border border-[#FFDE59]/30 rounded-xl py-2.5 px-3.5 text-[15px] text-white placeholder-white/40 focus:outline-none focus:border-[#FFDE59] resize-none transition-all"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#FFDE59] hover:bg-[#FFE58A] text-[#741117] font-inter font-black text-sm uppercase px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white/10 hover:bg-white/15 text-white font-inter font-semibold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* User Avatar + Identity */}
              <div className="flex items-center gap-5 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FFDE59] text-[#741117] flex items-center justify-center font-inter font-black text-3xl sm:text-4xl shadow-lg border-2 border-white/20 shrink-0">
                  {userInitial}
                </div>

                <div className="space-y-1.5">
                  <h1 className="font-inter font-black text-white text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight">
                    {userData.name || "Laphing Lover"}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/80 text-[13px] sm:text-[14px] font-medium">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#FFDE59]" />
                      {userData.email}
                    </span>
                    {userData.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#FFDE59]" />
                        {userData.phone}
                      </span>
                    )}
                  </div>

                  {userData.address && (
                    <div className="flex items-center gap-1.5 text-white/70 text-[12px] sm:text-[13px] pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FFDE59] shrink-0" />
                      <span className="truncate max-w-[320px] sm:max-w-md">{userData.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Perks: Discount Badge & Referral Code */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                
                {/* Discount Badge */}
                <div className="bg-[#520C11] border border-[#FFDE59]/30 rounded-2xl p-4 flex flex-col justify-center min-w-[130px] text-center shadow-inner">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                    Your Discount
                  </span>
                  <span className="font-inter font-black text-[#FFDE59] text-2xl sm:text-3xl leading-none mt-1">
                    {discountAvailable}% OFF
                  </span>
                </div>

                {/* Referral Code Copy Pill */}
                {userData.referralCode && (
                  <div className="bg-[#520C11] border border-[#FFDE59]/30 rounded-2xl p-4 flex flex-col justify-center min-w-[160px] shadow-inner">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                      Referral Code
                    </span>
                    <button
                      onClick={copyReferralLink}
                      type="button"
                      className="inline-flex items-center justify-between gap-2 text-[#741117] bg-[#FFDE59] hover:bg-[#FFE58A] px-3 py-1.5 rounded-lg font-mono text-[13px] font-black transition-all active:scale-95 cursor-pointer shadow-sm"
                      title="Click to copy your referral link"
                    >
                      <span>{userData.referralCode}</span>
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}

        </section>

        {/* ================= ORDER HISTORY (PROMINENTLY RIGHT ABOVE!) ================= */}
        <section className="w-full space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#741117] text-[#FFDE59] flex items-center justify-center shadow-md">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-inter font-black text-[#741117] text-2xl sm:text-3xl uppercase tracking-tight">
                  Your Order History
                </h2>
                <p className="text-[#741117]/80 text-[13px] sm:text-[14px] font-medium">
                  Track past pre-orders, delivery statuses, and applied savings.
                </p>
              </div>
            </div>

            <Link
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 bg-[#741117] hover:bg-[#5C0C11] text-[#FFDE59] font-inter font-black text-[13px] sm:text-[14px] uppercase tracking-wider px-6 py-2.5 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Pack Now</span>
            </Link>
          </div>

          {/* Orders List or Empty State */}
          {userOrders.length > 0 ? (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="w-full bg-[#741117] text-white border-2 border-[#540B10] hover:border-[#FFDE59]/60 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[12px] text-[#FFDE59] bg-[#520C11] border border-[#FFDE59]/20 px-2.5 py-1 rounded-md font-bold">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-white/70 text-[13px]">
                        {order.createdAt?.toDate
                          ? order.createdAt.toDate().toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recently"}
                      </span>
                    </div>

                    <div className="font-inter font-bold text-white text-lg sm:text-xl flex items-center gap-3">
                      <span>Total Paid: ₹{order.totalAmount}</span>
                      {order.discountApplied > 0 && (
                        <span className="text-[12px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                          Saved ₹{order.discountApplied}
                        </span>
                      )}
                    </div>

                    {order.customerDetails?.address && (
                      <p className="text-white/70 text-[13px] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#FFDE59] shrink-0" />
                        <span className="truncate">
                          {order.customerDetails.address}, {order.customerDetails.city || ""}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[12px] font-inter font-black uppercase tracking-wider border shadow-sm ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Friendly Branded Empty State */
            <div className="w-full bg-[#741117] text-white border-2 border-[#540B10] rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-[#FFDE59]/15 border border-[#FFDE59]/30 flex items-center justify-center text-[#FFDE59]">
                <Package className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 max-w-md">
                <h3 className="font-inter font-black text-white text-xl sm:text-2xl uppercase tracking-tight">
                  No Pre-Orders Yet
                </h3>
                <p className="text-white/80 text-[14px] leading-relaxed">
                  Your spicy Laphing pack is waiting! Pre-order now to lock in your {discountAvailable}% discount.
                </p>
              </div>

              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 bg-[#FFDE59] hover:bg-[#FFE58A] text-[#741117] font-inter font-black text-[14px] uppercase tracking-wider px-7 py-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <span>Order Signature Pack</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </section>

      </main>

      {/* Brand Footer */}
      <Footer />

    </div>
  );
}
