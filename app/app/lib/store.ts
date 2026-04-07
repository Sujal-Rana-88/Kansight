import { create } from "zustand";
import { persist } from "zustand/middleware";

type UIState = {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  authToken: string | null;
  currentOrgId: string | null;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  setAuthToken: (token: string | null) => void;
  setCurrentOrgId: (orgId: string | null) => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: "light",
      authToken: null,
      currentOrgId: null,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebar: (open) => set({ sidebarOpen: open }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setTheme: (theme) => set({ theme }),
      setAuthToken: (token) => set({ authToken: token }),
      setCurrentOrgId: (orgId) => set({ currentOrgId: orgId }),
    }),
    { name: "kansight-ui" },
  ),
);
