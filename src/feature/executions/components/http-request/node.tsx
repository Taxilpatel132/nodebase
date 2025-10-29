'use client';
import {Node ,NodeProps,useReactFlow} from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import {memo ,useState} from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { type formType,HttpRequestDialog } from "./dialog";

type HttpRequestNodeData={
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: string;
    [key: string]: unknown;
}

type HttpRequestNodeType=Node<HttpRequestNodeData>;

export const HttpRequestNode= memo((props:NodeProps<HttpRequestNodeType>) => {
    const [dialogOpen,setDialogOpen]=useState(false);
    const handleOpenSettings=()=>setDialogOpen(true);
    const {setNodes}=useReactFlow();
     const nodeStatus='initial'; 
    const NodeData=props.data ;
    const Description=NodeData.endpoint ? `${NodeData.method || 'GET'}:${NodeData.endpoint}` : 'Not configured';
    const handleSubmit=(values:formType)=>{
        setNodes((nds)=>nds.map((node)=>{
            if(node.id===props.id){
               return{
                ...node,
                data:{
                    ...node.data,
                    endpoint:values.endpoint,
                    method:values.method,
                    body:values.body,
                }
               }
            }
            return node;
        }));
    }
  // Example status, replace with actual logic if needed
    return (<>
    <HttpRequestDialog 
    open={dialogOpen} 
    onOpenChange={setDialogOpen}
    onSubmit={handleSubmit}
    defaultEndpoint={NodeData.endpoint}
    defaultMethod={NodeData.method}
    defaultBody={NodeData.body}
    />
    <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={Description}
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
    />
    
    </>)
});
HttpRequestNode.displayName='HttpRequestNode';