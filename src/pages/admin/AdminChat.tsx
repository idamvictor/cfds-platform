import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Loader2, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useOnlineStatusStore from "@/store/OnlineStatusState";
import useUserStore from "@/store/userStore";
import axiosInstance from "@/lib/axios";
import { useChat } from "@/hooks/useChat";
import ChatMessageList from "@/components/chat/ChatMessageList";
import { ChatInput } from "@/components/chat/chat-input";

interface ChatUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    account_id: string;
    last_activity?: string;
    unread_count?: number;
}

export default function AdminChat() {
    // State for users and selection
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [selectedTab, setSelectedTab] = useState<"all" | "online" | "unread">("all");
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
    const [messageText, setMessageText] = useState("");

    // Current admin user
    const currentUser = useUserStore((state) => state.user);

    // Online status store
    const isUserOnline = useOnlineStatusStore(state => state.isUserOnline);
    const startHeartbeat = useOnlineStatusStore(state => state.startHeartbeat);

    // Chat functionality using the updated hook
    const {
        messages,
        sendMessage,
        isLoading: chatLoading,
        error: chatError,
        loadMoreMessages,
        hasMoreMessages,
        connectionStatus,
        selectedFiles,
        addFile,
        removeFile
    } = useChat(selectedUser?.id);

    // Start heartbeat to track online users
    useEffect(() => {
        startHeartbeat();
    }, [startHeartbeat]);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoadingUsers(true);
            try {
                // Get all users (you can add custom endpoint for admin if needed)
                const response = await axiosInstance.get("/admin/users");
                if (response.data && Array.isArray(response.data.data)) {
                    setUsers(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setIsLoadingUsers(false);
            }
        };

        fetchUsers();

        // Set up a polling interval to refresh users
        const intervalId = setInterval(fetchUsers, 30000); // every 30 seconds

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    // Filter users based on search and tab
    const filteredUsers = users.filter(user => {
        // Search filter
        const matchesSearch = searchQuery === "" ||
            user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.account_id.toLowerCase().includes(searchQuery.toLowerCase());

        // Tab filter
        let matchesTab = true;
        if (selectedTab === "online") {
            matchesTab = isUserOnline(user.id);
        } else if (selectedTab === "unread") {
            matchesTab = (user.unread_count || 0) > 0;
        }

        return matchesSearch && matchesTab;
    });

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!messageText.trim() && selectedFiles.length === 0) return;
        if (!selectedUser) return;

        try {
            await sendMessage(messageText);
            setMessageText("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-90px)]">
            <Card className="flex-1 flex overflow-hidden">
                <CardContent className="p-0 flex h-full w-full">
                    {/* Left sidebar - User list */}
                    <div className="w-80 border-r border-border flex flex-col h-full">
                        <div className="p-3 border-b border-border space-y-3">
                            <div className="text-lg font-semibold">Admin Chat</div>
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
                            {isLoadingUsers ? (
                                <div className="flex justify-center items-center h-full">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                                    <MessageCircle className="h-10 w-10 mb-2" />
                                    <p className="text-center">No users found</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {filteredUsers.map(user => (
                                        <div
                                            key={user.id}
                                            className={`flex items-center p-3 cursor-pointer hover:bg-slate-700/30 ${
                                                selectedUser?.id === user.id ? 'bg-slate-700/50' : ''
                                            }`}
                                            onClick={() => setSelectedUser(user)}
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

                    {/* Right side - Chat area */}
                    <div className="flex-1 flex flex-col h-full">
                        {selectedUser ? (
                            <>
                                {/* Selected user header */}
                                <div className="p-3 border-b border-border flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage src={selectedUser.avatar} alt={`${selectedUser.first_name} ${selectedUser.last_name}`} />
                                            <AvatarFallback className="bg-slate-700">
                                                {selectedUser.first_name[0]}{selectedUser.last_name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-sm font-medium">
                                                {selectedUser.first_name} {selectedUser.last_name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {isUserOnline(selectedUser.id) ? 'Online' : 'Offline'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        ID: {selectedUser.account_id}
                                    </div>
                                </div>

                                {/* Chat messages */}
                                <div className="flex-1 overflow-hidden p-4">
                                    {chatLoading && messages.length === 0 ? (
                                        <div className="flex justify-center items-center h-full">
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : (
                                        <ChatMessageList
                                            messages={messages}
                                            currentUserId={currentUser?.id || ""}
                                            isLoading={chatLoading}
                                            onLoadMore={loadMoreMessages}
                                            hasMoreMessages={hasMoreMessages}
                                        />
                                    )}
                                </div>

                                {/* Chat input */}
                                <div className="p-3 border-t border-border">
                                    <ChatInput
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onSend={handleSendMessage}
                                        disabled={connectionStatus !== "connected"}
                                        onFileSelect={addFile}
                                        selectedFiles={selectedFiles}
                                        onFileRemove={removeFile}
                                    />
                                    {chatError && (
                                        <div className="mt-2 text-xs text-destructive">
                                            {chatError}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                                <MessageCircle className="h-16 w-16 mb-4" />
                                <h3 className="text-xl font-medium mb-2">Select a user to start chatting</h3>
                                <p className="text-center max-w-md">
                                    Choose a user from the list on the left to view their conversation and send messages.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
