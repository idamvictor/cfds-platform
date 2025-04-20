
import { cn } from "@/lib/utils";
import useOnlineStatusStore from "@/store/OnlineStatusState.ts";


interface OnlineStatusProps {
    userId?: string;
    className?: string;
}

export function OnlineStatus({ userId, className }: OnlineStatusProps) {
    const isUserOnline = useOnlineStatusStore(state => state.isUserOnline);
    const isOnline = userId ? isUserOnline(userId) : false;

    return (
        <div
            className={cn(
                'w-2.5 h-2.5 rounded-full',
                isOnline ? 'bg-green-500' : 'bg-gray-400',
                className
            )}
        >
            {isOnline && (
                <div className="absolute top-0 left-0 w-full h-full rounded-full bg-green-500 animate-ping opacity-75" />
            )}
        </div>
    );
}
