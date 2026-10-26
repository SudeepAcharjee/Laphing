"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Loader2, CheckSquare, ImagePlus, Package } from "lucide-react";
import Image from "next/image";

export default function AdminProductSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [product, setProduct] = useState({
    name: "Laphing Signature Pack",
    description: "Spicy. Tangy. Addictive.",
    price: 499,
    imageUrl: "/hero.png",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "settings", "product");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct(docSnap.data() as any);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "pdf-uploads");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setProduct(prev => ({ ...prev, imageUrl: data.secure_url }));
      } else {
        alert("Upload failed. Ensure your Cloudinary upload preset supports images.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await setDoc(doc(db, "settings", "product"), product);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving product:", err);
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
    <div className="animate-[fade-in-up_0.4s_ease-out_both] max-w-4xl mx-auto space-y-6">
      <div className="border-b border-[#62161A] pb-5">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
          <Package className="w-7 h-7 text-[#FFDE59]" />
          Store Product
        </h1>
        <p className="text-yellow-100/70 text-sm mt-1">Manage the core product details, pricing, and showcase image for your customers.</p>
      </div>
      
      {success && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-sm flex items-center gap-2.5 font-semibold">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          Product details saved successfully!
        </div>
      )}

      <div className="bg-[#3D0F13] border border-[#62161A] rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#FFDE59]/5 blur-[120px] pointer-events-none rounded-full" />
        
        <form onSubmit={handleSave} className="space-y-8 relative z-10">
          
          {/* Image Upload Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-200/80 mb-3">Product Showcase Image</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="relative w-36 h-36 bg-[#240608] border-2 border-[#62161A] rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-inner group">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
                ) : (
                  <Package className="w-10 h-10 text-yellow-100/40" />
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FFDE59]" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="bg-[#520C11] hover:bg-[#681419] text-[#FFDE59] border border-[#7C1B20] font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 w-fit cursor-pointer shadow-md active:scale-95">
                  <ImagePlus className="w-5 h-5" />
                  Upload New Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <p className="text-xs text-yellow-100/50">Recommended size: 800x800px. Uploads instantly via Cloudinary.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#62161A]">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-yellow-200/80">Product Name</label>
              <input
                type="text"
                name="name"
                required
                value={product.name}
                onChange={handleChange}
                className="block w-full bg-[#240608] border border-[#62161A] rounded-xl py-3 px-4 text-white placeholder-yellow-100/30 focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent transition-all outline-none font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-yellow-200/80">Price (₹)</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={product.price}
                onChange={handleChange}
                className="block w-full bg-[#240608] border border-[#62161A] rounded-xl py-3 px-4 text-[#FFDE59] font-black text-lg placeholder-yellow-100/30 focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-yellow-200/80">Short Description</label>
              <textarea
                name="description"
                required
                rows={3}
                value={product.description}
                onChange={handleChange}
                className="block w-full bg-[#240608] border border-[#62161A] rounded-xl py-3 px-4 text-yellow-50 placeholder-yellow-100/30 focus:ring-2 focus:ring-[#FFDE59] focus:border-transparent transition-all outline-none resize-none font-medium"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-[#62161A]">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="bg-[#FFDE59] hover:bg-[#ffe37a] text-[#741117] font-black py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#FFDE59]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
