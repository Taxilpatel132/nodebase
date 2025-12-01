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
import { en } from "zod/v4/locales";
import { Button } from "@/components/ui/button";

export type HttpRequestFormValues=z.infer<typeof formSchema>;
const formSchema=z.object({
    variableName:z.string()
    .min(1,{message:"Variable name is required"})
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/,{message:"Variable name must start with a letter or underscore and contain only letters, numbers, and underscores."}),
    endpoint:z.url({message:"Invalid URL"}),
    method:z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
    body:z.string().optional()
    // .refine()
    ,
}); 
interface Props{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
    onSubmit:(value:z.infer<typeof formSchema>)=>  void;
   defaultValues?: Partial<HttpRequestFormValues>; 
}

export const HttpRequestDialog=({
    open,
    onOpenChange,
    onSubmit,
    defaultValues={}
}:Props)=>{
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            variableName: defaultValues.variableName || "",
            endpoint:defaultValues.endpoint||"",
            method:defaultValues.method|| 'GET',
            body:defaultValues.body||""
        },
    
    });
    useEffect(()=>{
        if(open){
            form.reset({
            variableName: defaultValues.variableName || "",
            endpoint:defaultValues.endpoint||"",
            method:defaultValues.method|| 'GET',
            body:defaultValues.body||""
            });
        }
    },[open,defaultValues,form]);
    const watchMathod=form.watch('method');
    const showBodyInput=['POST', 'PUT', 'PATCH'].includes(watchMathod);
    const watchVariableName=form.watch('variableName')||"myApiCall";
    const handleFormSubmit=(data:z.infer<typeof formSchema>)=>{
        onSubmit(data);
        onOpenChange(false);
       
    }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>HTTP Request Activated</DialogTitle>
                <DialogDescription>
                    The HTTP request  has been successfully activated.
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
                                        placeholder="MyApiCall"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                 use name to reference the output of this node in subsequent nodes.
                                 {"{{"+ watchVariableName +".httpResponse.data}}"}
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="method"
                        render={({field})=>(
                            <FormItem>
                            <FormLabel>Method</FormLabel>
                          
                                <Select 
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                >
                                    <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select method"/>
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select the HTTP method for the request.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="endpoint"
                        render={({field})=>(
                            <FormItem>
                            <FormLabel>Endpoint URL</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://api.example.com/users/{{http_response.data.id}}"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                   static URL  or use {"{{variables}}" } for simple value or {'{{json variable}}'} to access JSON properties.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        {showBodyInput && (
                        <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Request Body</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='{"name":"John", "age":30}'
                                            className="min-h-[120px] font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Use {"{{variables}}" } for simple values or {'{{json variable}}'} to access JSON properties.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        )}
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    );
}