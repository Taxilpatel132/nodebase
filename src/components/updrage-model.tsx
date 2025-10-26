"use client";

import{
    AlertDialog,
    AlertDialogContent,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogHeader
} from "@/components/ui/alert-dialog";


import { authClient } from "@/lib/auth-client";

interface UpgradeModelProps{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
}

export const UpgradeModel=({open, onOpenChange}:UpgradeModelProps)=>{
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Upgrade Required</AlertDialogTitle>
                    <AlertDialogDescription>
                        To access this feature, please upgrade your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction  
                        onClick={()=>{
                         authClient.checkout({slug:"pro"})
                    }}>Upgrade Now
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}