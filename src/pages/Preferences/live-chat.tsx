import React, {  useState } from "react";
import { useChat } from "@/hooks/useChat";
import ChatMessageList from "@/components/chat/ChatMessageList";
import { ChatInput } from "@/components/chat/chat-input";
import { Loader2, AlertCircle } from "lucide-react";
import useUserStore from "@/store/userStore";

export default function LiveChat() {
    const user = useUserStore((state) => state.user);
    const {
        messages,
        isLoading,
        error,
        connectionStatus,
        sendMessage,
        loadMoreMessages,
        hasMoreMessages,
        selectedFiles,
        addFile,
        removeFile
    } = useChat();

    const [inputValue, setInputValue] = useState("");

    const handleSendMessage = () => {
        if (inputValue.trim() || selectedFiles.length > 0) {
            sendMessage(inputValue);
            setInputValue("");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleFileSelect = (file: File) => {
        addFile(file);
    };

    if (isLoading && messages.length === 0) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading conversation history...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="border border-border rounded-md h-[calc(100vh-200px)] flex flex-col bg-background shadow-sm overflow-hidden">
                <div className="px-6 py-4 hidden- flex border-b border-border bg-muted/20 justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold">Customer Support</h2>
                        <p className="text-sm text-muted-foreground">Our team is here to help you</p>
                    </div>
                    <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-border/40">
            <span
                className={`h-2.5 w-2.5 rounded-full ${
                    connectionStatus === "connected"
                        ? "bg-green-500"
                        : connectionStatus === "connecting"
                            ? "bg-yellow-500 animate-pulse"
                            : "bg-red-500"
                }`}
            />
                        <span className="text-xs text-muted-foreground">
              {connectionStatus === "connected"
                  ? "Connected"
                  : connectionStatus === "connecting"
                      ? "Connecting..."
                      : "Disconnected"}
            </span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {error && (
                        <div className="absolute top-0 left-0 right-0 m-4 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md flex items-start z-10">
                            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Connection Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className="px-6 flex-1 overflow-y-auto">
                        <ChatMessageList
                            messages={messages}
                            currentUserId={user?.id || ""}
                            isLoading={isLoading}
                            onLoadMore={loadMoreMessages}
                            hasMoreMessages={hasMoreMessages}
                        />
                    </div>

                    <div className="p-4 border-t border-border bg-background">
                        <ChatInput
                            value={inputValue}
                            onChange={handleInputChange}
                            onSend={handleSendMessage}
                            disabled={connectionStatus !== "connected"}
                            onFileSelect={handleFileSelect}
                            selectedFiles={selectedFiles}
                            onFileRemove={removeFile}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
