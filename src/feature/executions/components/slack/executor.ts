import type { NodeExecutor } from "@/feature/executions/types";
import { NonRetriableError } from "inngest";

import Handlebars from "handlebars";

import {decode} from 'html-entities'
import ky from "ky";
import { SlackChannel } from "@/inngest/channels/slack";
Handlebars.registerHelper('json', function(context) {
   const jsonString = JSON.stringify(context, null, 2);
   const safeString = new Handlebars.SafeString(jsonString);
   return safeString;
});

type SlackData={
   variableName?:string;
     webhookUrl?:string;
  
    content?:string;
};

export const slackExecutor:NodeExecutor<SlackData>=async({data,context,step,nodeId,publish})=>{
    await publish(
      SlackChannel().status({
         nodeId,
         status:'loading'
      }),
    );

if(!data.webhookUrl){
   await publish(
      SlackChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw new NonRetriableError("No webhook URL provided for Slack node");
}
if(!data.content){
   await publish(
      SlackChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw new NonRetriableError("no content provided for Slack node");
}
const rewContent=Handlebars.compile(data.content)(context);
const content=decode(rewContent);

   try{
     const result=await step.run('slack-webhook',async()=>{
      if(!data.variableName){
   await publish(
      SlackChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw new NonRetriableError("No variable name provided for Slack node");
}
      await ky.post(data.webhookUrl!,{
         json:{
         content:content,
        
         }
      })

      return {
         ...context,
         [data.variableName]: {
          text:content.slice(0,2000),
      }
     }
    } )
   
     await publish(
      SlackChannel().status({
         nodeId,
         status:'success'
      }),
    );
    return result;
}
   
   catch(error){
await publish(
      SlackChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw error;
   }
}