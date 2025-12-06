'use client';
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialType } from "@/generated/prisma";

export const useSuspenseCredentials = () => {
    const trpc = useTRPC();
    const [params] = useCredentialsParams();
    return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

/* 
  hook to remove credential
*/
export const useCreateCredential = () => {
    const trpc = useTRPC();
    const queryClient=useQueryClient();
    
    return useMutation(trpc.credentials.create.mutationOptions({
        onSuccess:  (data) => {
            toast.success(`Credential created successfully "${data.name}"`);
            
            queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
        },
        onError: (error) => {
            toast.error(`Failed to create credential: ${error.message}`);
        }
    }))
}
/*
  hook to remove credential
*/
export const useRemoveCredential = () => {
    const trpc = useTRPC();
    const queryClient=useQueryClient();
    return useMutation(trpc.credentials.remove.mutationOptions({
        onSuccess:  (data) => {
            toast.success(`Credential removed successfully "${data.name}"`);
            queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
            queryClient.invalidateQueries(trpc.credentials.getOne.queryFilter({id:data.id}));
        }
    }));
};

/*
  hook to get single credential with suspense
*/
export const useSuspenseCredential = (id:string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.credentials.getOne.queryOptions({id}));
}

/*
  hook to update credential
*/
export const useUpdateCredential = () => {
    const trpc = useTRPC();
    const queryClient=useQueryClient();
    
    return useMutation(trpc.credentials.update.mutationOptions({
        onSuccess:  (data) => {
            toast.success(`Credential saved successfully "${data.name}"`);

            queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
            queryClient.invalidateQueries(trpc.credentials.getOne.queryOptions({id:data.id}));
        },
        onError: (error) => {
            toast.error(`Failed to save Credential: ${error.message}`);
        }
    }))
}

/*
  hook to fetch credentials by type
*/
export const useCredentialsByType = (type: CredentialType) => {
    const trpc = useTRPC();
    return useQuery(trpc.credentials.getByType.queryOptions({type}));

}