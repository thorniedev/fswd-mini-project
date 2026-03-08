"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/features/users/types";
import type { CartItem } from "@/features/cart/types";
import type { Product } from "@/features/products/types";

// ─── Auth Store
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });
        useCartStore.getState().syncForCurrentUser();
      },
      setUser: (user) => {
        set((state) => ({ ...state, user }));
        useCartStore.getState().syncForCurrentUser();
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        useCartStore.getState().syncForCurrentUser();
      },
    }),
    { name: "auth-store" }
  )
);

// ─── Cart Store
interface CartState {
  items: CartItem[];
  itemsByOwner: Record<string, CartItem[]>;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  syncForCurrentUser: () => void;
  total: () => number;
  count: () => number;
}

function getCartOwnerKey() {
  const auth = useAuthStore.getState();
  if (!auth.isAuthenticated || !auth.user || auth.user.role === "admin") {
    return null;
  }
  return String(auth.user.id);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemsByOwner: {},
      addItem: (product, quantity = 1) => {
        const ownerKey = getCartOwnerKey();
        if (!ownerKey) return;

        const ownerItems = get().itemsByOwner[ownerKey] ?? [];
        const existing = ownerItems.find((i) => i.product.id === product.id);
        const nextOwnerItems = existing
          ? ownerItems.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          : [
              ...ownerItems,
              { id: `cart-${product.id}-${Date.now()}`, product, quantity },
            ];

        set({
          items: nextOwnerItems,
          itemsByOwner: { ...get().itemsByOwner, [ownerKey]: nextOwnerItems },
        });
      },
      removeItem: (id) => {
        const ownerKey = getCartOwnerKey();
        if (!ownerKey) return;
        const nextOwnerItems = (get().itemsByOwner[ownerKey] ?? []).filter((i) => i.id !== id);
        set({
          items: nextOwnerItems,
          itemsByOwner: { ...get().itemsByOwner, [ownerKey]: nextOwnerItems },
        });
      },
      updateQuantity: (id, quantity) => {
        const ownerKey = getCartOwnerKey();
        if (!ownerKey) return;
        const ownerItems = get().itemsByOwner[ownerKey] ?? [];
        const nextOwnerItems =
          quantity <= 0
            ? ownerItems.filter((i) => i.id !== id)
            : ownerItems.map((i) => (i.id === id ? { ...i, quantity } : i));

        set({
          items: nextOwnerItems,
          itemsByOwner: { ...get().itemsByOwner, [ownerKey]: nextOwnerItems },
        });
      },
      clearCart: () => {
        const ownerKey = getCartOwnerKey();
        if (!ownerKey) {
          set({ items: [] });
          return;
        }
        set({
          items: [],
          itemsByOwner: { ...get().itemsByOwner, [ownerKey]: [] },
        });
      },
      syncForCurrentUser: () => {
        const ownerKey = getCartOwnerKey();
        if (!ownerKey) {
          set({ items: [] });
        } else {
          set({ items: get().itemsByOwner[ownerKey] ?? [] });
        }
      },
      total: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "cart-store",
      onRehydrateStorage: () => {
        return (state) => {
          state?.syncForCurrentUser();
        };
      },
    }
  )
);

// ─── UI Notification Store
type NotificationType = "success" | "error" | "info";

interface UiNotification {
  id: string;
  title: string;
  message?: string;
  type: NotificationType;
}

interface NotificationState {
  notifications: UiNotification[];
  pushNotification: (
    input: Omit<UiNotification, "id"> & { durationMs?: number }
  ) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  pushNotification: ({ durationMs = 3500, ...input }) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const item: UiNotification = { id, ...input };
    set((state) => ({ notifications: [item, ...state.notifications] }));
    window.setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, durationMs);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
