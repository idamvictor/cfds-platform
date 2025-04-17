import type * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Loader2, X } from "lucide-react";
import { useState, useRef } from "react";

export interface FileUpload {
    file: File;
    preview?: string;
    uploading: boolean;
    progress: number;
    error?: string;
}

interface ChatInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSend: () => void;
    onFileSelect?: (file: File) => void;
    disabled?: boolean;
    selectedFiles?: FileUpload[];
    onFileRemove?: (index: number) => void;
}

export function ChatInput({
                              value,
                              onChange,
                              onSend,
                              onFileSelect,
                              disabled = false,
                              selectedFiles = [],
                              onFileRemove,
                          }: ChatInputProps) {
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if ((!value.trim() && selectedFiles.length === 0) || disabled || isSending) return;

        setIsSending(true);
        try {
            await onSend();
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && onFileSelect) {
            onFileSelect(files[0]);
            // Reset file input so the same file can be selected again
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-2">
            {/* File preview area */}
            {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="relative bg-muted/50 rounded-md p-2 pr-8 flex items-center text-xs"
                        >
                            <div className="max-w-[150px] truncate">
                                {file.file.name}
                            </div>
                            {file.uploading && (
                                <div className="ml-2 text-primary text-xs">
                                    {file.progress}%
                                </div>
                            )}
                            {file.error && (
                                <div className="ml-2 text-destructive text-xs">
                                    Error
                                </div>
                            )}
                            <button
                                type="button"
                                className="absolute right-1 top-1 text-muted-foreground hover:text-foreground"
                                onClick={() => onFileRemove?.(index)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    disabled={disabled}
                    onClick={handleFileClick}
                >
                    <Paperclip className="h-5 w-5" />
                </Button>

                <Input
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    placeholder={disabled ? "Reconnecting..." : "How can we help?"}
                    className="flex-1 bg-card border-card-foreground/10"
                    disabled={disabled || isSending}
                />

                <Button
                    onClick={onSend}
                    size="icon"
                    className="bg-primary text-primary-foreground"
                    disabled={(!value.trim() && selectedFiles.length === 0) || disabled || isSending}
                    type="submit"
                >
                    {isSending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <Send className="h-5 w-5" />
                    )}
                </Button>
            </form>
        </div>
    );
}
