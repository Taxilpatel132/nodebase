'use client';

import { useUpgradeModel } from "@/hooks/use-upgrade-model";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";


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
        <div className="flex-1 flex justify-center items-center">
        <p>
            {JSON.stringify(workflows.data,null,2)}
        </p>
    </div>
    );
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