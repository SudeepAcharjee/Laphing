"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, ChevronLeft, ChevronRight, Check, X, Loader2, Users } from "lucide-react";

interface Signup {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  consent: boolean;
  createdAt: any;
}

export default function SignupsPage() {
  
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const q = query(collection(db, "signups"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Signup[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Signup);
      });
      setSignups(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter signups based on search
  const filteredSignups = signups.filter(
    (signup) =>
      signup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signup.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredSignups.length / itemsPerPage) || 1;
  const currentSignups = filteredSignups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="animate-[fade-in-up_0.4s_ease-out_both] space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-[#62161A] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <Users className="w-7 h-7 text-[#FFDE59]" />
            Waitlist Signups
          </h1>
          <p className="text-yellow-100/70 text-sm mt-1">Review all pre-launch waitlist and promotional opt-ins.</p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 text-yellow-200/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
            className="w-full sm:w-72 bg-[#3D0F13] border border-[#62161A] rounded-xl pl-10 pr-4 py-2 text-sm text-yellow-50 placeholder-yellow-100/40 focus:outline-none focus:border-[#FFDE59] focus:ring-1 focus:ring-[#FFDE59] transition-all"
          />
        </div>
      </div>

      <div className="bg-[#3D0F13] border border-[#62161A] rounded-2xl overflow-hidden shadow-xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFDE59]/5 blur-[100px] pointer-events-none rounded-full" />
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#2D0A0D] border-b border-[#62161A] text-yellow-200/80">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Name</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Email</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Phone</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Address</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Consent</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#62161A]/50 text-yellow-100/90">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FFDE59] mx-auto" />
                    <p className="text-yellow-100/60 text-xs mt-2">Loading signups...</p>
                  </td>
                </tr>
              ) : currentSignups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-yellow-100/50">
                    No signups found.
                  </td>
                </tr>
              ) : (
                currentSignups.map((signup) => (
                  <tr key={signup.id} className="hover:bg-[#520C11]/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{signup.name || "-"}</td>
                    <td className="px-6 py-4 text-yellow-100/70">{signup.email || "-"}</td>
                    <td className="px-6 py-4 text-yellow-100/60">{signup.phone || "-"}</td>
                    <td className="px-6 py-4 max-w-[200px] truncate text-yellow-100/60" title={signup.address}>
                      {signup.address || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {signup.consent ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5" /> Opted In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                          <X className="w-3.5 h-3.5" /> No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-yellow-100/50">{formatDate(signup.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-[#62161A] p-4 flex items-center justify-between text-sm text-yellow-100/70 bg-[#2D0A0D]">
          <div>
            Showing <span className="font-bold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-bold text-white">
              {Math.min(currentPage * itemsPerPage, filteredSignups.length)}
            </span>{" "}
            of <span className="font-bold text-[#FFDE59]">{filteredSignups.length}</span> results
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
