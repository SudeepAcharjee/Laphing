"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Send, Loader2, CheckSquare, Users, Mail } from "lucide-react";

interface Signup {
  id: string;
  name: string;
  email: string;
  createdAt: any;
}

export default function AdminMailPage() {
  const [users, setUsers] = useState<Signup[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Email state
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const q = query(collection(db, "signups"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Signup[] = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData.email) {
          data.push({ id: doc.id, ...docData } as Signup);
        }
      });
      setUsers(data);
      setLoadingUsers(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(new Set(filteredUsers.map((u) => u.id)));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleSelectUser = (id: string) => {
    const newSet = new Set(selectedUserIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedUserIds(newSet);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.size === 0) {
      setStatusMsg({ type: "error", text: "Please select at least one recipient." });
      return;
    }

    setSending(true);
    setStatusMsg(null);

    const recipientEmails = users
      .filter((u) => selectedUserIds.has(u.id))
      .map((u) => u.email);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmails,
          subject,
          text: message,
          type: "broadcast",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send email");

      setStatusMsg({ type: "success", text: "Emails broadcasted successfully!" });
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="animate-[fade-in-up_0.4s_ease-out_both] flex flex-col h-[calc(100vh-8rem)] max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-5 border-b border-[#62161A] pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <Mail className="w-7 h-7 text-[#FFDE59]" />
            Mail Center
          </h1>
          <p className="text-yellow-100/70 text-sm mt-1">Broadcast announcements, updates, and offers to registered users.</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Left Sidebar: User Selection */}
        <div className="w-1/3 min-w-[320px] flex flex-col bg-[#3D0F13] border border-[#62161A] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#62161A] bg-[#2D0A0D]">
            <div className="relative">
              <Search className="w-4 h-4 text-yellow-200/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#240608] border border-[#62161A] rounded-xl pl-9 pr-4 py-2 text-sm text-yellow-50 placeholder-yellow-100/40 focus:outline-none focus:border-[#FFDE59] focus:ring-1 focus:ring-[#FFDE59] transition-all"
              />
            </div>
            <div className="mt-3.5 flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-yellow-100/90">
                <input
                  type="checkbox"
                  checked={filteredUsers.length > 0 && selectedUserIds.size === filteredUsers.length}
                  onChange={handleSelectAll}
                  className="rounded border-[#62161A] bg-[#240608] text-[#FFDE59] focus:ring-[#FFDE59] w-4 h-4 cursor-pointer"
                />
                <span>Select All</span>
              </label>
              <span className="text-xs text-[#FFDE59] font-black uppercase tracking-wider bg-[#FFDE59]/10 px-2.5 py-0.5 rounded-full border border-[#FFDE59]/20">
                {selectedUserIds.size} selected
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingUsers ? (
              <div className="flex items-center justify-center p-8 text-yellow-100/60 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#FFDE59]" />
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-yellow-100/50 text-sm">No users found.</div>
            ) : (
              <div className="divide-y divide-[#62161A]/50">
                {filteredUsers.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-start gap-3 p-4 hover:bg-[#520C11]/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.has(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="mt-1 rounded border-[#62161A] bg-[#240608] text-[#FFDE59] focus:ring-[#FFDE59] w-4 h-4 cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-sm truncate">{user.name || "Unknown"}</div>
                      <div className="text-xs text-yellow-100/60 truncate mt-0.5">{user.email}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Compose Email */}
        <div className="flex-1 flex flex-col bg-[#3D0F13] border border-[#62161A] rounded-2xl overflow-hidden shadow-xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFDE59]/5 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="p-6 border-b border-[#62161A] flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-[#FFDE59]" />
              Compose Broadcast Message
            </h2>
          </div>

          {statusMsg && (
            <div className={`m-6 p-4 rounded-xl text-sm flex items-center gap-2 font-semibold ${
              statusMsg.type === "success" 
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                : "bg-red-500/15 border border-red-500/30 text-red-300"
            }`}>
              {statusMsg.type === "success" && <CheckSquare className="w-5 h-5 text-emerald-400" />}
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSendEmail} className="flex-1 flex flex-col p-6 pt-2">
            <div className="space-y-4 flex-1 flex flex-col">
              
              <div className="flex items-center gap-4 py-2 border-b border-[#62161A]">
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-200/80 w-16">To:</span>
                <div className="flex-1 flex flex-wrap gap-2 items-center">
                  {selectedUserIds.size === 0 ? (
                    <span className="text-sm text-yellow-100/40 italic">Select recipients from the list on the left...</span>
                  ) : (
                    <div className="flex items-center gap-2 bg-[#FFDE59]/15 border border-[#FFDE59]/30 text-[#FFDE59] px-3 py-1 rounded-full text-xs font-bold">
                      <Users className="w-3.5 h-3.5" />
                      {selectedUserIds.size} recipient{selectedUserIds.size > 1 ? "s" : ""} selected
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 py-2 border-b border-[#62161A]">
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-200/80 w-16">Subject:</span>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject line..."
                  className="flex-1 bg-transparent border-none text-white placeholder-yellow-100/40 focus:outline-none focus:ring-0 font-medium"
                />
              </div>

              <div className="flex-1 flex flex-col py-4">
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your email content here..."
                  className="flex-1 bg-[#240608] border border-[#62161A] rounded-xl p-4 text-yellow-50 placeholder-yellow-100/30 focus:outline-none focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent resize-none font-medium leading-relaxed"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-[#62161A] flex justify-end">
              <button
                type="submit"
                disabled={sending || selectedUserIds.size === 0}
                className="bg-[#FFDE59] hover:bg-[#ffe37a] text-[#741117] font-black py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#FFDE59]/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Broadcasting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Broadcast Email
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
