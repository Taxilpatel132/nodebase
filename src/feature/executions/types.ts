import { GetStepTools,Inngest } from "inngest";

export type workflowContext=Record<string,unknown>;
export type StepTools =GetStepTools<Inngest.Any>;

export interface NodeExecutorParams<TData=Record<string,unknown>>{
    data:TData;
    context:workflowContext;
    step:StepTools;
    nodeId:string;
}

export type NodeExecutor<TData=Record<string,unknown>>=(
    params:NodeExecutorParams<TData>
)=>Promise<workflowContext>;