import type { NodeExecutor } from "@/feature/executions/types";
import { NonRetriableError } from "inngest";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import Handlebars from "handlebars";
import { DiscordChannel } from "@/inngest/channels/discord";
import { generateText } from "ai";
import prisma from "@/lib/db";
import {decode} from 'html-entities'
import ky from "ky";
Handlebars.registerHelper('json', function(context) {
   const jsonString = JSON.stringify(context, null, 2);
   const safeString = new Handlebars.SafeString(jsonString);
   return safeString;
});

type DiscordData={
   variableName?:string;
     webhookUrl?:string;
    userName?:string;
    content?:string;
};

export const discordExecutor:NodeExecutor<DiscordData>=async({data,context,step,nodeId,publish})=>{
    await publish(
      DiscordChannel().status({
         nodeId,
         status:'loading'
      }),
    );

if(!data.webhookUrl){
   await publish(
      DiscordChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw new NonRetriableError("No webhook URL provided for Discord node");
}
if(!data.content){
   await publish(
      DiscordChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw new NonRetriableError("no content provided for Discord node");
}
const rewContent=Handlebars.compile(data.content)(context);
const content=decode(rewContent);
const username=data.userName ? Handlebars.compile(data.userName)(context) : undefined;
   

   
   try{
     const result=await step.run('discord-webhook',async()=>{
      if(!data.variableName){
   await publish(
      DiscordChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw new NonRetriableError("No variable name provided for Discord node");
}
      await ky.post(data.webhookUrl!,{
         json:{
         content:content.slice(0,2000),
         username:username,
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
      DiscordChannel().status({
         nodeId,
         status:'success'
      }),
    );
    return result;
}
   
   catch(error){
await publish(
      DiscordChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw error;
   }
}