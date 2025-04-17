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
            <div className="flex items-center justify-center h-[calc(100vh-150px)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-4">
            <div className="border border-border rounded-md h-[calc(100vh-150px)] flex flex-col bg-background">
                <div className="px-4 py-3 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">Support Chat</h2>
                    <div className="flex items-center">
            <span
                className={`h-2.5 w-2.5 rounded-full mr-2 ${
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

                <div className="flex-1 flex flex-col px-4 overflow-hidden">
                    {error && (
                        <div className="bg-red-500/10 text-red-500 p-3 rounded-md my-3 flex items-start">
                            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <ChatMessageList
                        messages={messages}
                        currentUserId={user?.id || ""}
                        isLoading={isLoading}
                        onLoadMore={loadMoreMessages}
                        hasMoreMessages={hasMoreMessages}
                    />

                    <div className="mt-auto pt-3 border-t border-border">
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
