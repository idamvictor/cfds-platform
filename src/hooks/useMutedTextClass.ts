import useDarkModeStore from "@/store/darkModeStore";

export const useMutedTextClass = (): string => {
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);
  return isDarkMode ? "text-muted-foreground" : "text-muted";
};
