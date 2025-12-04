'use client';
import {Node ,NodeProps,useReactFlow} from "@xyflow/react";

import {memo ,useState} from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {  AnthropicDialog,type AnthropicFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchAnthropicRealtimeToken } from "./actions";



import { ANTHROPIC_CHANNEL_NAME } from "@/inngest/channels/anthropic";

type AnthropicNodeData={
    variableName?: string;
   systemPrompt?: string;
   userPrompt?: string;

}

type AnthropicNodeType=Node<AnthropicNodeData>;


export const AnthropicNode= memo((props:NodeProps<AnthropicNodeType>) => {
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSettings=()=>setDialogOpen(true);
    const {setNodes}=useReactFlow();
     const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:ANTHROPIC_CHANNEL_NAME,
        topic:'status',
        refreshToken:fetchAnthropicRealtimeToken,
     }) 
    const NodeData=props.data ;
    const Description=NodeData?.userPrompt ? `:${NodeData.userPrompt.slice(0,50)}...` : 'Not configured';
    const handleSubmit=(values:AnthropicFormValues)=>{
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
    <AnthropicDialog 
    open={dialogOpen} 
    onOpenChange={setDialogOpen}
    onSubmit={handleSubmit}
   defaultValues={NodeData}
    />
    <BaseExecutionNode
        {...props}
        id={props.id}
        icon='/logos/anthropic.svg'
        name="Anthropic"
        description={Description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
    />
    
    </>)
});
AnthropicNode.displayName='AnthropicNode';