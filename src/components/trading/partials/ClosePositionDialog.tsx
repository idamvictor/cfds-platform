import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Trade } from "@/store/tradeStore";

interface ClosePositionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedOrder: Trade | null;
    onConfirm: () => void;
}

export function ClosePositionDialog({
                                        open,
                                        onOpenChange,
                                        selectedOrder,
                                        onConfirm,
                                    }: ClosePositionDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-muted/90 border-none p-0">
                <div className="bg-muted/90 text-foreground rounded-md">
                    <div className="p-4 space-y-4">
                        <div className="text-center font-medium">
                            CLOSE POSITION #{selectedOrder?.id.substring(0, 8)}
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Are you sure to close the position{" "}
                            {selectedOrder?.trade_type.toUpperCase()}{" "}
                            {selectedOrder?.volume.toFixed(2)} {selectedOrder?.asset_symbol}?
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                className="w-full bg-red-500 hover:bg-red-600 text-white"
                                onClick={onConfirm}
                            >
                                Yes
                            </Button>
                            <Button
                                className="w-full bg-slate-600 hover:bg-slate-700 text-white"
                                onClick={() => onOpenChange(false)}
                            >
                                No
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ClosePositionDialog;
