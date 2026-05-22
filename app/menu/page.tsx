"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import {
  ShoppingBag,
  CheckCircle,
  Loader2,
  UtensilsCrossed,
  Plus,
  Minus,
} from "lucide-react";

const CATEGORIES_ORDER = [
  "Mains",
  "Pizza",
  "Salads",
  "Sides",
  "Desserts",
  "Drinks",
];

type MenuItem = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  category?: string;
  description?: string;
  image_url?: string;
};

export default function MenuPage() {
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [restaurantUid, setRestaurantUid] = useState<string | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [justOrdered, setJustOrdered] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTableNumber(params.get("table") || "?");
    setRestaurantUid(params.get("uid") || null);
  }, []);

  const {
    data: menuItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["menu", restaurantUid],
    queryFn: async () => {
      if (!restaurantUid) return [];
      const res = await fetch(`/api/menu?uid=${restaurantUid}`);
      if (!res.ok) throw new Error("Failed to load menu");
      return res.json();
    },
    enabled: !!restaurantUid,
  });

  const availableItems = menuItems.filter((item: MenuItem) => item.available);

  const categories = [
    "All",
    ...CATEGORIES_ORDER.filter((cat) =>
      availableItems.some((item: MenuItem) => item.category === cat)
    ),
  ];

  const filteredItems =
    activeCategory === "All"
      ? availableItems
      : availableItems.filter((item: MenuItem) => item.category === activeCategory);

  const grouped = filteredItems.reduce(
    (acc: Record<string, MenuItem[]>, item: MenuItem) => {
      const cat = item.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  const categoryOrder = CATEGORIES_ORDER.filter((c) => grouped[c]);
  const uncategorized = Object.keys(grouped).filter(
    (c) => !CATEGORIES_ORDER.includes(c)
  );
  const orderedCategories = [...categoryOrder, ...uncategorized];

  const cartCount = Object.values(cart).reduce((s: number, q: number) => s + q, 0);
  const cartTotal = availableItems.reduce((sum: number, item: MenuItem) => {
    return sum + (cart[item.id] || 0) * Number(item.price);
  }, 0);

  const addToCart = useCallback((itemId: string) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if ((next[itemId] || 0) <= 1) {
        delete next[itemId];
      } else {
        next[itemId] -= 1;
      }
      return next;
    });
  }, []);

  const orderMutation = useMutation({
    mutationFn: async () => {
      const cartItems = availableItems.filter((item: MenuItem) => cart[item.id] > 0);
      const requests = cartItems.flatMap((item: MenuItem) =>
        Array.from({ length: cart[item.id] }, () =>
          fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              table_number: tableNumber,
              item_name: item.name,
              restaurant_uid: restaurantUid,
            }),
          }).then((r) => {
            if (!r.ok) throw new Error("Order failed");
          })
        )
      );
      await Promise.all(requests);
    },
    onSuccess: () => {
      setCart({});
      setJustOrdered(true);
      setTimeout(() => setJustOrdered(false), 3000);
      toast.success("Order sent to kitchen! 🍽️", {
        description: "Your items are being prepared.",
        icon: <CheckCircle className="text-green-500" size={18} />,
      });
    },
    onError: () => toast.error("Couldn't place order. Please try again."),
  });

  if (!restaurantUid) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow text-center max-w-sm">
          <UtensilsCrossed size={40} className="text-amber-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">Invalid QR Code</p>
          <p className="text-gray-400 text-sm mt-1">
            Please scan the QR code at your table.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="text-amber-500 animate-spin" size={32} />
          <p className="text-gray-500 font-medium">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow text-center max-w-sm">
          <UtensilsCrossed size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-semibold">Menu unavailable</p>
          <p className="text-gray-400 text-sm mt-1">
            Please ask staff for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="bg-white border-b border-amber-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-sm mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 text-white p-2 rounded-xl">
              <UtensilsCrossed size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                QR Dining
              </p>
              <p className="font-bold text-gray-900 leading-tight">
                Table {tableNumber}
              </p>
            </div>
          </div>
          {cartCount > 0 && (
            <div className="flex items-center gap-2 bg-amber-500 text-white rounded-full px-3 py-1.5 text-sm font-bold shadow">
              <ShoppingBag size={15} />
              {cartCount} item{cartCount !== 1 ? "s" : ""} · ${cartTotal.toFixed(2)}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="max-w-sm mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-amber-50 text-gray-600 border border-amber-200 hover:bg-amber-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-sm mx-auto px-4 py-6 space-y-8 pb-36">
        {orderedCategories.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <UtensilsCrossed size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No items available</p>
          </div>
        ) : (
          orderedCategories.map((category) => (
            <div key={category}>
              <h2 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">
                {category}
              </h2>
              <div className="space-y-3">
                {grouped[category].map((item: MenuItem) => {
                  const qty = cart[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      {item.image_url && (
                        <div className="w-full h-55 overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4 flex items-end justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900">{item.name}</p>
                          {item.description && (
                            <p className="text-gray-400 text-sm mt-0.5 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <p className="text-amber-600 font-bold mt-1.5">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {qty === 0 ? (
                            <button
                              onClick={() => addToCart(item.id)}
                              className="bg-amber-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-amber-600 active:scale-95 shadow-sm transition-all flex items-center gap-1.5"
                            >
                              <Plus size={15} />
                              Add
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center hover:bg-amber-200 active:scale-95 transition-all"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-6 text-center font-bold text-gray-900 text-lg">
                                {qty}
                              </span>
                              <button
                                onClick={() => addToCart(item.id)}
                                className="w-9 h-9 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center hover:bg-amber-600 active:scale-95 transition-all shadow-sm"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sticky Place Order Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 shadow-2xl">
          <div className="max-w-sm mx-auto">
            <div className="mb-3 space-y-1 max-h-28 overflow-y-auto">
              {availableItems
                .filter((item: MenuItem) => cart[item.id] > 0)
                .map((item: MenuItem) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>
                      <span className="font-bold text-gray-900">{cart[item.id]}×</span>{" "}
                      {item.name}
                    </span>
                    <span className="font-semibold text-gray-800">
                      ${(cart[item.id] * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              <div className="border-t border-gray-100 pt-1 mt-1 flex justify-between text-sm font-bold text-gray-900">
                <span>Total</span>
                <span className="text-amber-600">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => orderMutation.mutate()}
              disabled={orderMutation.isPending || justOrdered}
              className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
                justOrdered
                  ? "bg-green-500 text-white"
                  : "bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]"
              } disabled:opacity-70`}
            >
              {orderMutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending to kitchen...
                </>
              ) : justOrdered ? (
                <>
                  <CheckCircle size={18} />
                  Order placed!
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Place Order · {cartCount} item{cartCount !== 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}