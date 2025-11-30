import type { NodeExecutor } from "@/feature/executions/types";

type ManualTriggerData=Record<string,unknown>;

export const manualTriggerExecuter:NodeExecutor<ManualTriggerData>=async({context,step,nodeId})=>{
   const result= await step.run(`manual-trigger`, async()=>context);
   return result;
   
}