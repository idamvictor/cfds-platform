// import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import useSiteSettingsStore from "@/store/siteSettingStore";
import { useNavigate } from "react-router-dom";
import useDarkModeStore from "@/store/darkModeStore";
import useUserStore from "@/store/userStore";

export function TitleBar() {
  const settings = useSiteSettingsStore((state) => state.settings);
  const isDarkMode = useDarkModeStore((state) => state.isDarkMode);
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const unreadNotifications =
    user?.notifications.filter((n) => !n.read_at).length || 0;
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-slate-800 border-slate-600"
          : "bg-white border-slate-400"
      } border-b px-4 py-1 flex items-center justify-between`}
    >
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-600 rounded-sm flex items-center justify-center">
          <span className="text-white text-xs">📊</span>
        </div>
        <span
          className={`${
            isDarkMode ? "text-slate-200" : "text-slate-800"
          } text-xs font-medium`}
        >
          {settings?.name || "Demo Account"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Sun
          className={`h-4 w-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
        />
        <Switch
          checked={isDarkMode}
          onCheckedChange={() => useDarkModeStore.getState().toggleDarkMode()}
          className="data-[state=checked]:bg-slate-600"
        />
        <Moon
          className={`h-4 w-4 ${isDarkMode ? "text-slate-300" : "text-slate-400"}`}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.avatar}
                  alt={`${user?.first_name} ${user?.last_name}`}
                />
                <AvatarFallback>
                  {user ? `${user.first_name[0]}${user.last_name[0]}` : "U"}
                </AvatarFallback>
              </Avatar>
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-2 -right-2 rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white">
                  {unreadNotifications}
                </Badge>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={`w-40 ${
              isDarkMode
                ? "bg-slate-800 border-slate-600"
                : "bg-white border-slate-300"
            }`}
          >
            <DropdownMenuItem
              onClick={handleLogout}
              className={`cursor-pointer flex items-center gap-2 ${
                isDarkMode
                  ? "hover:bg-slate-700 text-slate-200"
                  : "hover:bg-slate-100 text-slate-900"
              }`}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 ${
            isDarkMode
              ? "hover:bg-slate-700 text-slate-300"
              : "hover:bg-slate-300 text-slate-600"
          }`}
        >
          <Minimize2 className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 ${
            isDarkMode
              ? "hover:bg-slate-700 text-slate-300"
              : "hover:bg-slate-300 text-slate-600"
          }`}
        >
          <Square className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 hover:bg-red-500 hover:text-white ${
            isDarkMode ? "text-slate-300" : "text-slate-600"
          }`}
          onClick={() => navigate("/main/dashboard")}
        >
          <X className="h-3 w-3" />
        </Button> */}
      </div>
    </div>
  );
}
