'use client';
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useExecutionParams } from "./use-execution-params";

/*  
hook to get multiple executions with suspense
*/
export const useSuspenseExecutions = () => {
    const trpc = useTRPC();
    const [params] = useExecutionParams();
    return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};




/*
  hook to get single credential with suspense
*/
export const useSuspenseExecution = (id:string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.executions.getOne.queryOptions({id}));
}
