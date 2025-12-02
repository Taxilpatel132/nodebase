'use client';
import {
    type NodeProps
} from "@xyflow/react";
import {  MousePointerIcon } from "lucide-react";
import {memo, useState} from "react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/feature/executions/hooks/use-node-status";
import { fatchGoogleFormTriggerRealtimeToken } from "./actions";

import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";

export const GoogleFormTriggerNode= memo((props:NodeProps) => {
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSettings=()=>setDialogOpen(true);
      const nodeStatus=useNodeStatus({
                 nodeId:props.id,
                 channel:GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
                 topic:'status',
                 refreshToken:fatchGoogleFormTriggerRealtimeToken,
              }) // Example status, replace with actual logic if needed
    return (<>
   <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    <BaseTriggerNode
        {...props}
        id={props.id}
        icon='/logos/googleform.svg'
        name="google form trigger"
        description="when form is submitted"
    
        onSettings={handleOpenSettings}
         onDoubleClick={handleOpenSettings}
         status={nodeStatus}
    />

    </>)
});