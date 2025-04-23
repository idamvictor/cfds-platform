import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChatInput } from '@/components/chat/chat-input';
import ChatMessageList from '@/components/chat/ChatMessageList';
import { useChat } from '@/hooks/useChat';
import useUserStore from '@/store/userStore';

/**
 * Live Chat page that provides real-time communication with support
 */
const LiveChat = () => {
    const [messageText, setMessageText] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const user = useUserStore(state => state.user);

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

    const handleSendMessage = async () => {
        if (!messageText.trim() && selectedFiles.length === 0) return;

        await sendMessage(messageText);
        setMessageText('');

        // Scroll to bottom after sending
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };


    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col h-[calc(100vh-120px)]">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Live Chat Support</h1>
                </div>

                <Card className="flex flex-col flex-1 overflow-hidden bg-card/50">
                    <CardContent className="flex flex-col h-full p-0">
                        <div className="flex-1 overflow-y-auto p-4">
                            {error && (
                                <div className="bg-red-500/20 text-red-500 p-4 mb-4 rounded-md">
                                    {error}
                                </div>
                            )}

                            <ChatMessageList
                                messages={messages}
                                currentUserId={user?.id || ''}
                                isLoading={isLoading}
                                onLoadMore={loadMoreMessages}
                                hasMoreMessages={hasMoreMessages}
                            />

                            <div ref={bottomRef} />
                        </div>

                        <div className="border-t border-border p-4">
                            <ChatInput
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onSend={handleSendMessage}
                                onFileSelect={addFile}
                                disabled={connectionStatus !== 'connected'}
                                selectedFiles={selectedFiles}
                                onFileRemove={removeFile}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LiveChat;
