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


export type SlackFormValues=z.infer<typeof formSchema>;
const formSchema=z.object({
    variableName:z.string()
    .min(1,{message:"Variable name is required"})
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/,{message:"Variable name must start with a letter or underscore and contain only letters, numbers, and underscores."}),
  
  content:z.string().min(1,{message:"Content is required"}),
    // .refine()
  webhookUrl:z.string().min(1,{message:"Webhook URL is required"})
}); 
interface Props{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    onSubmit:(value:z.infer<typeof formSchema>)=>  void;
   defaultValues?: Partial<SlackFormValues>; 
}

export const SlackDialog=({
    open,
    onOpenChange,
    onSubmit,
    defaultValues={}
}:Props)=>{
   
   
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            variableName: defaultValues.variableName || "",
            webhookUrl: defaultValues.webhookUrl || "",
            content:defaultValues.content||""
        },
    
    });
    useEffect(()=>{
        if(open){
            form.reset({
            variableName: defaultValues.variableName || "",
            webhookUrl: defaultValues.webhookUrl || "",
            content:defaultValues.content||""
            });
        }
    },[open,defaultValues,form]);

    const watchVariableName=form.watch('variableName')||"slackResponse";
    const handleFormSubmit=(data:z.infer<typeof formSchema>)=>{
        console.log("Form submitted with data:", data);
        onSubmit(data);
        onOpenChange(false);
       
    }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Slack Configurations</DialogTitle>
                <DialogDescription>
                    The Slack request has been successfully activated.
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
                                        placeholder="my Slack Response"
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
                      <FormField control={form.control} name='webhookUrl' render={({field})=>(
                                                 <FormItem>
                                                     <FormLabel>Slack Webhook URL</FormLabel>
                                                     <FormControl>
                                                        <Input
                                                            placeholder="https://hooks.slack.com/services/..."
                                                            {...field}
                                                        />
                                                     </FormControl>
                                                        <FormDescription>
                                                            Get This form Slack :Workspace Settings - Workflows - Webhooks - New Webhook - Copy Webhook URL
                                                        </FormDescription>
                                                         <FormDescription>
                                                             make sure the key is content
                                                        </FormDescription>
                                                     <FormMessage />
                                                 </FormItem>
                                             )} />
                    
                      <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>content (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='summary {{aiResponse.text}} in a concise manner'
                                            className="min-h-[80px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                    The Message to send. se {"{{variable}}"} to reference the output of this node in subsequent nodes
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