'use client';
import {Node ,NodeProps,useReactFlow} from "@xyflow/react";

import {memo ,useState} from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {  GeminiDialog,type GeminiFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGeminiRealtimeToken } from "./actions";

import { GEMINI_CHANNEL_NAME } from "@/inngest/channels/gemini";

type GeminiNodeData={
    variableName?: string;
   systemPrompt?: string;
   userPrompt?: string;

}

type GeminiNodeType=Node<GeminiNodeData>;

export const GeminiNode= memo((props:NodeProps<GeminiNodeType>) => {
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSettings=()=>setDialogOpen(true);
    const {setNodes}=useReactFlow();
     const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:GEMINI_CHANNEL_NAME,
        topic:'status',
        refreshToken:fetchGeminiRealtimeToken,
     }) 
    const NodeData=props.data ;
    const Description=NodeData?.userPrompt ? `:${NodeData.userPrompt.slice(0,50)}...` : 'Not configured';
    const handleSubmit=(values:GeminiFormValues)=>{
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
    <GeminiDialog 
    open={dialogOpen} 
    onOpenChange={setDialogOpen}
    onSubmit={handleSubmit}
   defaultValues={NodeData}
    />
    <BaseExecutionNode
        {...props}
        id={props.id}
        icon='/logos/gemini.svg'
        name="Gemini"
        description={Description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
    />
    
    </>)
});
GeminiNode.displayName='GeminiNode';