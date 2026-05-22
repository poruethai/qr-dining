"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { auth } from "@/lib/firebase-client";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
//import { uploadImage } from "../../app/api/utils/upload";
import { QRCodeCanvas } from "qrcode.react";

import {
  RefreshCw, CheckCircle, Clock, LayoutDashboard, UtensilsCrossed,
  Plus, Minus, Pencil, Trash2, X, Save, Eye, EyeOff, ChevronDown,
  ImagePlus, Loader2, LogOut, Download, QrCode, CalendarDays
} from "lucide-react";

const CATEGORIES = ["Mains", "Pizza", "Salads", "Sides", "Desserts", "Drinks", "Other"];

// ─── authFetch ────────────────────────────────────────────────────────────────
async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await auth.currentUser?.getIdToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;
  image_url?: string | null;
}

interface Order {
  id: string;
  item_name: string;
  table_number: string | number;
  status: "new" | "preparing" | "completed";
  created_at: string;
}

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onSave: (data: Omit<MenuItem, "id">) => void;
}

// ─── Item Form Modal ──────────────────────────────────────────────────────────
function ItemModal({ item, onClose, onSave }: ItemModalProps) {
  const [form, setForm] = useState({
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: item?.price ?? ("" as number | ""),
    category: item?.category ?? "Mains",
    available: item?.available ?? true,
    image_url: item?.image_url ?? null as string | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image_url ?? null);
  // ✅ แทนที่ด้วย
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = <K extends keyof typeof form>(field: K, value: typeof form[K]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const objectUrl = URL.createObjectURL(file);
  setImagePreview(objectUrl);
  setUploading(true);

  try {
    const token = await auth.currentUser?.getIdToken();
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const { url } = await res.json();
    handleChange("image_url", url ?? null);
    toast.success("Image uploaded!");
  } catch {
    toast.error("Image upload failed");
    setImagePreview(null);
    handleChange("image_url", null);
  } finally {
    setUploading(false);
  }
};

  const handleRemoveImage = () => {
    setImagePreview(null);
    handleChange("image_url", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === "") {
      toast.error("Name and price are required.");
      return;
    }
    onSave({ ...form, price: parseFloat(String(form.price)) });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-semibold text-gray-900">
            {item ? "Edit Item" : "Add Menu Item"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Photo</label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="text-white animate-spin" size={28} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-white shadow-sm flex items-center gap-1">
                    <ImagePlus size={12} /> Change
                  </button>
                  <button type="button" onClick={handleRemoveImage}
                    className="bg-white/90 backdrop-blur p-1.5 rounded-lg text-red-500 hover:bg-white shadow-sm">
                    <X size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
                <ImagePlus size={26} />
                <span className="text-sm font-medium">Click to upload a photo</span>
                <span className="text-xs text-gray-400">PNG, JPG, WEBP</span>
              </button>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
            <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Classic Burger"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Short description of the item..." rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input type="number" step="0.01" min="0" value={form.price}
                onChange={(e) => handleChange("price", e.target.value as unknown as number)}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="relative">
                <select value={form.category} onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => handleChange("available", !form.available)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.available ? "bg-green-500" : "bg-gray-200"}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.available ? "translate-x-4.5" : "translate-x-0.5"}`} />
            </button>
            <span className="text-sm text-gray-600">{form.available ? "Available on menu" : "Hidden from menu"}</span>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={uploading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              <Save size={14} />
              {item ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Menu Tab ─────────────────────────────────────────────────────────────────
function MenuTab() {
  const queryClient = useQueryClient();
  const [modalItem, setModalItem] = useState<MenuItem | {} | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");

  const { data: items = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await authFetch("/api/menu");
      if (!res.ok) throw new Error("Failed to fetch menu");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<MenuItem, "id">) => {
      const res = await authFetch("/api/menu", { method: "POST", body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed to create item");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["menu"] }); toast.success("Menu item added!"); setModalItem(null); },
    onError: () => toast.error("Failed to add item"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<MenuItem> & { id: string }) => {
      const res = await authFetch(`/api/menu/${id}`, { method: "PATCH", body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed to update item");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["menu"] }); toast.success("Item updated!"); setModalItem(null); },
    onError: () => toast.error("Failed to update item"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await authFetch(`/api/menu/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["menu"] }); toast.success("Item removed from menu"); },
    onError: () => toast.error("Failed to delete item"),
  });

  const toggleAvailability = (item: MenuItem) => updateMutation.mutate({ id: item.id, available: !item.available });

  const handleDelete = (item: MenuItem) => {
    if (window.confirm(`Remove "${item.name}" from the menu?`)) deleteMutation.mutate(item.id);
  };

  const handleSave = (formData: Omit<MenuItem, "id">) => {
    const m = modalItem as MenuItem;
    if (m?.id) updateMutation.mutate({ id: m.id, ...formData });
    else createMutation.mutate(formData);
  };

  const presentCategories = ["All", ...CATEGORIES.filter((c) => items.some((i) => i.category === c))];
  const filtered = filterCategory === "All" ? items : items.filter((i) => i.category === filterCategory);

  if (isLoading) return <div className="flex items-center justify-center py-24"><RefreshCw className="animate-spin text-blue-500" size={24} /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {presentCategories.map((cat) => (
            <button key={cat} onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterCategory === cat ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"}`}>
              {cat}
            </button>
          ))}
        </div>
        <button onClick={() => setModalItem({})}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors flex-shrink-0">
          <Plus size={15} /> Add Item
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">
            <UtensilsCrossed size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No items found</p>
          </div>
        ) : filtered.map((item) => (
          <div key={item.id} className={`bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col transition-all ${!item.available ? "opacity-50" : ""}`}>
            <div className="relative w-full h-50 bg-gray-50">
              {item.image_url
                ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><UtensilsCrossed size={28} className="text-gray-200" /></div>
              }
              <button onClick={() => toggleAvailability(item)}
                className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shadow-sm transition-colors ${item.available ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-400 text-white hover:bg-gray-500"}`}>
                {item.available ? <Eye size={10} /> : <EyeOff size={10} />}
                {item.available ? "On" : "Off"}
              </button>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</p>
                <span className="text-amber-600 font-semibold text-sm flex-shrink-0">${parseFloat(String(item.price)).toFixed(2)}</span>
              </div>
              {item.description && <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">{item.description}</p>}
              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">{item.category}</span>
                <div className="flex gap-1 ml-auto">
                  <button onClick={() => setModalItem(item)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(item)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modalItem !== null && (
        <ItemModal
          item={"id" in (modalItem as object) ? (modalItem as MenuItem) : null}
          onClose={() => setModalItem(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const queryClient = useQueryClient();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().split("T")[0]
  );
  const [showAll, setShowAll] = useState(true);

  const toDate = (val: any): Date => {
    if (!val) return new Date();
    if (val._seconds) return new Date(val._seconds * 1000);
    return new Date(val);
  };

  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await authFetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    refetchInterval: 5000,
  });

  const filtered = showAll
    ? orders
    : orders.filter((o) => toDate((o as any).created_at).toISOString().split("T")[0] === selectedDate);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await authFetch(`/api/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["orders"] }); toast.success("Order status updated"); },
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-50 text-blue-700 border border-blue-200";
      case "preparing": return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "completed": return "bg-green-50 text-green-700 border border-green-200";
      default: return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  if (isLoading) return <div className="flex items-center justify-center py-24"><RefreshCw className="animate-spin text-blue-500" size={24} /></div>;

  const newCount = filtered.filter((o) => o.status === "new").length;
  const preparingCount = filtered.filter((o) => o.status === "preparing").length;

  return (
    <div>
    {/* ── Summary cards ── */}
      <div className="flex gap-4 mb-6">
        {[
          { label: "New", value: newCount, color: "text-blue-600" },
          { label: "Preparing", value: preparingCount, color: "text-yellow-500" },
          { label: "Total", value: filtered.length, color: "text-gray-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white px-5 py-4 rounded-2xl border border-gray-200 text-center min-w-[100px]">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{label}</div>
          </div>
        ))}
      </div>
      {/* ── Date filter bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          <button onClick={() => setShowAll(true)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${showAll ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            All
          </button>
          <button onClick={() => setShowAll(false)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${!showAll ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            By Date
          </button>
        </div>
        {!showAll && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                max={today.toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <button onClick={() => setSelectedDate(today.toISOString().split("T")[0])}
              className="px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
              Today
            </button>
          </div>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-4 text-sm">Error loading orders.</div>}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100">
              <tr>
                {["Order Info", "Table", "Status", "Time", ""].map((h) => (
                  <th key={h} className={`px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider ${h === "" ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">No orders found</td></tr>
              ) : filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4"><span className="font-semibold text-gray-900 text-sm">{order.item_name}</span></td>
                  <td className="px-6 py-4"><span className="px-2.5 py-1 bg-gray-100 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200">#{order.table_number}</span></td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.status)}`}>{order.status.toUpperCase()}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {toDate((order as any).created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.status === "new" && (
                      <button onClick={() => updateStatusMutation.mutate({ id: order.id, status: "preparing" })}
                        className="text-yellow-600 hover:bg-yellow-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Prepare</button>
                    )}
                    {order.status === "preparing" && (
                      <button onClick={() => updateStatusMutation.mutate({ id: order.id, status: "completed" })}
                        className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Complete</button>
                    )}
                    {order.status === "completed" && (
                      <div className="text-green-500 flex items-center justify-end gap-1.5 px-3 py-1.5">
                        <CheckCircle size={15} /><span className="text-sm font-medium">Done</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
// ─── QR Tab ───────────────────────────────────────────────────────────────────
function QRTab({ uid }: { uid: string }) {
  const [tableCount, setTableCount] = useState(5);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleDownload = (tableNumber: number) => {
    const canvas = document.getElementById(`qr-${tableNumber}`) as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `table-${tableNumber}-qr.png`;
    a.click();
  };

  const handleDownloadAll = () => {
    for (let i = 1; i <= tableCount; i++) handleDownload(i);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Table</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTableCount((n) => Math.max(1, n - 1))}
              className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 font-bold flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-bold text-gray-900">{tableCount}</span>
            <button
              onClick={() => setTableCount((n) => Math.min(50, n + 1))}
              className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 font-bold flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        <button
          onClick={handleDownloadAll}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Download size={15} /> Download All QR
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: tableCount }, (_, i) => i + 1).map((table) => {
          const menuUrl = `${baseUrl}/menu?uid=${uid}&table=${table}`;
          return (
            <div key={table} className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col items-center gap-3">
              <p className="text-sm font-semibold text-gray-700">Table {table}</p>
              <div className="p-2 bg-white rounded-xl border border-gray-100">
                <QRCodeCanvas
                  id={`qr-${table}`}
                  value={menuUrl}
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#1d1d1f"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <button
                onClick={() => handleDownload(table)}
                className="w-full text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Download size={12} /> Download
              </button>
              <a href={menuUrl} target="_blank" rel="noopener noreferrer"
                className="w-full text-xs text-gray-400 hover:text-blue-500 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 py-1.5 px-2 rounded-lg transition-colors text-center truncate"
                title={menuUrl}>
                {menuUrl}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "menu" | "qr">("orders");
  const [authReady, setAuthReady] = useState(false);
  const [currentUid, setCurrentUid] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showUserCard, setShowUserCard] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setCurrentUser(user);
        setCurrentUid(user.uid);
        setAuthReady(true);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    if (!window.confirm("Do you want to Sing Out?")) return;
    await signOut(auth);
    router.push("/login");
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="animate-spin text-blue-500" size={24} />
      </div>
    );
  }

  const tabs = [
    { id: "orders" as const, label: "Orders", icon: <LayoutDashboard size={15} /> },
    { id: "menu" as const, label: "Menu Management", icon: <UtensilsCrossed size={15} /> },
    { id: "qr" as const, label: "QR Codes", icon: <QrCode size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="bottom-right" />
      <nav className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
          <LayoutDashboard size={20} />
          <span>Kitchen Admin</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live Updates
            </span>
            <button onClick={() => queryClient.invalidateQueries()}
                className="hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                <RefreshCw size={16} />
            </button>

        {/* User Card */}
        <div className="relative">
            <button
            onClick={() => setShowUserCard((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                {currentUser?.displayName?.[0]?.toUpperCase() ?? currentUser?.email?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span className="text-sm text-gray-700 font-medium max-w-[120px] truncate">
                {currentUser?.displayName ?? currentUser?.email ?? "User"}
            </span>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${showUserCard ? "rotate-180" : ""}`} />
            </button>

        {showUserCard && (
        <>
            {/* backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setShowUserCard(false)} />
            {/* card */}
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {currentUser?.displayName?.[0]?.toUpperCase() ?? currentUser?.email?.[0]?.toUpperCase() ?? "?"}
                </div>
                    <div className="min-w-0">
                        {currentUser?.displayName && (
                        <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.displayName}</p>
                        )}
                        <p className="text-xs text-gray-400 truncate">{currentUser?.email}</p>
                    </div>
                    </div>
                </div>
                <div className="p-2">
                    <button
                    onClick={() => { setShowUserCard(false); handleLogout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                    <LogOut size={15} />
                    Logout
                    </button>
                </div>
                </div>
            </>
            )}
        </div>
    </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Manage orders and your restaurant menu</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-7 w-fit">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
        {activeTab === "orders" ? <OrdersTab /> :
         activeTab === "menu" ? <MenuTab /> :
         <QRTab uid={currentUid} />}
      </main>
    </div>
  );
}