import { useLocation } from "react-router-dom";
import useDarkModeStore from "@/store/darkModeStore";

export const useMutedTextClass = (): string => {
  const location = useLocation();
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);

  // Default to dark theme for non-MT4 light routes
  if (!location.pathname.includes("/mt4-light")) {
    return "text-muted-foreground";
  }

  return isDarkMode ? "text-muted-foreground" : "text-muted";
};
