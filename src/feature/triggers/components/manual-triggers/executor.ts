import type { NodeExecutor } from "@/feature/executions/types";
import { ManualTriggerChannel } from "@/inngest/channels/manual-trigger";

type ManualTriggerData=Record<string,unknown>;

export const manualTriggerExecuter:NodeExecutor<ManualTriggerData>=async({context,step,nodeId,publish})=>{
  await publish(
   ManualTriggerChannel().status({
      nodeId,
      status:"loading"
   })
  )
  
   const result= await step.run(`manual-trigger`, async()=>context);
    await publish(
   ManualTriggerChannel().status({
      nodeId,
      status:"success"
   })
  )
   return result;
   
}