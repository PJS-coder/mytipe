"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { Product, Order } from "@/types/store";
import { formatPrice, getOptimizedImageUrl } from "@/lib/utils";
import AdminLoginGate from "@/components/admin/AdminLoginGate";
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  ShoppingBag,
  TrendingUp,
  Layers,
  RefreshCw,
  X,
  AlertCircle,
  Save,
  Check,
  Tag,
  DollarSign,
  Truck,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Filter,
  BarChart3,
  Sliders,
  ChevronRight,
  Store,
  ImageIcon,
  Star,
  ArrowLeftRight,
  UploadCloud,
  LogOut,
} from "lucide-react";

function AdminViewContent({ hasSecret = false }: { hasSecret?: boolean }) {
  const searchParams = useSearchParams();
  const querySecret = searchParams?.get("key") || searchParams?.get("secret");

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const isAuthorizedLink =
    hasSecret ||
    Boolean(
      querySecret &&
        (querySecret === "mudditmakkaradmin2t7yfbu23@%^&YGI" ||
          querySecret === "mudditmakkaradmin2t7yfbu23" ||
          querySecret === encodeURIComponent("mudditmakkaradmin2t7yfbu23@%^&YGI"))
    );

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "collections" | "banners">("products");

  // Check authentication status on mount
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth/check");
        const data = await res.json();
        if (isMounted) {
          setIsAuthenticated(Boolean(data.authenticated));
        }
      } catch {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      window.location.href = "/";
    }
  };

  // Global Store Banner State
  const [storeBannerData, setStoreBannerData] = useState<{
    url: string;
    altText?: string;
    enabled: boolean;
  }>({
    url: "",
    altText: "Official MYTIPE Promotional Banner",
    enabled: true,
  });
  const [isSavingStoreBanner, setIsSavingStoreBanner] = useState(false);
  const globalBannerFileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingGlobalBanner, setIsUploadingGlobalBanner] = useState(false);

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const bannerFileInputRef = React.useRef<HTMLInputElement>(null);


  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "out_of_stock">("all");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State with FULL Multi-Image support
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    handle: "",
    price: "499",
    compareAtPrice: "999",
    description: "",
    category: "gym-socks",
    tags: "socks, all-socks, best-seller",
    images: [] as string[],
    newImageUrl: "",
    bannerUrl: "",
    availableForSale: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, statsRes, bannerRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/stats"),
        fetch("/api/admin/banners"),
      ]);
      const prodData = await prodRes.json();
      const statsData = await statsRes.json();
      const bannerData = await bannerRes.json();

      if (prodData.success) {
        setProducts(prodData.products);
      }
      if (statsData.success && statsData.recentOrders) {
        setOrders(statsData.recentOrders);
      }
      if (bannerData.success && bannerData.settings?.defaultProductBanner) {
        setStoreBannerData(bannerData.settings.defaultProductBanner);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
      showToast("Error connecting to store database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === "all" ||
        p.collections?.includes(selectedCategory) ||
        p.tags.includes(selectedCategory);

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in_stock" && p.availableForSale) ||
        (stockFilter === "out_of_stock" && !p.availableForSale);

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  // Open Add Product Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      subtitle: "Premium Daily Foot Care Essential",
      handle: "",
      price: "499",
      compareAtPrice: "999",
      description: "Crafted with breathable combed cotton yarn and targeted anatomical arch compression for all-day relief.",
      category: "gym-socks",
      tags: "socks, all-socks, best-seller",
      images: [
        "https://images.unsplash.com/photo-1582965372486-6644f772e38c?w=800&auto=format&fit=crop&q=80",
      ],
      newImageUrl: "",
      bannerUrl: "",
      availableForSale: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Product Modal with ALL Images loaded
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);

    // Extract all image URLs (avoid duplicates)
    const allUrls = product.images?.map((img) => img.url).filter(Boolean) || [];
    if (product.featuredImage?.url && !allUrls.includes(product.featuredImage.url)) {
      allUrls.unshift(product.featuredImage.url);
    }

    setFormData({
      title: product.title,
      subtitle: product.subtitle || "",
      handle: product.handle,
      price: product.priceRange.minVariantPrice.amount,
      compareAtPrice: product.compareAtPriceRange?.minVariantPrice.amount || "",
      description: product.description,
      category: product.collections?.[0] || "all-socks",
      tags: product.tags.join(", "),
      images: allUrls.length > 0 ? allUrls : ["https://images.unsplash.com/photo-1582965372486-6644f772e38c?w=800&auto=format&fit=crop&q=80"],
      newImageUrl: "",
      bannerUrl: product.banner?.url || "",
      availableForSale: product.availableForSale,
    });
    setIsModalOpen(true);
  };

  // Add new image URL to current form
  const handleAddImage = () => {
    const url = formData.newImageUrl.trim();
    if (!url) return;
    if (formData.images.includes(url)) {
      alert("This image URL is already in the gallery");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url],
      newImageUrl: "",
    }));
  };

  // Remove an image from gallery
  const handleRemoveImage = (indexToRemove: number) => {
    if (formData.images.length <= 1) {
      alert("A product must have at least one image");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Set an image as the Featured / Cover photo (move to index 0)
  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const copy = [...prev.images];
      const [selected] = copy.splice(index, 1);
      copy.unshift(selected);
      return { ...prev, images: copy };
    });
  };

  // Upload file from device directly (via Cloudinary or local fallback)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, data.url],
        }));
        showToast(data.message || "Photo uploaded successfully! ✓");
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Upload full-size banner from device directly
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({
          ...prev,
          bannerUrl: data.url,
        }));
        showToast("Full-size banner uploaded successfully! ✓");
      } else {
        alert(data.error || "Failed to upload banner image");
      }
    } catch (err) {
      console.error("Banner upload error:", err);
      alert("Error uploading banner image");
    } finally {
      setIsUploadingBanner(false);
      if (bannerFileInputRef.current) bannerFileInputRef.current.value = "";
    }
  };

  // Save Storewide Default Banner
  const handleSaveStoreBanner = async () => {
    setIsSavingStoreBanner(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultProductBanner: storeBannerData }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Storewide product banner saved! ✓");
      } else {
        alert(data.error || "Failed to save banner");
      }
    } catch (e) {
      alert("Error saving banner");
    } finally {
      setIsSavingStoreBanner(false);
    }
  };

  // Upload Global Banner from Device
  const handleGlobalBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingGlobalBanner(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setStoreBannerData((prev) => ({
          ...prev,
          url: data.url,
        }));
        showToast("Banner image uploaded! Click Save to apply ✓");
      } else {
        alert(data.error || "Failed to upload banner image");
      }
    } catch (err) {
      alert("Error uploading banner image");
    } finally {
      setIsUploadingGlobalBanner(false);
      if (globalBannerFileInputRef.current) globalBannerFileInputRef.current.value = "";
    }
  };


  // Toggle in-stock status
  const handleToggleStock = async (product: Product) => {
    try {
      const updatedStatus = !product.availableForSale;
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availableForSale: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, availableForSale: updatedStatus } : p))
        );
        showToast(`${product.title} status changed to ${updatedStatus ? "In Stock" : "Out of Stock"}`);
      }
    } catch {
      showToast("Failed to update status");
    }
  };

  // Delete product
  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to permanently delete "${product.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        showToast("Product deleted from store catalog ✓");
      }
    } catch {
      showToast("Failed to delete product");
    }
  };

  // Save (Add or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please provide a product title");
      return;
    }

    if (formData.images.length === 0) {
      alert("Please add at least one product image");
      return;
    }

    setIsSaving(true);
    const tagArray = formData.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    // Format all images as typed ProductImage objects
    const formattedImages = formData.images.map((url, i) => ({
      url,
      altText: `${formData.title} - Image ${i + 1}`,
    }));

    const primaryImage = formattedImages[0];

    const payload: Partial<Product> & { title: string } = {
      title: formData.title,
      subtitle: formData.subtitle,
      handle: formData.handle.trim() || undefined,
      description: formData.description,
      availableForSale: formData.availableForSale,
      priceRange: {
        minVariantPrice: { amount: parseFloat(formData.price || "0").toFixed(2), currencyCode: "INR" },
        maxVariantPrice: { amount: parseFloat(formData.price || "0").toFixed(2), currencyCode: "INR" },
      },
      compareAtPriceRange: formData.compareAtPrice
        ? {
            minVariantPrice: { amount: parseFloat(formData.compareAtPrice).toFixed(2), currencyCode: "INR" },
            maxVariantPrice: { amount: parseFloat(formData.compareAtPrice).toFixed(2), currencyCode: "INR" },
          }
        : undefined,
      featuredImage: primaryImage,
      images: formattedImages,
      tags: tagArray,
      collections: [formData.category, "all-socks"],
      banner: formData.bannerUrl.trim()
        ? {
            url: formData.bannerUrl.trim(),
            altText: `${formData.title} Full Promotional Banner`,
          }
        : undefined,
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.product : p))
          );
          showToast(`Updated "${formData.title}" with ${formattedImages.length} images! ✓`);
          setIsModalOpen(false);
        } else {
          alert(data.error || "Failed to update product");
        }
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => [data.product, ...prev]);
          showToast(`Created "${formData.title}" with ${formattedImages.length} images! ✓`);
          setIsModalOpen(false);
        } else {
          alert(data.error || "Failed to create product");
        }
      }
    } catch {
      alert("Error saving product. Please check server.");
    } finally {
      setIsSaving(false);
    }
  };

  const inStockCount = products.filter((p) => p.availableForSale).length;
  const outOfStockCount = products.length - inStockCount;

  // 1. Loading state while checking session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full bg-[#080c16] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-mono tracking-wider">Verifying secure admin session...</span>
      </div>
    );
  }

  // 2. If not authenticated and NOT accessing via authorized secret link -> 404 Not Found
  if (!isAuthenticated && !isAuthorizedLink) {
    notFound();
  }

  // 3. If not authenticated but accessing via secret link -> Show Master Login Gate
  if (!isAuthenticated) {
    return (
      <AdminLoginGate
        onSuccess={() => {
          setIsAuthenticated(true);
          loadData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout with RIGHT-SIDE NAVBAR */}
      <div className="flex-1 flex flex-col lg:flex-row w-full">
        {/* ============================================================== */}
        {/* LEFT / CENTER: MAIN DASHBOARD CANVAS */}
        {/* ============================================================== */}
        <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Store Management</h1>
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Backend
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Manage all {products.length} products, full multi-image galleries, prices, and orders.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={loadData}
                title="Refresh products database"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-red-600" : "text-slate-500"}`} />
                <span>Sync</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm shadow-red-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>

              <button
                onClick={handleLogout}
                title="Lock session and log out"
                className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Products</span>
                <Package className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{products.length}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Total in catalog</div>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between text-emerald-600">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">In Stock</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-2">{inStockCount}</div>
              <div className="text-[11px] text-emerald-700/80 mt-0.5">Live on storefront</div>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Collections</span>
                <Layers className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">19</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Gym, Kits, Diabetic, etc.</div>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between text-blue-600">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Gateway</span>
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-2">Razorpay & COD</div>
              <div className="text-[11px] text-blue-600 mt-0.5">Zero Shopify Dependency</div>
            </div>
          </div>

          {/* TAB 1: PRODUCTS TABLE WITH MULTI-IMAGE GALLERY STRIP */}
          {activeTab === "products" && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="bg-white border border-slate-200/80 p-3 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, handle, tag..."
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-red-600 transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 px-3 py-2 rounded-xl outline-none focus:border-red-600 cursor-pointer"
                  >
                    <option value="all">All Collections</option>
                    <option value="gym-socks">Gym Socks</option>
                    <option value="diabetic-socks">Diabetic Socks</option>
                    <option value="office-socks">Office Socks</option>
                    <option value="designer-socks">Designer Socks</option>
                    <option value="combos">Combos</option>
                    <option value="all-socks">All Alignment Socks</option>
                    <option value="best-sellers">Best Sellers</option>
                  </select>

                  {/* Stock Status Filter */}
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value as "all" | "in_stock" | "out_of_stock")}
                    className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 px-3 py-2 rounded-xl outline-none focus:border-red-600 cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="in_stock">In Stock ({inStockCount})</option>
                    <option value="out_of_stock">Out of Stock ({outOfStockCount})</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Product & All Images</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Category & Tags</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((product) => {
                        const allProductImages = product.images && product.images.length > 0
                          ? product.images
                          : product.featuredImage ? [product.featuredImage] : [];

                        return (
                          <tr key={product.id} className="hover:bg-slate-50/70 transition group">
                            {/* Product Info with MULTI-IMAGE STRIP */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3.5">
                                {/* Visual Thumbnails Strip */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {allProductImages.slice(0, 4).map((img, idx) => (
                                    <div
                                      key={idx}
                                      className={`relative rounded-xl overflow-hidden bg-slate-100 shrink-0 border transition-transform hover:scale-110 shadow-2xs ${
                                        idx === 0
                                          ? "w-12 h-12 border-red-500/60 ring-2 ring-red-500/20"
                                          : "w-9 h-9 border-slate-200 opacity-90 hover:opacity-100"
                                      }`}
                                      title={idx === 0 ? "Featured Cover Image" : `Gallery Photo #${idx + 1}`}
                                    >
                                      {img?.url && (
                                        <Image
                                          src={getOptimizedImageUrl(img.url, 96)}
                                          alt={img.altText || product.title}
                                          fill
                                          unoptimized
                                          className="object-cover"
                                          sizes="48px"
                                        />
                                      )}
                                      {idx === 0 && (
                                        <span className="absolute bottom-0 inset-x-0 bg-red-600/90 text-white text-[8px] font-bold text-center py-0.5 leading-none">
                                          Cover
                                        </span>
                                      )}
                                    </div>
                                  ))}

                                  {/* Badge for extra images if more than 4 */}
                                  {allProductImages.length > 4 && (
                                    <div
                                      className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-extrabold text-slate-700 shadow-2xs"
                                      title={`${allProductImages.length - 4} more photos`}
                                    >
                                      +{allProductImages.length - 4}
                                    </div>
                                  )}
                                </div>

                                {/* Title, Handle, and Photos count */}
                                <div className="min-w-0 max-w-xs sm:max-w-sm">
                                  <div className="font-bold text-slate-900 truncate">{product.title}</div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[11px] text-slate-400 font-mono truncate">
                                      /products/{product.handle}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                                      <ImageIcon className="w-2.5 h-2.5 text-slate-500" />
                                      {allProductImages.length} photos
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Price */}
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">
                                {formatPrice(product.priceRange.minVariantPrice.amount)}
                              </div>
                              {product.compareAtPriceRange && (
                                <div className="text-[11px] text-slate-400 line-through">
                                  {formatPrice(product.compareAtPriceRange.minVariantPrice.amount)}
                                </div>
                              )}
                            </td>

                            {/* Category & Tags */}
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {product.collections?.slice(0, 2).map((col) => (
                                  <span
                                    key={col}
                                    className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium"
                                  >
                                    {col}
                                  </span>
                                ))}
                                {product.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-md bg-red-50 border border-red-200/60 text-red-700 text-[10px] font-medium"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Stock Status Toggle */}
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleToggleStock(product)}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                                  product.availableForSale
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    product.availableForSale ? "bg-emerald-500" : "bg-red-500"
                                  }`}
                                />
                                <span>{product.availableForSale ? "In Stock" : "Out of Stock"}</span>
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Link
                                  href={`/products/${product.handle}`}
                                  target="_blank"
                                  title="View on Live Store"
                                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() => handleOpenEdit(product)}
                                  title="Edit product & photos"
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product)}
                                  title="Delete product"
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="p-12 text-center text-slate-400 space-y-2">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="font-semibold text-slate-600">No products match your criteria</p>
                    <p className="text-xs text-slate-400">Try changing your search keywords or category filter</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE ORDERS TABLE */}
          {activeTab === "orders" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs space-y-4">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Customer Orders</h3>
                  <p className="text-xs text-slate-500">Orders placed via Razorpay Online or Cash on Delivery</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-700">No orders placed yet</p>
                  <p className="text-xs text-slate-400">
                    When customers buy items on your store, their orders will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Order Number</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Items Count</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Payment Method</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{order.orderNumber || order.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-800">{order.customer.fullName}</div>
                            <div className="text-[11px] text-slate-400">{order.customer.phone} • {order.customer.city}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {order.items.length} item(s)
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {formatPrice(order.pricing.total)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              order.paymentMethod === "razorpay"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-neutral-100 text-neutral-800 border border-neutral-200"
                            }`}>
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" /> Confirmed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COLLECTIONS LIST */}
          {activeTab === "collections" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Gym Socks", handle: "gym-socks", desc: "High-performance compression & grip socks" },
                { name: "Diabetic Socks", handle: "diabetic-socks", desc: "Non-binding gentle circulation socks" },
                { name: "Office Socks", handle: "office-socks", desc: "Breathable jacquard all-day formal socks" },
                { name: "Designer Socks", handle: "designer-socks", desc: "Expressive patterns for modern lifestyle" },
                { name: "Combos", handle: "combos", desc: "Everyday foot comfort & deo combos" },
                { name: "All Alignment Socks", handle: "all-socks", desc: "Original anatomical toe spacing socks" },
              ].map((c) => {
                const count = products.filter(
                  (p) => p.collections?.includes(c.handle) || p.tags.includes(c.handle)
                ).length;
                return (
                  <div key={c.handle} className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                      <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {count} items
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{c.desc}</p>
                    <div className="pt-2">
                      <Link
                        href={`/collections/${c.handle}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                      >
                        <span>View on Store</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: STORE & PRODUCT BANNERS */}
          {activeTab === "banners" && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900">Storewide Product Page Banner</h3>
                      <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                        Full-Size Direct Image
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      This banner will be displayed on product pages across your store.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveStoreBanner}
                    disabled={isSavingStoreBanner}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-red-600/20 transition cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingStoreBanner ? "Saving..." : "Save Banner"}</span>
                  </button>
                </div>

                {/* Banner Preview */}
                {storeBannerData.url ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-sm max-h-72 group">
                    <img
                      src={storeBannerData.url}
                      alt="Store Banner Preview"
                      className="w-full h-auto object-cover max-h-72"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => globalBannerFileInputRef.current?.click()}
                        className="bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow cursor-pointer"
                      >
                        Replace Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setStoreBannerData((prev) => ({ ...prev, url: "" }))}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow cursor-pointer"
                      >
                        Remove Banner
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center space-y-3 bg-slate-50/50">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">No Banner Image Configured</div>
                      <div className="text-xs text-slate-400 mt-0.5">Upload a banner or paste a direct image URL below</div>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Direct Banner Image URL
                    </label>
                    <input
                      type="url"
                      value={storeBannerData.url}
                      onChange={(e) => setStoreBannerData({ ...storeBannerData, url: e.target.value })}
                      placeholder="https://... or /banner.jpg"
                      className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-red-600 transition"
                    />
                  </div>

                  <div className="sm:col-span-4 flex items-end">
                    <button
                      type="button"
                      onClick={() => globalBannerFileInputRef.current?.click()}
                      disabled={isUploadingGlobalBanner}
                      className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingGlobalBanner ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-red-600 rounded-full animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 text-red-600" />
                          <span>Upload From Device</span>
                        </>
                      )}
                    </button>
                    <input
                      ref={globalBannerFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleGlobalBannerUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Enable toggle */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={storeBannerData.enabled}
                      onChange={(e) => setStoreBannerData({ ...storeBannerData, enabled: e.target.checked })}
                      className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                    />
                    <span>Enable banner on product pages</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Individual product banners override this default
                  </span>
                </div>
              </div>

              {/* Per Product Overrides Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Per-Product Banner Overrides</h4>
                    <p className="text-[11px] text-slate-500">
                      Customize banners for specific individual products
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {products.filter((p) => p.banner?.url).length} Custom Banners Active
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {products.map((p) => (
                    <div key={p.id} className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 relative">
                          <img
                            src={p.featuredImage?.url || p.images[0]?.url}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {p.banner?.url ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Custom banner active
                              </span>
                            ) : (
                              "Using store default banner"
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 text-red-600" />
                          <span>{p.banner?.url ? "Edit Banner" : "Set Banner"}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* RIGHT SIDE NAVBAR (DEDICATED ADMIN CONTROL BAR) */}
        {/* ============================================================== */}
        <aside className="w-full lg:w-72 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-5 flex flex-col justify-between shrink-0 lg:h-screen lg:sticky lg:top-0 space-y-6">
          <div className="space-y-6">
            {/* Admin Brand Logo & Badge */}
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-extrabold text-white text-base shadow-md shadow-red-600/30">
                  M
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 tracking-wider text-sm">MYTIPE</div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Admin Console</div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Right Sidebar) */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 block">
                Navigation
              </span>

              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "products"
                    ? "bg-red-50 text-red-600 border border-red-200/80 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>Products Catalog</span>
                </div>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-red-50 text-red-600 border border-red-200/80 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Customer Orders</span>
                </div>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("collections")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "collections"
                    ? "bg-red-50 text-red-600 border border-red-200/80 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4" />
                  <span>Collections</span>
                </div>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  19
                </span>
              </button>

              <button
                onClick={() => setActiveTab("banners")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "banners"
                    ? "bg-red-50 text-red-600 border border-red-200/80 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>Store Banners</span>
                </div>
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Direct
                </span>
              </button>
            </div>

            {/* Quick Actions (Right Sidebar) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1 block">
                Quick Actions
              </span>

              <button
                onClick={handleOpenAdd}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm shadow-red-600/20 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Product</span>
              </button>

              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold transition"
              >
                <Store className="w-4 h-4 text-slate-600" />
                <span>Open Live Storefront</span>
              </Link>
            </div>
          </div>

          {/* Right Sidebar Bottom Info Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Backend Server</span>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                ONLINE
              </span>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              Running native Next.js fullstack API routes. 100% free Vercel deployment.
            </div>
            <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Checkout:</span>
              <span className="font-semibold text-slate-700">Razorpay + COD</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ============================================================== */}
      {/* ADD / EDIT PRODUCT MODAL (WITH FULL MULTI-IMAGE GALLERY MANAGER) */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  {editingProduct ? `Edit Product: ${editingProduct.title}` : "Add New Product"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingProduct
                    ? `Manage details, pricing, and all ${formData.images.length} photos`
                    : "Create a new item with multiple photos in your store database"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* SECTION 1: PRODUCT PHOTOS GALLERY MANAGER */}
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-red-600" />
                    <span className="font-extrabold text-slate-900 text-xs">
                      Product Photos Gallery ({formData.images.length} Photos)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">First image is the primary Cover Photo</span>
                </div>

                {/* Image Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.images.map((url, idx) => (
                    <div
                      key={idx}
                      className={`relative group rounded-xl overflow-hidden bg-white border shadow-2xs transition ${
                        idx === 0
                          ? "border-red-500 ring-2 ring-red-500/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="relative aspect-square w-full">
                        <Image
                          src={getOptimizedImageUrl(url, 300)}
                          alt={`Photo ${idx + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="150px"
                        />
                      </div>

                      {/* Cover Badge on #1 */}
                      {idx === 0 ? (
                        <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" /> Cover
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetCoverImage(idx)}
                          title="Set as cover image"
                          className="absolute top-1.5 left-1.5 bg-slate-900/80 hover:bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition shadow-xs flex items-center gap-1"
                        >
                          <ArrowLeftRight className="w-2.5 h-2.5" /> Make Cover
                        </button>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Delete photo"
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="p-1.5 text-center bg-white border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500">
                          {idx === 0 ? "Main Photo" : `Photo #${idx + 1}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Another Image Input & Upload */}
                <div className="pt-3 border-t border-slate-200/60 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      + Add Photo URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.newImageUrl}
                        onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
                        placeholder="Paste image URL (https://...)"
                        className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-900 outline-none focus:border-red-600 transition"
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* Or Direct File Upload from Computer via Cloudinary */}
                  <div className="flex items-center justify-between bg-white border border-slate-200/80 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50"
                      >
                        {isUploading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-red-600 rounded-full animate-spin" />
                            <span>Uploading to Cloud...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4 text-red-600" />
                            <span>Upload File from Device (Cloudinary)</span>
                          </>
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">PNG, JPG, WEBP</span>
                  </div>

                  {/* Direct Full-Size Promotional Banner Section */}
                  <div className="pt-3 border-t border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Full-Size Direct Banner Image (Optional)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Displays a high-resolution, full-width promo banner on this product's page.
                        </div>
                      </div>
                      {formData.bannerUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, bannerUrl: "" }))}
                          className="text-[11px] font-bold text-red-600 hover:text-red-700 underline cursor-pointer"
                        >
                          Remove Banner
                        </button>
                      )}
                    </div>

                    {formData.bannerUrl ? (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm max-h-40 group">
                        <img
                          src={formData.bannerUrl}
                          alt="Banner Preview"
                          className="w-full h-auto object-cover max-h-40"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => bannerFileInputRef.current?.click()}
                            className="bg-white/90 hover:bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            Replace Image
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, bannerUrl: "" }))}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="url"
                          value={formData.bannerUrl}
                          onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                          placeholder="Paste direct banner image URL (https://...)"
                          className="flex-1 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-900 outline-none focus:border-red-600 transition"
                        />
                        <button
                          type="button"
                          onClick={() => bannerFileInputRef.current?.click()}
                          disabled={isUploadingBanner}
                          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap disabled:opacity-50"
                        >
                          {isUploadingBanner ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-red-600 rounded-full animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4 text-red-600" />
                              <span>Upload Banner File</span>
                            </>
                          )}
                        </button>
                        <input
                          ref={bannerFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: BASIC DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1.5">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Copper Compression Foot Alignment Socks"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-red-600 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1.5">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Original Anatomical Toe Separator & Pain Relief"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-red-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="499"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-red-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Compare At / MRP Price (₹)</label>
                  <input
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="999"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-red-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Primary Collection</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-red-600 transition"
                  >
                    <option value="gym-socks">Gym Socks</option>
                    <option value="diabetic-socks">Diabetic Socks</option>
                    <option value="office-socks">Office Socks</option>
                    <option value="designer-socks">Designer Socks</option>
                    <option value="combos">Combos</option>
                    <option value="all-socks">All Alignment Socks</option>
                    <option value="best-sellers">Best Sellers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="socks, best-seller, featured"
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-red-600 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-red-600 transition resize-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="modalAvailableForSale"
                    checked={formData.availableForSale}
                    onChange={(e) => setFormData({ ...formData, availableForSale: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                  />
                  <label htmlFor="modalAvailableForSale" className="text-slate-800 font-semibold cursor-pointer">
                    Available for Sale (In Stock on storefront)
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-sm shadow-red-600/20 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingProduct ? "Update Product" : "Save Product"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminView({ hasSecret = false }: { hasSecret?: boolean }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
          <div className="w-8 h-8 border-3 border-slate-700 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading Admin Panel...</p>
        </div>
      }
    >
      <AdminViewContent hasSecret={hasSecret} />
    </Suspense>
  );
}
