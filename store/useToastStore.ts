import { create } from "zustand";

export interface Toast {
  id: number;
  message: string;
}

let counter = 0;

interface ToastState {
  toasts: Toast[];
  push: (message: string) => void;
  remove: (id: number) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message) => {
    const id = ++counter;
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 2200);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
