'use client';
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SaveIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
}from '@/components/ui/breadcrumb';

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { use, useEffect,useRef,useState } from "react";
import { useSuspenseWorkflow, useUpdateWorkflow, useUpdateWorkflowName } from "@/feature/workflows/hooks/use-workflows";

import {  useAtomValue } from "jotai";
import { editorAtoms } from "../store/atoms";
export const EditorSaveButton =  ({workflowId}:{workflowId:string}) => {
    const editor=useAtomValue(editorAtoms);
    const saveWorkflow=useUpdateWorkflow();
    const handlesave=()=>{
        if(!editor){
            return;
        }
        const nodes=editor.getNodes();
        const edges=editor.getEdges();
        saveWorkflow.mutate({id:workflowId, nodes, edges});
    }
    return (
        <div className="ml-auto">
            <Button onClick={handlesave} disabled={saveWorkflow.isPending} size="sm" >
                <SaveIcon className="size-4"/>
                Save
            </Button>
        </div>
    )
}
export const EditorNameInput =  ({workflowId}:{workflowId:string}) => {
    const {data:workflow}=useSuspenseWorkflow(workflowId);
    const UpdateWorkflow =useUpdateWorkflowName();
    const [isEditing,setIsEditing]=useState(false);
    const inputRef=useRef<HTMLInputElement>(null);
    const [name,setName]=useState(workflow.name);

    useEffect(()=>{
        if(workflow.name!==name){
            setName(workflow.name);
        }
    },[workflow.name]);

    useEffect(()=>{
        if(isEditing && inputRef.current){
            inputRef.current.focus();
            inputRef.current.select();
        }
    },[isEditing]);

    const handleSave=async()=>{
        if(name===workflow.name){
            setIsEditing(false);
            return;
        }
        
        try{
            await UpdateWorkflow.mutateAsync({id:workflowId, name});
             
        }catch{
            setName(workflow.name);
        }finally{
          setIsEditing(false);
        }
    };
  
    const handleKeyDown=(e:React.KeyboardEvent)=>{
        if(e.key==='Enter'){
            
            handleSave();
        }else if(e.key==='Escape'){
           
            setName(workflow.name);
            setIsEditing(false);
        }
    };

    if(isEditing){
            return (
            <Input 
            disabled={UpdateWorkflow.isPending}
            ref={inputRef}
            value={name}
            onChange={(e)=>setName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-7 w-auto min-w-[100px] px-2"
            />
        )
    }

    return (
     <BreadcrumbItem onClick={()=>setIsEditing(true)} className="cursor-pointer hover:text-foreground transition-colors">
     {workflow.name}
     </BreadcrumbItem>
    )
}

export const  EditorBreadcrumbs =  ({workflowId}:{workflowId:string}) => {

    return (
        <Breadcrumb>
        <BreadcrumbList>
        <BreadcrumbItem>
            <BreadcrumbLink asChild>
                <Link href="/workflows" prefetch>Workflows</Link>
            </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
         <EditorNameInput workflowId={workflowId} />  
        </BreadcrumbList>
       
        </Breadcrumb>
    )
}
export const EditorHeader = ({workflowId}:{workflowId:string}) => {
    return (
        <header className="flex h-14 px-4 shrink-0 items-center gap-2  border-b bg-background">
            <SidebarTrigger />
            <div className="flex items-center flex-row justify-center w-full gap-x-4">
                <EditorBreadcrumbs workflowId={workflowId} />
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    );
}