import useDarkModeStore from "@/store/darkModeStore";

export const useStepNumberColor = (): string => {
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);
  return isDarkMode ? "text-muted-foreground" : "text-foreground";
};
