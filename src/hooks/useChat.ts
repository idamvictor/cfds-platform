import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import useUserStore from '@/store/userStore';
import type { AxiosError } from 'axios';

export interface MessageAttachment {
    id: string;
    message_id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    created_at: string;
    updated_at: string;
    download_url: string;
}

export interface ChatMessage {
    id: string;
    message: string;
    sender_id: string;
    receiver_id: string | null;
    is_admin: boolean;
    read_at: string | null;
    created_at: string;
    attachments: MessageAttachment[];
    sender?: {
        id: string;
        first_name: string;
        last_name: string;
        avatar: string;
    };
}

interface MessageSentEvent { message: ChatMessage }
interface MessageReadEvent { message_id: string }

interface MessagesPaginatedResponse {
    data: ChatMessage[];
    next_page_url: string | null;
    prev_page_url: string | null;
    first_page_url: string;
    last_page_url: string;
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
}

interface MessageCreatedResponse {
    success: boolean;
    data: ChatMessage;
}

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

interface SelectedFile {
    file: File;
    preview?: string;
    uploading: boolean;
    progress: number;
    error?: string;
}

interface ChatHook {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    connectionStatus: ConnectionStatus;
    sendMessage: (message: string, file?: File) => Promise<void>;
    loadMoreMessages: () => Promise<void>;
    hasMoreMessages: boolean;
    uploadFile: (file: File) => Promise<string>;
    selectedFiles: SelectedFile[];
    addFile: (file: File) => void;
    removeFile: (index: number) => void;
}

export function useChat(): ChatHook {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
    const [page, setPage] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
    const user = useUserStore(state => state.user);

    const fetchMessages = useCallback(async (pageToFetch = 1) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axiosInstance.get<MessagesPaginatedResponse>(
                `/chat/messages?page=${pageToFetch}`
            );
            const incoming = response.data.data;

            if (pageToFetch === 1) {
                setMessages(incoming);
            } else {
                setMessages(prev => [...incoming, ...prev]);
            }

            setHasMoreMessages(!!response.data.next_page_url);
            setPage(pageToFetch);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const msg = axiosErr.response?.data?.message || 'Failed to load messages.';
            setError(msg);
            setConnectionStatus('disconnected');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = useUserStore.getState().token;
        if (!token) {
            setConnectionStatus('disconnected');
            setError('Authentication required.');
            setIsLoading(false);
            return;
        }

        if (!window.Echo) {
            window.Pusher = Pusher;
            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: import.meta.env.VITE_PUSHER_APP_KEY,
                cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
                forceTLS: true,
                authEndpoint: '/broadcasting/auth',
                auth: {
                    headers: { Authorization: `Bearer ${token}` },
                },
            });
        }

        if (user) {
            const channel = window.Echo.private(`chat.user.${user.id}`);

            channel
                .listen('.message.sent', (e: MessageSentEvent) => {
                    setMessages(prev => [...prev, e.message]);
                })
                .listen('.message.read', (e: MessageReadEvent) => {
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === e.message_id
                                ? { ...msg, read_at: new Date().toISOString() }
                                : msg
                        )
                    );
                });

            setConnectionStatus('connected');
        }

        fetchMessages();

        return () => {
            window.Echo?.disconnect();
        };
    }, [user?.id, fetchMessages]);

    const loadMoreMessages = useCallback(async () => {
        if (!hasMoreMessages || isLoading) return;
        await fetchMessages(page + 1);
    }, [hasMoreMessages, isLoading, page, fetchMessages]);

    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const idx = selectedFiles.findIndex(f => f.file === file);

        try {
            const response = await axiosInstance.post<{ url: string }>('/chat/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: ev => {
                    if (ev.total && idx !== -1) {
                        const pct = Math.round((ev.loaded * 100) / ev.total);
                        setSelectedFiles(prev => {
                            const up = [...prev];
                            up[idx].progress = pct;
                            return up;
                        });
                    }
                },
            });
            return response.data.url;
        } catch (err) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const msg = axiosErr.response?.data?.message || 'Failed to upload file.';
            if (idx !== -1) {
                setSelectedFiles(prev => {
                    const up = [...prev];
                    up[idx].error = msg;
                    up[idx].uploading = false;
                    return up;
                });
            }
            throw new Error(msg);
        }
    };

    const addFile = (file: File) => {
        let preview: string | undefined;
        if (file.type.startsWith('image/')) {
            preview = URL.createObjectURL(file);
        }
        setSelectedFiles(prev => [
            ...prev,
            { file, preview, uploading: false, progress: 0 },
        ]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => {
            const up = [...prev];
            if (up[index].preview) URL.revokeObjectURL(up[index].preview!);
            up.splice(index, 1);
            return up;
        });
    };

    const sendMessage = async (message: string, file?: File) => {
        if (!user) {
            setError('You must be logged in to send messages.');
            return;
        }
        if (!message.trim() && !file && selectedFiles.length === 0) {
            return;
        }

        try {
            let attachments: string[] = [];

            if (file) {
                attachments.push(await uploadFile(file));
            } else if (selectedFiles.length) {
                setSelectedFiles(prev => prev.map(f => ({ ...f, uploading: true, progress: 0 })));
                attachments = await Promise.all(selectedFiles.map(f => uploadFile(f.file)));
                setSelectedFiles([]);
            }

            const response = await axiosInstance.post<MessageCreatedResponse>(
                '/chat/messages',
                { message, attachments }
            );
            setMessages(prev => [...prev, response.data.data]);
        } catch (err) {
            const axiosErr = err as AxiosError<{ message: string }>;
            const msg = axiosErr.response?.data?.message || 'Failed to send message.';
            setError(msg);
        }
    };

    return {
        messages,
        isLoading,
        error,
        connectionStatus,
        sendMessage,
        loadMoreMessages,
        hasMoreMessages,
        uploadFile,
        selectedFiles,
        addFile,
        removeFile,
    };
}
