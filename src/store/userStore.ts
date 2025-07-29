import { create } from "zustand";

type UserState = {
  username: string | null;
  setUsername: (name: string | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
  username: null,
  setUsername: (name) => set({ username: name }),
}));
