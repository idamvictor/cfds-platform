
import LiveChatIframe from "@/components/chat/LiveChatIframe.tsx";

export default function LiveChat() {


  return (
    <div className=" h-screen bg-background text-foreground">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-center">LIVE CHAT</h1>
      </div>

      <LiveChatIframe />
    </div>
  );
}
