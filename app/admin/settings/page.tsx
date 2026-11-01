"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Loader2, CheckSquare, Settings, Trash2, AlertTriangle } from "lucide-react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [clearingData, setClearingData] = useState(false);
  const [dangerMsg, setDangerMsg] = useState("");
  
  const [settings, setSettings] = useState({
    preLaunchDiscount: 20,
    referralDiscount: 10,
    maxReferrals: 2,
  });

  const handleClearTestData = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete ALL testing data from Users, Signups, and Orders? Settings will NOT be deleted."
    );
    if (!confirmed) return;

    setClearingData(true);
    setDangerMsg("");

    try {
      // 1. Delete users
      const usersSnap = await getDocs(collection(db, "users"));
      for (const d of usersSnap.docs) {
        await deleteDoc(doc(db, "users", d.id));
      }

      // 2. Delete signups
      const signupsSnap = await getDocs(collection(db, "signups"));
      for (const d of signupsSnap.docs) {
        await deleteDoc(doc(db, "signups", d.id));
      }

      // 3. Delete orders
      const ordersSnap = await getDocs(collection(db, "orders"));
      for (const d of ordersSnap.docs) {
        await deleteDoc(doc(db, "orders", d.id));
      }

      setDangerMsg("All testing data from users, signups, and orders was successfully cleared!");
    } catch (err: any) {
      console.error("Error clearing test data:", err);
      alert("Failed to delete test data: " + (err.message || "Unknown error"));
    } finally {
      setClearingData(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "global");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await setDoc(doc(db, "settings", "global"), settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-10 h-10 animate-spin text-[#FFDE59]" />
      </div>
    );
  }

  return (
    <div className="animate-[fade-in-up_0.4s_ease-out_both] max-w-3xl mx-auto space-y-6">
      <div className="border-b border-[#62161A] pb-5">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
          <Settings className="w-7 h-7 text-[#FFDE59]" />
          Global Settings
        </h1>
        <p className="text-yellow-100/70 text-sm mt-1">Configure automated referral rules, promotional discounts, and reward quotas.</p>
      </div>
      
      {success && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-sm flex items-center gap-2.5 font-semibold">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          Settings saved successfully!
        </div>
      )}

      <div className="bg-[#3D0F13] border border-[#62161A] rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFDE59]/5 blur-[100px] pointer-events-none rounded-full" />
        <form onSubmit={handleSave} className="space-y-6 relative z-10">
          
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white border-b border-[#62161A] pb-3 uppercase tracking-wider text-xs text-yellow-200/80">
              Discounts & Referral Rules
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-yellow-200/80">
                  Pre-Launch Signup Discount (%)
                </label>
                <input
                  type="number"
                  name="preLaunchDiscount"
                  required
                  min="0"
                  max="100"
                  value={settings.preLaunchDiscount}
                  onChange={handleChange}
                  className="block w-full bg-[#240608] border border-[#62161A] rounded-xl py-2.5 px-4 text-[#FFDE59] font-black text-lg placeholder-yellow-100/30 focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent transition-all outline-none"
                />
                <p className="text-xs text-yellow-100/50 mt-1">Discount applied automatically when a user signs up.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-yellow-200/80">
                  Referral Discount (%)
                </label>
                <input
                  type="number"
                  name="referralDiscount"
                  required
                  min="0"
                  max="100"
                  value={settings.referralDiscount}
                  onChange={handleChange}
                  className="block w-full bg-[#240608] border border-[#62161A] rounded-xl py-2.5 px-4 text-[#FFDE59] font-black text-lg placeholder-yellow-100/30 focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent transition-all outline-none"
                />
                <p className="text-xs text-yellow-100/50 mt-1">Discount earned by the referrer when 2 friends sign up.</p>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-yellow-200/80">
                  Max Referrals per User
                </label>
                <input
                  type="number"
                  name="maxReferrals"
                  required
                  min="0"
                  value={settings.maxReferrals}
                  onChange={handleChange}
                  className="block w-full md:w-1/2 bg-[#240608] border border-[#62161A] rounded-xl py-2.5 px-4 text-[#FFDE59] font-black text-lg placeholder-yellow-100/30 focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent transition-all outline-none"
                />
                <p className="text-xs text-yellow-100/50 mt-1">Maximum number of people a single user can refer (Max 2).</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-[#62161A]">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#FFDE59] hover:bg-[#ffe37a] text-[#741117] font-black py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#FFDE59]/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Reset Test Data */}
      <div className="bg-[#2D0A0D] border border-red-900/40 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 text-red-400 font-bold mb-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h2 className="text-base text-red-300 font-bold uppercase tracking-wider">Danger Zone</h2>
        </div>
        <p className="text-sm text-yellow-100/60 mb-5">
          Permanently delete all mock/testing entries from <strong>Users</strong>, <strong>Signups</strong>, and <strong>Orders</strong>. Global settings and configurations will be preserved.
        </p>
        {dangerMsg && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
            {dangerMsg}
          </div>
        )}
        <button
          type="button"
          onClick={handleClearTestData}
          disabled={clearingData}
          className="bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-200 hover:text-white font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 text-sm disabled:opacity-40 cursor-pointer active:scale-95"
        >
          {clearingData ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Deleting test data...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Delete All Testing Data
            </>
          )}
        </button>
      </div>
    </div>
  );
}
