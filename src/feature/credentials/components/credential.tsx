'use client';

import { CredentialType } from "@/generated/prisma";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { useRouter,useParams } from "next/navigation";
import { useCreateCredential, useUpdateCredential,useSuspenseCredential } from "../hooks/use-cridentials";
import { useUpgradeModel } from "@/hooks/use-upgrade-model";
import {
    Form,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from '@/components/ui/form';
import { Input } from "@/components/ui/input";

import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import Link from "next/link";



const formSchema=z.object({
    name:z.string().min(1,{message:"Name is required"}),
    type:z.enum(CredentialType),
    value:z.string().min(1,{message:"Value is required"}),
});

type formValues=z.infer<typeof formSchema>;
const CredentialTypeOptions=[
    {label:"OpenAI",value:CredentialType.OPENAI ,logo:'/logos/openai.svg'},
    {label:"Anthropic",value:CredentialType.ANTHROPIC ,logo:'/logos/anthropic.svg'},
    {label:"Gemini",value:CredentialType.GOOGLE ,logo:'/logos/gemini.svg'},
]
interface CredentialFormProps{

    initialData?:{
        id?:string;
        name:string;
        type:CredentialType;
       value:string;
    };
};

export const CredentialForm = ({initialData}:CredentialFormProps) => {

    const Router=useRouter();
    const createCredential=useCreateCredential();
    const updateCredential=useUpdateCredential();
    const {handleError,model}=useUpgradeModel();
    const isEdit=!!initialData?.id;
    const form=useForm<formValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData || {
            name:"",
            type:CredentialType.OPENAI,
            value:"",
        },
    });

    const handleSubmit= async (values:formValues) => {
        if(isEdit && initialData?.id){
            updateCredential.mutate({id:initialData.id,...values},{
                onError:(error)=>{
                    handleError(error);
                },
                onSuccess:()=>{
                    Router.back();
                }
            });
        } else {
            createCredential.mutate(values, {
                onError: (error) => {
                    handleError(error);
                },
                onSuccess: () => {
                    Router.back();
                }
            });
        }
    }
    return (
        <>   {model}     
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle>{isEdit ? "Edit Credential" : "New Credential"}</CardTitle>
                <CardDescription>
                    {isEdit ? "Update your credential information." : "Create a new credential to use in your workflows."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                        <FormField control={form.control} name='name' render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="my API key "{...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='type' render={({field})=>(
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a credential type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CredentialTypeOptions.map((option)=>(
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex items-center gap-2 space-x-2">
                                                    <Image src={option.logo} alt={option.label} width={16} height={16} />
                                                    <span>{option.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name='value' render={({field})=>(
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="sk-..."{...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="flex gap-4">
                        <Button type="submit"
                                disabled={createCredential.isPending || updateCredential.isPending}
                        >
                            {isEdit ? "Update" : "Create"}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/credentials" prefetch>
                            Cancel
                            </Link>
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>

    </>

    )
};
export const CredentialView = ({credentialId}:{credentialId:string}) => {
    
    const {data:credential}=useSuspenseCredential(credentialId);
    return (
        <CredentialForm initialData={credential} />
    )
}