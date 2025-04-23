import { useState, useEffect, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, MessageCircle } from "lucide-react";
import useOnlineStatusStore from "@/store/OnlineStatusState";
import axiosInstance from "@/lib/axios";

export interface ChatUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    account_id: string;
    last_activity?: string;
    unread_count?: number;
}

interface UserChatListProps {
    onSelectUser: (user: ChatUser) => void;
    selectedUserId?: string;
}

export default function UserChatList({ onSelectUser, selectedUserId }: UserChatListProps) {
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<"all" | "online" | "unread">("all");

    // Online status store
    const isUserOnline = useOnlineStatusStore(state => state.isUserOnline);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get("/admin/users");
                if (response.data && Array.isArray(response.data.data)) {
                    setUsers(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();

        // Set up a polling interval to refresh users and unread counts
        const intervalId = setInterval(fetchUsers, 30000); // every 30 seconds

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // Filter users based on search query and tab
    const filteredUsers = useMemo(() => {
        let result = [...users];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                user =>
                    user.first_name.toLowerCase().includes(query) ||
                    user.last_name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.account_id.toLowerCase().includes(query)
            );
        }

        // Apply tab filter
        if (selectedTab === "online") {
            result = result.filter(user => isUserOnline(user.id));
        } else if (selectedTab === "unread") {
            result = result.filter(user => (user.unread_count || 0) > 0);
        }

        return result;
    }, [searchQuery, selectedTab, users, isUserOnline]);

    // Handle selecting a user
    const handleSelectUser = (user: ChatUser) => {
        onSelectUser(user);
    };

    return (
        <div className="flex flex-col h-full border-r border-border">
            <div className="p-3 border-b border-border space-y-3">
                <div className="text-lg font-semibold">Users</div>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Tabs
                    value={selectedTab}
                    onValueChange={(value) => setSelectedTab(value as "all" | "online" | "unread")}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-3 h-8">
                        <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                        <TabsTrigger value="online" className="text-xs">Online</TabsTrigger>
                        <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                        <MessageCircle className="h-10 w-10 mb-2" />
                        <p className="text-center">No users found matching your filters</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {filteredUsers.map(user => (
                            <div
                                key={user.id}
                                className={`flex items-center p-3 cursor-pointer hover:bg-slate-700/30 ${selectedUserId === user.id ? 'bg-slate-700/50' : ''}`}
                                onClick={() => handleSelectUser(user)}
                            >
                                <div className="relative">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
                                        <AvatarFallback className="bg-slate-700">
                                            {user.first_name[0]}{user.last_name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isUserOnline(user.id) && (
                                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                                    )}
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium truncate">
                                            {user.first_name} {user.last_name}
                                        </div>
                                        {user.unread_count && user.unread_count > 0 && (
                                            <Badge variant="destructive" className="ml-2">
                                                {user.unread_count}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {user.account_id} • {user.email}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
