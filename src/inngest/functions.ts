import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
const google = createGoogleGenerativeAI();
import * as Sentry from "@sentry/nextjs";
import { NonRetriableError } from "inngest";
import { topologicalsort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecutor } from "@/feature/executions/lib/executor-registry";
import { HttpRequestChannel } from "./channels/http-request";
import { ManualTriggerChannel } from "./channels/manual-trigger";

export const executeWorkflow = inngest.createFunction(
  { 
    id: "execute-workflow", 
    retries: 0
  },
  { event: "workflow/execute.workflow",
    channels:[
      HttpRequestChannel(),
      ManualTriggerChannel()
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


    //initialize context
    let context = event.data.initialData || {};
    for(const node of sortedNodes){
      const executor=getExecutor(node.type as NodeType);
      context=await executor({
        data:node.data as Record<string,unknown>,
        context,
        step,
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