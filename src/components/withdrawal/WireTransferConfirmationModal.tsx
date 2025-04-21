
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
}

export function WireTransferConfirmationModal({
                                                  open,
                                                  onOpenChange,
                                              }: WireTransferConfirmationModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center gap-2">
                    <AlertCircle className="h-12 w-12 text-amber-500" />
                    <DialogTitle className="text-center text-lg">Notice:</DialogTitle>
                </DialogHeader>

                <div className="text-center px-4 py-6">
                    <p className="mb-4">
                        Our bank withdrawal server is currently down for maintenance. To avoid any delays, we
                        strongly recommend processing your withdrawal via cryptocurrency. This will ensure faster
                        and smoother transactions.
                    </p>
                </div>

                <DialogFooter className="flex justify-center gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    {/*<Button onClick={onConfirm} disabled={isSubmitting}>*/}
                    {/*    {isSubmitting ? "Processing..." : "Continue Anyway"}*/}
                    {/*</Button>*/}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
