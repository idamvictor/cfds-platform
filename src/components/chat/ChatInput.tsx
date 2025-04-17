import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, PaperPlaneIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSend: () => void;
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
                                                 value,
                                                 onChange,
                                                 onSend,
                                                 disabled = false
                                             }) => {
    const [isSending, setIsSending] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!value.trim() || disabled || isSending) return;

        setIsSending(true);
        try {
            await onSend();
        } finally {
            setIsSending(false);
            // Focus back on textarea after sending
            textareaRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Send message with Enter key (without shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "flex items-end gap-2 pt-2 mt-auto border-t border-border",
                disabled && "opacity-80"
            )}
        >
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder={disabled ? "Reconnecting..." : "Type your message..."}
                className="min-h-[60px] max-h-[120px] resize-none bg-background focus-visible:ring-1 focus-visible:ring-primary"
                disabled={disabled || isSending}
            />

            <div className="flex gap-2">
                <Button
                    type="submit"
                    size="icon"
                    className={cn(
                        "h-10 w-10 rounded-full bg-primary text-primary-foreground transition-all",
                        (disabled || !value.trim() || isSending) && "opacity-50 cursor-not-allowed",
                        !disabled && value.trim() && !isSending && "hover:scale-105"
                    )}
                    disabled={disabled || !value.trim() || isSending}
                >
                    {isSending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <PaperPlaneIcon className="h-5 w-5" />
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ChatInput;
