import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, MessageAttachment } from '@/hooks/useChat';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, FileText, Image as ImageIcon, Download, File } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatMessageListProps {
    messages: ChatMessage[];
    currentUserId: string;
    isLoading: boolean;
    onLoadMore: () => Promise<void>;
    hasMoreMessages: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
                                                             messages,
                                                             currentUserId,
                                                             isLoading,
                                                             onLoadMore,
                                                             hasMoreMessages
                                                         }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [userScrolled, setUserScrolled] = useState(false);
    const loadTriggerRef = useRef<HTMLDivElement>(null);
    const [loadingMore, setLoadingMore] = useState(false);

    // Scroll to bottom on initial load and new messages (if user hasn't scrolled up)
    useEffect(() => {
        if (messages.length > 0 && messagesEndRef.current && !userScrolled) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, userScrolled]);

    // Setup scroll event listener to detect when user scrolls up
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            // If user scrolls up more than 100px, consider it intentional
            const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
            setUserScrolled(!isAtBottom);

            // Check if we've scrolled near the top to load more messages
            if (container.scrollTop < 100 && hasMoreMessages && !loadingMore) {
                loadMoreMessages();
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [hasMoreMessages, loadingMore]);

    // Load more messages when scrolling to the top
    const loadMoreMessages = async () => {
        if (loadingMore || !hasMoreMessages) return;

        setLoadingMore(true);
        try {
            await onLoadMore();
        } finally {
            setLoadingMore(false);
        }
    };

    // Format time from ISO string
    const formatMessageTime = (dateString: string) => {
        try {
            return format(new Date(dateString), 'h:mm a');
        } catch (error) {
            console.log('err', error)
            return '';
        }
    };

    // Group messages by date
    const groupMessagesByDate = (msgs: ChatMessage[]) => {
        const groups: { [key: string]: ChatMessage[] } = {};

        msgs.forEach(message => {
            const date = format(new Date(message.created_at), 'MMM d, yyyy');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
        });

        return groups;
    };

    // Get file icon based on type
    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) {
            return <ImageIcon className="h-4 w-4" />;
        } else if (fileType === 'application/pdf') {
            return <FileText className="h-4 w-4" />;
        } else {
            return <File className="h-4 w-4" />;
        }
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Render attachment
    const renderAttachment = (attachment: MessageAttachment) => {
        const isImage = attachment.file_type.startsWith('image/');

        if (isImage) {
            return (
                <div className="relative mt-2 rounded-md overflow-hidden max-w-xs">
                    <a
                        href={attachment.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <img
                            src={attachment.download_url}
                            alt={attachment.file_name}
                            className="max-w-full h-auto max-h-40 object-contain"
                        />
                    </a>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 flex items-center justify-between">
                        <span className="truncate mr-2">{attachment.file_name}</span>
                        <a
                            href={attachment.download_url}
                            download={attachment.file_name}
                            className="p-1 hover:bg-white/20 rounded"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Download className="h-3 w-3" />
                        </a>
                    </div>
                </div>
            );
        }

        return (
            <div className="mt-2">
                <a
                    href={attachment.download_url}
                    download={attachment.file_name}
                    className="flex items-center gap-2 p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"
                >
                    {getFileIcon(attachment.file_type)}
                    <div className="flex-1 min-w-0">
                        <div className="text-xs truncate font-medium">{attachment.file_name}</div>
                        <div className="text-xs text-muted-foreground">{formatFileSize(attachment.file_size)}</div>
                    </div>
                    <Download className="h-4 w-4 flex-shrink-0" />
                </a>
            </div>
        );
    };

    const messageGroups = groupMessagesByDate(messages);

    // Render empty state if no messages
    if (messages.length === 0 && !isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-muted-foreground">No messages yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Start a conversation by typing a message below</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto space-y-4 py-4"
            style={{ scrollbarWidth: 'thin' }}
        >
            {/* Loading indicator for infinite scroll */}
            {loadingMore && (
                <div className="flex justify-center p-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            )}

            {/* Load more trigger */}
            <div ref={loadTriggerRef} />

            {/* Messages by date */}
            {Object.entries(messageGroups).map(([date, dateMessages]) => (
                <div key={date} className="space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                            {date}
                        </div>
                    </div>

                    {dateMessages.map((message) => {
                        const isCurrentUser = message.sender_id === currentUserId;
                        const isAdmin = message.is_admin;
                        const hasAttachments = message.attachments && message.attachments.length > 0;

                        return (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex gap-3 max-w-[85%]",
                                    isCurrentUser ? "ml-auto" : "mr-auto"
                                )}
                            >
                                {!isCurrentUser && (
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                        <AvatarImage src={message.sender?.avatar} alt={message.sender?.first_name} />
                                        <AvatarFallback className={isAdmin ? "bg-blue-500" : "bg-primary"}>
                                            {isAdmin ? "A" : message.sender?.first_name?.[0] || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div className={cn("space-y-1", isCurrentUser && "text-right")}>
                                    <div className="flex flex-col">
                                        {message.message && (
                                            <div className={cn(
                                                "p-3 rounded-lg inline-block",
                                                isCurrentUser
                                                    ? "bg-primary text-primary-foreground ml-auto"
                                                    : isAdmin
                                                        ? "bg-blue-600 text-blue-50"
                                                        : "bg-muted text-foreground mr-auto"
                                            )}>
                                                <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                                            </div>
                                        )}

                                        {/* Render attachments */}
                                        {hasAttachments && (
                                            <div className={cn("space-y-1", isCurrentUser ? "items-end ml-auto" : "items-start mr-auto")}>
                                                {message.attachments.map((attachment) => (
                                                    <div key={attachment.id} className={isCurrentUser ? "ml-auto" : "mr-auto"}>
                                                        {renderAttachment(attachment)}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        {!isCurrentUser && !isAdmin && (
                                            <span className="font-medium">
                        {message.sender?.first_name} {message.sender?.last_name}
                      </span>
                                        )}
                                        {!isCurrentUser && isAdmin && (
                                            <span className="font-medium">Support Agent</span>
                                        )}
                                        <span>{formatMessageTime(message.created_at)}</span>
                                        {isCurrentUser && message.read_at && (
                                            <span className="text-primary">• Read</span>
                                        )}
                                    </div>
                                </div>

                                {isCurrentUser && (
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                        <AvatarImage src={message.sender?.avatar} alt={message.sender?.first_name} />
                                        <AvatarFallback className="bg-primary">
                                            {message.sender?.first_name?.[0] || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}

            {/* For auto-scrolling to the latest message */}
            <div ref={messagesEndRef} />

            {/* Jump to bottom button */}
            {userScrolled && messages.length > 0 && (
                <button
                    className="fixed bottom-24 right-6 bg-primary text-primary-foreground rounded-full p-2 shadow-lg z-10"
                    onClick={() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                        setUserScrolled(false);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ChatMessageList;
