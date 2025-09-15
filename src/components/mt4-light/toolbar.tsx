import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Play } from "lucide-react";
import useUserStore from "@/store/userStore";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TradingInterface } from "../mt4/trading-interface-copy";

export function Toolbar() {
  const user = useUserStore((state) => state.user);
  const unreadNotifications =
    user?.notifications.filter((n) => !n.read_at).length || 0;
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  return (
    <div className="bg-white border-b border-slate-300 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <DropdownMenu
          open={isTradeModalOpen}
          onOpenChange={setIsTradeModalOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white border-blue-300 text-slate-700 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" />
              New Order
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0 bg-white w-[250px] border border-slate-300 shadow-lg">
            <TradingInterface />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <Play className="h-6 w-6 text-green-600 fill-green-600" />
        <span className="text-sm text-slate-700 font-medium">Auto Trading</span>
        <div className="relative">
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
      </div>
    </div>
  );
}
