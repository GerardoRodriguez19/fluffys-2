import { create } from "zustand";
import type { User } from "firebase/auth";

interface AuthStore {
  user: User | null;
  ready: boolean;
  setUser(user: User | null): void;
  setReady(ready: boolean): void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  ready: false,
  setUser: (user) => set({ user }),
  setReady: (ready) => set({ ready }),
}));
