'use client';

import{
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface Props{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
}

export const ManualTriggerDialog=({
    open,
    onOpenChange
}:Props)=>{
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Manual Trigger Activated</DialogTitle>
                <DialogDescription>
                    The manual trigger has been successfully activated.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <p className="text-sm text-muted-foreground">
                    manual trigger activated
                </p>
            </div>
        </DialogContent>
    </Dialog>
    );
}