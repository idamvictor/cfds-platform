import { Loader2 } from "lucide-react";

export function LoadingScreen() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">
            <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-muted/20 border border-border shadow-sm max-w-md">
                <div className="relative mb-6">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 bg-background rounded-full flex items-center justify-center">
                            <div className="h-6 w-6 bg-accent rounded-md flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-background"
                                >
                                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                                    <polyline points="16 7 22 7 22 13"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-semibold mb-2">Loading</h2>
                <p className="text-center text-muted-foreground">
                    Please wait while we set up the trading platform...
                </p>
            </div>
        </div>
    );
}
