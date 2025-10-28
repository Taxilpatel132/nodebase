'use client';
import type {Node ,NodeProps,useReactFlow} from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import {memo ,useState} from "react";
import { BaseExecutionNode } from "../base-execution-node";

type HttpRequestNodeData={
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: string;
    [key: string]: unknown;
}

type HttpRequestNodeType=Node<HttpRequestNodeData>;

export const HttpRequestNode= memo((props:NodeProps<HttpRequestNodeType>) => {
    const NodeData=props.data as HttpRequestNodeData;
    const Description=NodeData.endpoint ? `${NodeData.method || 'GET'}:${NodeData.endpoint}` : 'Not configured';

    return (<>
    <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={Description}
        onSettings={()=>{}}
        onDoubleClick={()=>{}}
    />
    
    </>)
});
HttpRequestNode.displayName='HttpRequestNode';