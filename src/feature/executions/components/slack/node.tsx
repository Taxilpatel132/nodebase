'use client';
import {Node ,NodeProps,useReactFlow} from "@xyflow/react";

import {memo ,useState} from "react";
import { BaseExecutionNode } from "../base-execution-node";
import {  SlackDialog,type SlackFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchSlackRealtimeToken } from "./actions";

import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";

type SlackNodeData={
    variableName:string;
    webhookUrl?:string;
   
    content?:string;

}

type SlackNodeType=Node<SlackNodeData>;

export const SlackNode= memo((props:NodeProps<SlackNodeType>) => {
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSettings=()=>setDialogOpen(true);
    const {setNodes}=useReactFlow();
     const nodeStatus=useNodeStatus({
        nodeId:props.id,
        channel:SLACK_CHANNEL_NAME,
        topic:'status',
        refreshToken:fetchSlackRealtimeToken,
     }) 
    const NodeData=props.data ;
    const Description=NodeData?.content ? `:${NodeData.content.slice(0,50)}...` : 'Not configured';
    const handleSubmit=(values:SlackFormValues)=>{
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
    <SlackDialog 
    open={dialogOpen} 
    onOpenChange={setDialogOpen}
    onSubmit={handleSubmit}
   defaultValues={NodeData}
    />
    <BaseExecutionNode
        {...props}
        id={props.id}
        icon='/logos/slack.svg'
        name="Slack"
        description={Description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
    />
    
    </>)
});
SlackNode.displayName='SlackNode';