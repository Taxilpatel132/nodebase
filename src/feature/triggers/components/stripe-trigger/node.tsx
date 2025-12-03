'use client';
import {
    type NodeProps
} from "@xyflow/react";
import {  MousePointerIcon } from "lucide-react";
import {memo, useState} from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { StripeTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/feature/executions/hooks/use-node-status";
import { fatchStripeTriggerRealtimeToken } from "./actions";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger";



export const StripeTriggerNode= memo((props:NodeProps) => {
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSettings=()=>setDialogOpen(true);
      const nodeStatus=useNodeStatus({
                 nodeId:props.id,
                 channel:STRIPE_TRIGGER_CHANNEL_NAME,
                 topic:'status',
                 refreshToken:fatchStripeTriggerRealtimeToken,
              }) // Example status, replace with actual logic if needed
    return (<>
   <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    <BaseTriggerNode
        {...props}
        id={props.id}
        icon='/logos/stripe.svg'
        name="Stripe Trigger"
        description="when stripe event occurs"
    
        onSettings={handleOpenSettings}
         onDoubleClick={handleOpenSettings}
         status={nodeStatus}
    />

    </>)
});