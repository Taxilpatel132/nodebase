'use client';

import { useUpgradeModel } from "@/hooks/use-upgrade-model";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "@/generated/prisma";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";


export const WorkflowsSearch = () => {
    const [Params, setParams] = useWorkflowsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params: Params,
        setParams: setParams,
    })
    return(
        <EntitySearch
           value={searchValue}
           onChange={onSearchChange}
           placeholder="Search workflows..."       
       />
    );
};


export const WorkflowsList = () => {
    
    const workflows=useSuspenseWorkflows();
    return (
        <EntityList 
        items={workflows.data.items} 
        getKey={(workflow)=>workflow.id}
        renderItem={(workflow)=><WorkflowItem workflow={workflow} />}
        emptyView={<WorkflowsEmpty />}      
        />
    )
}

export const WorkflowsHeader = ({disabled}:{disabled?:boolean}) => {
    const createWorkflow = useCreateWorkflow();
    const router=useRouter();
    const {handleError, model} = useUpgradeModel();
    const handleCreateWorkflow = () => {
        createWorkflow.mutate(undefined,{
            onSuccess: (data) => {
               router.push(`/workflows/${data.id}`); 
            },
            onError:(error)=>{
            handleError(error);
        }});
    }
    return (
        <>
        {model}
        <EntityHeader 
        title="Workflows" 
        description="Create and Manage your workflows"
        onNew={handleCreateWorkflow}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
        />
        </>
    )

}
export const WorkflowsPagination = () => {
    const [Params, setParams] = useWorkflowsParams();
    const workflows=useSuspenseWorkflows();
    return (
        <EntityPagination
        disabled={workflows.isFetching}
        page={workflows.data.page}
        totalPages={workflows.data.totalPages}
        onPageChange={(page:number)=>{
            setParams({
                ...Params,
                page,
            })
        }}/>
    )
};




export const WorkflowsContainer = ({children}:{children:React.ReactNode}) => {
    return (
        <EntityContainer
        header={<WorkflowsHeader />}
        search ={<WorkflowsSearch />}
        pagination={<WorkflowsPagination />} 
       >

            {children}
        </EntityContainer>
    )
}

export const WorkflowsLoading = () => {
    return <LoadingView message="Loading workflows..." />;
}

export const WorkflowsError = () => {
    return <ErrorView message="Failed to load workflows." />;
}


export const WorkflowsEmpty = () => {
    const createWorkflow = useCreateWorkflow();
    const { handleError, model } = useUpgradeModel();
    const router = useRouter();
    const handleCreateWorkflow = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
                handleError(error);
            },
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            }
        });
    }

    return <>
        {model}
    <EmptyView message="No workflows found. Create your first workflow!" onNew={handleCreateWorkflow} /></>;
}


export const WorkflowItem = ({workflow}:{workflow:Workflow}) => {
    const removeWorkflows=useRemoveWorkflow();

    const handleRemoveWorkflow =  () => {
         removeWorkflows.mutate({ id: workflow.id });
    };

    return (
        <EntityItem
        href={`/workflows/${workflow.id}`}
        title={workflow.name}
        subtitle={<>
        Update {formatDistanceToNow(workflow.updatedAt,{addSuffix:true})}{" "}
        &bull;  Created{" "}
        {formatDistanceToNow(workflow.createdAt,{addSuffix:true})} 
        </>}
        image={
            
            <div className="size-8 flex items-center justify-center">
                <WorkflowIcon  className="size-5 text-muted-foreground"/>
            </div>
        }
        onRemove={handleRemoveWorkflow}
        isRemoving={removeWorkflows.isPending}
        />
    )
}