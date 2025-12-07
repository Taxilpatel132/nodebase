import prisma from "@/lib/db";
import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import { topologicalsort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma";
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
    retries: process.env.NODE_ENV === 'production' ? 3 : 0,
    onFailure: async ({ event, step }) => {
      return prisma.execution.update({
        where: {
          inngestEventId: event.data.event.id,
        },
        data: {
          status: ExecutionStatus.FAILED,
          error: event.data.error.message || "Unknown error",
          errorStack:event.data.error.stack || "",
        }
      });
    }
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
    const inngestEventId=event.id; 
   const { workflowId } = event.data;
   if( !inngestEventId || !workflowId){
    throw new NonRetriableError("no inngestId provided or No workflow ID provided");
   }
   await step.run('create-execution',async()=>{
    return prisma.execution.create({
        data:{
            inngestEventId,
            workflowId,
        }
    });
   })

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
    await step.run('update-execution', async () => {
         return prisma.execution.update({
          where: {
            inngestEventId,
            workflowId
          },
          data:{
             status: ExecutionStatus.SUCCESS,
             completedAt: new Date(),
            output:context
          }
         })
    })

    return {
      workflowId,
      result: context,
    };
  }
);