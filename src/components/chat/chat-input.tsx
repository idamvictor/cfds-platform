import type * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground"
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      <Input
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="How can we help?"
        className="flex-1 bg-card border-card-foreground/10"
      />

      <Button
        onClick={onSend}
        size="icon"
        className="bg-primary text-primary-foreground"
        disabled={!value.trim()}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
