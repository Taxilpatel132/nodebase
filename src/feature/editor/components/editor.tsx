'use client';

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/feature/workflows/hooks/use-workflows";

export const EditorLoading=() => {
    return <LoadingView message="Loading editor..." />
}

export const EditorError=() => {
    return <ErrorView message="Failed to load editor." />
}

export const Editor=({workflowId}:{workflowId:string}) => {
    const {data:workflows}=useSuspenseWorkflow(workflowId);
    return (
       <p>
        {JSON.stringify(workflows,null,2 )}
       </p>
    )
}