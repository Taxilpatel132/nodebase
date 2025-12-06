'use client';
import {Node ,NodeProps,useReactFlow} from "@xyflow/react";

import {memo ,useState} from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {  OpenAiDialog,type OpenAiFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchOpenAiRealtimeToken } from "./actions";


import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";

type OpenAiNodeData={
    variableName?: string;
    credentialId?: string;
   systemPrompt?: string;
   userPrompt?: string;

}

type OpenAiNodeType=Node<OpenAiNodeData>;

export const OpenAiNode= memo((props:NodeProps<OpenAiNodeType>) => {
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSettings=()=>setDialogOpen(true);
    const {setNodes}=useReactFlow();
     const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:OPENAI_CHANNEL_NAME,
        topic:'status',
        refreshToken:fetchOpenAiRealtimeToken,
     }) 
    const NodeData=props.data ;
    const Description=NodeData?.userPrompt ? `:${NodeData.userPrompt.slice(0,50)}...` : 'Not configured';
    const handleSubmit=(values:OpenAiFormValues)=>{
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
    <OpenAiDialog 
    open={dialogOpen} 
    onOpenChange={setDialogOpen}
    onSubmit={handleSubmit}
   defaultValues={NodeData}
    />
    <BaseExecutionNode
        {...props}
        id={props.id}
        icon='/logos/openai.svg'
        name="OpenAI"
        description={Description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
    />
    
    </>)
});
OpenAiNode.displayName='OpenAiNode';