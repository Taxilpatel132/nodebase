'use client';
import {
    type NodeProps
} from "@xyflow/react";
import {  MousePointerIcon } from "lucide-react";
import {memo, useState} from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode= memo((props:NodeProps) => {
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSettings=()=>setDialogOpen(true);
    const nodeStatus='initial'; // Example status, replace with actual logic if needed
    return (<>
   <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    <BaseTriggerNode
        {...props}
        id={props.id}
        icon={MousePointerIcon}
        name="when cliking 'Excution woekflow'"
    
        onSettings={handleOpenSettings}
         onDoubleClick={handleOpenSettings}
         status={nodeStatus}
    />

    </>)
});