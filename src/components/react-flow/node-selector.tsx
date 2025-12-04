'use client';
import { createId} from '@paralleldrive/cuid2'

import { useReactFlow } from '@xyflow/react';
import {GlobeIcon,MousePointerIcon} from "lucide-react";
import { useCallback } from 'react';
import{
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,SheetDescription
} from "@/components/ui/sheet";
import { NodeType } from '@/generated/prisma';
import { toast } from 'sonner';
import { Separator } from '../ui/separator';



export type NodeTypeOptions = {
 type:NodeType;
 label:string;
 description:string;
 icon:React.ComponentType<{className?:string}>|string;

};

const triggerNodes:NodeTypeOptions[]=[
{
    type:NodeType.MANUAL_TRIGGER,
    label:"Manual Trigger",
    description:"A trigger that is activated manually.",
    icon:MousePointerIcon
},
{
    type:NodeType.GOOGLE_FORM_TRIGGER,
    label:"Google Form Trigger",
    description:"A trigger that activates when a new Google Form response is submitted.",
    icon:'/logos/googleform.svg'
},
{
    type:NodeType.STRIPE_TRIGGER,
    label:"Stripe Trigger",
    description:"A trigger that activates when a new Stripe event occurs.",
    icon:'/logos/stripe.svg'
},
]
const executionNodes:NodeTypeOptions[]=[
    {
        type:NodeType.HTTP_REQUEST,
        label:"HTTP Request",
        description:"Make an HTTP request to an external API.",
        icon:GlobeIcon
    },
    {
        type:NodeType.GEMINI,
        label:"Gemini",
        description:"Make a request to the Gemini API.",
        icon:'/logos/gemini.svg' 
    },
     {
        type:NodeType.OPENAI,
        label:"OpenAI",
        description:"Make a request to the OpenAI API.",
        icon:'/logos/openai.svg' 
    }, {
        type:NodeType.ANTHOROPIC,
        label:"Anthropic",
        description:"Make a request to the Anthropic API.",
        icon:'/logos/anthropic.svg' 
    }
];

interface NodeSelectorProps{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    children:React.ReactNode;
} 
export const NodeSelector=({
    open,
    onOpenChange,
    children
}:NodeSelectorProps)=>{
    const {setNodes,getNodes,screenToFlowPosition}=useReactFlow();
    const handleNodeSelect=useCallback((selector:NodeTypeOptions)=>{
     if(selector.type===NodeType.MANUAL_TRIGGER){
        const nodes=getNodes();
        const existingNode=nodes.some((node)=>node.type===NodeType.MANUAL_TRIGGER);
        if(existingNode){
            toast.error("Manual Trigger node already exists in the workflow.");
            return;
        }

    }
    setNodes((nds)=>{
        const hasInitialNode=nds.some((node)=>node.type===NodeType.INITIAL);
       const CenterX=window.innerWidth/2;
        const CenterY=window.innerHeight/2;

        const position=screenToFlowPosition({
            x:CenterX+(Math.random()-0.5)*200,
            y:CenterY+(Math.random()-0.5)*200,
        });

        const newNode={
            id:createId(),
            type:selector.type,
            position,
            data:{},
        }
        if(hasInitialNode){
            return [newNode];
        }
        return [...nds,newNode];
    });
    onOpenChange(false);
    },[setNodes,getNodes,screenToFlowPosition,onOpenChange]);
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent  side="right" className="overflow-y-auto w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>
                        what trigger this workflow?
                    </SheetTitle>
                    <SheetDescription>
                        A trigger is a step that starts the workflow execution.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {triggerNodes.map((nodeType)=>{
                        const Icon=nodeType.icon;
                        return (<div 
                            key={nodeType.type} 
                            className="w-full h-auto py-5 px-4  justify-start cursor-pointer rounded-none border-l-2 border-transparent hover:border-l-primary"
                            onClick={()=>handleNodeSelect(nodeType)}
                        >
                            
                            <div className="flex items-center gap-6 overflow-hidden w-full">
                                {typeof Icon === 'string' ? (
                                    <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-md " />
                                ) : (<Icon className="size-5"/>)}

                                <div className="flex itens-enter text-left flex-col">
                                    <span className="font-medium text-sm">
                                        {nodeType.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {nodeType.description}
                                    </span>
                                </div>
                            </div>
                        </div>)
                    })}
                </div>
                <Separator />
                <div>
                    {executionNodes.map((nodeType)=>{
                        const Icon=nodeType.icon;
                        return (<div 
                            key={nodeType.type} 
                            className="w-full h-auto py-5 px-4  justify-start cursor-pointer rounded-none border-l-2 border-transparent hover:border-l-primary"
                            onClick={()=>handleNodeSelect(nodeType)}
                        >
                            
                            <div className="flex items-center gap-6 overflow-hidden w-full">
                                {typeof Icon === 'string' ? (
                                    <img src={Icon} alt={nodeType.label} className="size-5 object-contain rounded-md"/>
                                ) : (<Icon className="size-5"/>)}

                                <div className="flex itens-enter text-left flex-col">
                                    <span className="font-medium text-sm">
                                        {nodeType.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {nodeType.description}
                                    </span>
                                </div>
                            </div>
                        </div>)
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}