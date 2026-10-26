"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, ChevronLeft, ChevronRight, Loader2, UserCircle, Edit2, Check, X } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  referralCode: string;
  referralsCount: number;
  discountAvailable: number;
  createdAt: any;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editDiscountValue, setEditDiscountValue] = useState<string>("");
  const itemsPerPage = 10;

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: UserProfile[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as UserProfile);
      });
      // Sort in memory by date descending if createdAt exists
      data.sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeB - timeA;
      });
      setUsers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUpdateDiscount = async (userId: string) => {
    try {
      const val = parseInt(editDiscountValue);
      if (isNaN(val) || val < 0 || val > 100) {
        alert("Please enter a valid percentage between 0 and 100.");
        return;
      }
      await updateDoc(doc(db, "users", userId), {
        discountAvailable: val
      });
      setEditingUserId(null);
    } catch (err) {
      console.error("Error updating discount:", err);
      alert("Failed to update discount.");
    }
  };

  return (
    <div className="animate-[fade-in-up_0.4s_ease-out_both] space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-[#62161A] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <UserCircle className="w-7 h-7 text-[#FFDE59]" />
            Users
          </h1>
          <p className="text-yellow-100/70 text-sm mt-1">Manage registered customers, view referral performance, and adjust discounts.</p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 text-yellow-200/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, email, or code..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
            className="w-full sm:w-80 bg-[#3D0F13] border border-[#62161A] rounded-xl pl-10 pr-4 py-2 text-sm text-yellow-50 placeholder-yellow-100/40 focus:outline-none focus:border-[#FFDE59] focus:ring-1 focus:ring-[#FFDE59] transition-all"
          />
        </div>
      </div>

      <div className="bg-[#3D0F13] border border-[#62161A] rounded-2xl overflow-hidden shadow-xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFDE59]/5 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#2D0A0D] border-b border-[#62161A] text-yellow-200/80">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Customer Details</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Referral Code</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Total Referrals</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Discount Available</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#62161A]/50 text-yellow-100/90">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FFDE59] mx-auto" />
                    <p className="text-yellow-100/60 text-xs mt-2">Loading users...</p>
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-yellow-100/50">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#520C11]/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-base">{user.name || "Unknown User"}</div>
                      <div className="text-yellow-100/70 text-xs mt-0.5">{user.email || "No email"}</div>
                      <div className="text-yellow-100/50 text-xs mt-0.5">{user.phone || "No phone"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono bg-[#240608] text-[#FFDE59] px-3 py-1 rounded-lg text-xs font-bold border border-[#62161A]">
                        {user.referralCode || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white">
                          {user.referralsCount || 0}
                        </span>
                        <span className="text-xs text-yellow-100/50 uppercase tracking-wider font-semibold">referred</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editDiscountValue}
                            onChange={(e) => setEditDiscountValue(e.target.value)}
                            className="w-18 bg-[#240608] border border-[#FFDE59] rounded-lg px-2.5 py-1 text-sm text-[#FFDE59] font-black focus:outline-none"
                            autoFocus
                          />
                          <span className="text-yellow-100/70 text-xs font-bold">%</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {user.discountAvailable || 0}% OFF
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingUserId === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleUpdateDiscount(user.id)} className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors" title="Save">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingUserId(null)} className="p-1.5 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors" title="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setEditingUserId(user.id);
                            setEditDiscountValue((user.discountAvailable || 0).toString());
                          }} 
                          className="p-2 text-yellow-100/60 hover:text-[#FFDE59] hover:bg-[#520C11]/60 rounded-lg transition-colors cursor-pointer"
                          title="Edit Discount"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-[#62161A] p-4 flex items-center justify-between text-sm text-yellow-100/70 relative z-10 bg-[#2D0A0D]">
          <div>
            Showing <span className="font-bold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-bold text-white">
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
            </span>{" "}
            of <span className="font-bold text-[#FFDE59]">{filteredUsers.length}</span> results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#7C1B20] bg-[#520C11] text-white hover:bg-[#681419] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[#7C1B20] bg-[#520C11] text-white hover:bg-[#681419] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
