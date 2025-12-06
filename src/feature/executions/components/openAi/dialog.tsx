'use client';
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import{
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

import {
    Form,
    FormDescription,    
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from '@/components/ui/form';

import { 
     Select,
     SelectContent, 
     SelectItem, 
     SelectTrigger, 
     SelectValue 
} from "@/components/ui/select";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCredentialsByType } from "@/feature/credentials/hooks/use-cridentials";
import { CredentialType } from "@/generated/prisma";


export type OpenAiFormValues=z.infer<typeof formSchema>;
const formSchema=z.object({
    variableName:z.string()
    .min(1,{message:"Variable name is required"})
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/,{message:"Variable name must start with a letter or underscore and contain only letters, numbers, and underscores."}),
   credentialId:z.string().min(1,{message:"Credential is required"}),
   systemPrompt:z.string().optional(),
   userPrompt:z.string().min(1,{message:"User prompt is required"}),
    // .refine()
    
}); 
interface Props{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    onSubmit:(value:z.infer<typeof formSchema>)=>  void;
   defaultValues?: Partial<OpenAiFormValues>; 
}

export const OpenAiDialog=({
    open,
    onOpenChange,
    onSubmit,
    defaultValues={}
}:Props)=>{
    const {
                data:credentials,
                isLoading
            } =useCredentialsByType(CredentialType.OPENAI);
           
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            variableName: defaultValues.variableName || "",
            credentialId: defaultValues.credentialId || "",
            systemPrompt:defaultValues.systemPrompt||"",
            userPrompt:defaultValues.userPrompt||""
        },
    
    });
    useEffect(()=>{
        if(open){
            form.reset({
           variableName: defaultValues.variableName || "",
           credentialId: defaultValues.credentialId || "",
            systemPrompt:defaultValues.systemPrompt||"",
            userPrompt:defaultValues.userPrompt||""
            });
        }
    },[open,defaultValues,form]);

    const watchVariableName=form.watch('variableName')||"myOpenAiResponse";
    const handleFormSubmit=(data:z.infer<typeof formSchema>)=>{
        console.log("Form submitted with data:", data);
        onSubmit(data);
        onOpenChange(false);
       
    }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>OpenAI Request Activated</DialogTitle>
                <DialogDescription>
                    The OpenAI request has been successfully activated.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 mt-4">
                     <FormField
                        control={form.control}
                        name="variableName"
                        render={({field})=>(
                            <FormItem>
                            <FormLabel>Variable Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="myOpenAiResponse"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                 use name to reference the output of this node in subsequent nodes.
                                 {"{{"+ watchVariableName +".text}}"} to get the text response,
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                     
                        <FormField control={form.control} name='credentialId' render={({field})=>(
                                                                                         <FormItem>
                                                                                             <FormLabel>OpenAI Credentials</FormLabel>
                                                                                             <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={isLoading || !credentials?.length}>
                                                                                                <FormControl>
                                                                                                 <SelectTrigger className="w-full">
                                                                                                     <SelectValue placeholder="Select a credential" />
                                                                                                 </SelectTrigger>
                                                                                                 </FormControl>
                                                                                                 <SelectContent>
                                                                                                     {credentials?.map((credential)=>(
                                                                                                         <SelectItem key={credential.id} value={credential.id}>
                                                                                                             <div className="flex items-center gap-2 space-x-2">
                                                                                                                 <Image src='/logos/openai.svg' alt='OpenAI Logo' width={16} height={16} />
                                                                                                                 <span>{credential.name}</span>
                                                                                                             </div>
                                                                                                         </SelectItem>
                                                                                                     ))}
                                                                                                 </SelectContent>
                                                                                             </Select>
                                                                                             <FormMessage />
                                                                                         </FormItem>
                                                                                     )} />
                      <FormField
                            control={form.control}
                            name="systemPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>systemPrompt (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='you are helpful assistant'
                                            className="min-h-[80px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                      set the behavior of the model with system prompt.
                                      use {"{{variable}}"} to reference the output of this node in subsequent nodes
                                      or {"{{json variable}}"} to reference the output of this node in JSON format.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="userPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>userPrompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='summarize the following text'
                                            className="min-h-[120px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                    this is the user prompt that will be sent to the OpenAI model.
                                    use {"{{variable}}"} to reference the output of this node in subsequent nodes
                                    or {"{{json variable}}"} to reference the output of this node in JSON format.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    );
}