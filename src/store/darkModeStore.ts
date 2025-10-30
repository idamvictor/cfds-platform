import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DarkModeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const useDarkModeStore = create<DarkModeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          // Optionally update body class for global styling if needed
          if (newDarkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { isDarkMode: newDarkMode };
        }),
    }),
    {
      name: "dark-mode-storage", // unique name for localStorage key
    }
  )
);

export default useDarkModeStore;
