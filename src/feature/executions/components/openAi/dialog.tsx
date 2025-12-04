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


import { Button } from "@/components/ui/button";


export type OpenAiFormValues=z.infer<typeof formSchema>;
const formSchema=z.object({
    variableName:z.string()
    .min(1,{message:"Variable name is required"})
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/,{message:"Variable name must start with a letter or underscore and contain only letters, numbers, and underscores."}),
  
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
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            variableName: defaultValues.variableName || "",
            systemPrompt:defaultValues.systemPrompt||"",
            userPrompt:defaultValues.userPrompt||""
        },
    
    });
    useEffect(()=>{
        if(open){
            form.reset({
           variableName: defaultValues.variableName || "",
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