import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessage } from "@/components/chat/chat-message";
import * as React from "react";

// Message type
type MessageRole = "agent" | "user";

interface Message {
    id: string;
    content: string;
    role: MessageRole;
    timestamp: string;
    attachment?: {
        type: string;
        name: string;
    };
}

export default function LiveChat() {
    const [messages, setMessages] = React.useState<Message[]>([
        {
            id: "msg-1",
            content: "",
            role: "agent",
            timestamp: "6/18/2024, 12:07:32 PM",
            attachment: {
                type: "pdf",
                name: "PDF attachment",
            },
        },
        {
            id: "msg-2",
            content:
                "You can make a transfer using these bank details and confirm that the funds have been credited to your trading account immediately upon submitting your successful transfer receipt.",
            role: "agent",
            timestamp: "6/18/2024, 12:08:01 PM",
        },
        {
            id: "msg-3",
            content: "Hello there,",
            role: "user",
            timestamp: "10/18/2024, 3:52:17 PM",
        },
        {
            id: "msg-4",
            content: "I just want why my account is not trading last few weeks?",
            role: "user",
            timestamp: "10/18/2024, 3:52:30 PM",
        },
    ]);

    const [newMessage, setNewMessage] = React.useState("");

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: `msg-${messages.length + 1}`,
            content: newMessage,
            role: "user",
            timestamp: new Date().toLocaleString(),
        };

        setMessages([...messages, message]);
        setNewMessage("");

        // Simulate agent response after a delay
        setTimeout(() => {
            const response: Message = {
                id: `msg-${messages.length + 2}`,
                content:
                    "Thank you for your inquiry. Let me check your account status and get back to you shortly.",
                role: "agent",
                timestamp: new Date().toLocaleString(),
            };

            setMessages((prev) => [...prev, response]);
        }, 2000);
    };

    // Scroll to bottom when messages change
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <div className="p-4 border-b border-border">
                <h1 className="text-2xl font-bold text-center">LIVE CHAT</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border">
                <ChatInput
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onSend={handleSendMessage}
                />
            </div>
        </div>
    );
}
