'use client';
import { requireAuth, requireUnauth } from "@/lib/auth-utils";

import { caller } from "@/trpc/server";
import { LogoutButton } from "./LogoutButton";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
const page =  () => {
    const trpc=useTRPC();
    const QueryClient=useQueryClient();
    const {data}=useQuery(trpc.getWorkflows.queryOptions());
    const create=useMutation(trpc.createWorkflow.mutationOptions({
        onSuccess:()=>{
           toast.success('Workflow creation initiated!');
        }
    }));


    return( 
    <div className='min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6'>
      {JSON.stringify(data, null, 2)}
            <Button disabled={create.isPending} onClick={()=>{create.mutate()}}>Create Workflow</Button>
       <LogoutButton />
    </div>);
}
export default page;