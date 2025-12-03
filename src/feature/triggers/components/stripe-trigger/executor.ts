import type { NodeExecutor } from "@/feature/executions/types";

import { StripeTriggerChannel } from "@/inngest/channels/stripe-trigger";


type StripeTriggerData=Record<string,unknown>;

export const stripeTriggerExecutor:NodeExecutor<StripeTriggerData>=async({context,step,nodeId,publish})=>{
  await publish(
   StripeTriggerChannel().status({
      nodeId,
      status:"loading"
   })
  )
  
   const result= await step.run(`stripe-trigger`, async()=>context);
    await publish(
   StripeTriggerChannel().status({
      nodeId,
      status:"success"
   })
  )
   return result;
   
}