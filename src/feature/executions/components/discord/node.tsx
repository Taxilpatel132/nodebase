'use client';
import {Node ,NodeProps,useReactFlow} from "@xyflow/react";

import {memo ,useState} from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {  DiscordDialog,type DiscoedFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchDiscordRealtimeToken } from "./actions";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";

type DiscordNodeData={
    variableName:string;
    webhookUrl?:string;
    userName?:string;
    content?:string;

}

type DiscordNodeType=Node<DiscordNodeData>;

export const DiscordNode= memo((props:NodeProps<DiscordNodeType>) => {
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSettings=()=>setDialogOpen(true);
    const {setNodes}=useReactFlow();
     const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:DISCORD_CHANNEL_NAME,
        topic:'status',
        refreshToken:fetchDiscordRealtimeToken,
     }) 
    const NodeData=props.data ;
    const Description=NodeData?.content ? `:${NodeData.content.slice(0,50)}...` : 'Not configured';
    const handleSubmit=(values:DiscoedFormValues)=>{
        setNodes((nds)=>nds.map((node)=>{
            if(node.id===props.id){
               return{
                ...node,
                data:{
                    ...node.data,
                    ...values
                }
               }
            }
            return node;
        }));
    }
  // Example status, replace with actual logic if needed
    return (<>
    <DiscordDialog 
    open={dialogOpen} 
    onOpenChange={setDialogOpen}
    onSubmit={handleSubmit}
   defaultValues={NodeData}
    />
    <BaseExecutionNode
        {...props}
        id={props.id}
        icon='/logos/discord.svg'
        name="Discord"
        description={Description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
    />
    
    </>)
});
DiscordNode.displayName='DiscordNode';