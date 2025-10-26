import { UpgradeModel } from "@/components/updrage-model";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { useState } from "react";

export const useUpgradeModel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const handleError = (error: unknown) => {
        if(error instanceof TRPCClientError) {
            if(error.data?.code === 'FORBIDDEN') {
                setIsOpen(true);
                return true;
            }
            
        }
        return false;
    };
    const model= <UpgradeModel open={isOpen} onOpenChange={setIsOpen}/>;

    return {handleError, model};
}