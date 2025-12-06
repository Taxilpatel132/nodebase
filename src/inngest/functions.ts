import prisma from "@/lib/db";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import { topologicalsort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecutor } from "@/feature/executions/lib/executor-registry";
import { HttpRequestChannel } from "./channels/http-request";
import { ManualTriggerChannel } from "./channels/manual-trigger";
import { GoogleFormTriggerChannel } from "./channels/google-form-trigger";
import { StripeTriggerChannel } from "./channels/stripe-trigger";
import { GeminiChannel } from "./channels/gemini";
import { OpenAiChannel } from "./channels/openai";
import { DiscordChannel } from "./channels/discord";
import { SlackChannel } from "./channels/slack";

export const executeWorkflow = inngest.createFunction(
  { 
    id: "execute-workflow", 
    retries: 0
  },
  { event: "workflow/execute.workflow",
    channels:[
      HttpRequestChannel(),
      ManualTriggerChannel(),
      GoogleFormTriggerChannel(),
      StripeTriggerChannel(),
      GeminiChannel(),
      OpenAiChannel(),
      DiscordChannel(),
      SlackChannel()
    ]
   },
  async ({ event, step ,publish}) => {
   const { workflowId } = event.data;
   if(!workflowId){
    throw new NonRetriableError("No workflow ID provided");
   }
    const sortedNodes=await step.run('prepare-workflow', async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: { nodes: true
          ,connections:true
         },
      });
      return topologicalsort(workflow.nodes, workflow.connections);
    });

    const userID=await step.run('get-user-id', async()=>{
      const workflow=await prisma.workflow.findUniqueOrThrow({
        where:{id:workflowId},
        select:{userId:true}
      });
      return workflow.userId;
    });
    //initialize context
    let context = event.data.initialData || {};
    for(const node of sortedNodes){
      const executor=getExecutor(node.type as NodeType);
      context=await executor({
        data:node.data as Record<string,unknown>,
        context,
        step,
        userID,
        nodeId:node.id,
        publish
      });
    }
    return {
      workflowId,
      result: context,
    };
  }
);