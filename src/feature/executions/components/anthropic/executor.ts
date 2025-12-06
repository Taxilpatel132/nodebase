import type { NodeExecutor } from "@/feature/executions/types";
import { NonRetriableError } from "inngest";
import { createAnthropic } from "@ai-sdk/anthropic";
import Handlebars from "handlebars";
import { AnthropicChannel } from "@/inngest/channels/anthropic";
import { generateText } from "ai";

import prisma from "@/lib/db";

Handlebars.registerHelper('json', function(context) {
   const jsonString = JSON.stringify(context, null, 2);
   const safeString = new Handlebars.SafeString(jsonString);
   return safeString;
});

type AnthropicData={
   variableName?:string;
   credentialId?:string; 
   systemPrompt?: string;
   userPrompt?: string;
};

export const anthropicExecutor:NodeExecutor<AnthropicData>=async({data,context,step,nodeId,publish})=>{
    await publish(
      AnthropicChannel().status({
         nodeId,
         status:'loading'
      }),
    );
if(!data.variableName){
   await publish(
      AnthropicChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw new NonRetriableError("No variable name provided for Anthropic node");
}

if(!data.credentialId){
   await publish(
      AnthropicChannel().status({
         nodeId,
         status:'error'
      }),
    );
      throw new NonRetriableError("No credentialId provided for Anthropic node");
}
if(!data.userPrompt){
   await publish(
      AnthropicChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw new NonRetriableError("no userPrompt provided for Anthropic node");
}

  const systemPrompt= data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : 'You are A helpful assistant.';
   const userPrompt= Handlebars.compile(data.userPrompt)(context);
   const credential=await step.run('get-credential', async()=>{
      return prisma.credential.findUnique({
         where:{
            id: data.credentialId,
         },
      });
   });

   if(!credential){
      throw new NonRetriableError("Invalid credential ID provided for Anthropic node");
   }
  
   const anthropic= createAnthropic({
      apiKey:credential.value,
   })
   try{
     const {steps}=await step.ai.wrap(
      'anthropic-generate-text',
      generateText,
      {
         model: anthropic('gpt-5'),
         system: systemPrompt,
         prompt: userPrompt,
         experimental_telemetry:{
            isEnabled:true,
            recordInputs:true,
            recordOutputs:true,
         },
      },
     );
     const text=steps[0].content[0].type==='text' ? steps[0].content[0].text : '';
     await publish(
      AnthropicChannel().status({
         nodeId,
         status:'success'
      }),
    );

return {
     ...context,
     [data.variableName]: {
      text,
     },
}
   }catch(error){
await publish(
      AnthropicChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw error;
   }
}