import useDarkModeStore from "@/store/darkModeStore";

export const useMutedPlaceholderClass = (): string => {
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);
  return isDarkMode ? "placeholder-muted-foreground" : "placeholder-muted";
};
