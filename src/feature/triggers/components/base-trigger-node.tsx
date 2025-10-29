'use client';
import   { type NodeProps,Position, useReactFlow} from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import {memo,type ReactNode,} from "react";
import {BaseNode,BaseNodeContent} from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/react-flow/workflow-node";
import {type  NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps{
    icon: LucideIcon | string;
    name :string;
    description?:string;
    children?:ReactNode;
     status?: NodeStatus;
    onSettings?:()=>void;
    onDoubleClick?:()=>void;
}

export const BaseTriggerNode= memo(({
    id,
    icon:Icon,
    name,
    description,
    children,
    status="initial",
    onSettings,
    onDoubleClick,
}: BaseTriggerNodeProps) => {
    const {setNodes,setEdges}=useReactFlow();

    const handleDelete = () => {
    setNodes((nds)=>{const filtered=nds.filter((n)=>n.id !== id); return filtered;});
    setEdges((eds)=>{const filtered=eds.filter((e)=>e.source !== id && e.target !== id); return filtered;});

    };
    return (
        <WorkflowNode onDelete={handleDelete} onSettings={onSettings} name={name} description={description}>
            <NodeStatusIndicator variant="border" status={status} className="rounded-l-2xl">
            <BaseNode status={status} onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
               <BaseNodeContent>
                {typeof Icon === "string" ? (
                    <Image src={Icon} alt={name} width={16} height={16} />
                ):(
                    <Icon className="size-4  text-muted-foreground" />
                )}
                {children}
                
                <BaseHandle
                  id='source-1'
                  type="source" 
                  position={Position.Right}
                />
                
                </BaseNodeContent>
            </BaseNode>
            </NodeStatusIndicator>
        </WorkflowNode>
        );
});

BaseTriggerNode.displayName = "BaseTriggerNode";
