
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WireTransferConfirmationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isSubmitting: boolean;
    isCard: boolean;
}

export function WireTransferConfirmationModal({
                                                  open,
                                                  isCard = false,
                                                  onConfirm,
                                                    isSubmitting,
                                                  onOpenChange,
                                              }: WireTransferConfirmationModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-white/[0.08] bg-[#0f1220]/90 shadow-[0_24px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                <DialogHeader className="flex flex-col items-center gap-3 pt-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF9800]/20 bg-[#FF9800]/10 shadow-[0_0_20px_rgba(255,152,0,0.1)]">
                        <AlertCircle className="h-7 w-7 text-[#FF9800]" />
                    </div>
                    <DialogTitle className="text-center text-base font-extrabold text-white">Maintenance Notice</DialogTitle>
                </DialogHeader>

                <div className="text-center px-4 py-4">
                    { isCard ? (
                        <p className="text-sm leading-relaxed text-[#8b97a8]">
                            Our bank deposit server is currently down for maintenance. To avoid any delays, we strongly recommend processing your deposit via <span className="font-bold text-[#00dfa2]">cryptocurrency</span>.
                            This will ensure faster and smoother transactions.
                        </p>
                    ) : (
                        <p className="text-sm leading-relaxed text-[#8b97a8]">
                            Our bank withdrawal server is currently down for maintenance. To avoid any delays, we
                            strongly recommend processing your withdrawal via <span className="font-bold text-[#00dfa2]">cryptocurrency</span>. This will ensure faster
                            and smoother transactions.
                        </p>
                    )}

                </div>

                <DialogFooter className="flex justify-center gap-3 pb-1">
                    <Button
                        variant="outline"
                        className="rounded-xl border-white/[0.08] bg-[#131a28] text-[#8b97a8] transition-all duration-200 hover:border-white/[0.14] hover:bg-[#1a2438] hover:text-white"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    { isCard ? (
                        <Button
                            className="rounded-xl bg-gradient-to-br from-[#FF9800] to-[#e65100] font-bold text-white shadow-[0_4px_16px_rgba(255,152,0,0.25)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(255,152,0,0.35)]"
                            onClick={onConfirm}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : "Continue Anyway"}
                        </Button>
                    ) : null}

                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
