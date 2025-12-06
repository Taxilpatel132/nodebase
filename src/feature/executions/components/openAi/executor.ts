import type { NodeExecutor } from "@/feature/executions/types";
import { NonRetriableError } from "inngest";
import { createOpenAI } from "@ai-sdk/openai";
import Handlebars from "handlebars";
import { OpenAiChannel } from "@/inngest/channels/openai";
import { generateText } from "ai";
import prisma from "@/lib/db";

Handlebars.registerHelper('json', function(context) {
   const jsonString = JSON.stringify(context, null, 2);
   const safeString = new Handlebars.SafeString(jsonString);
   return safeString;
});

type OpenAiData={
   variableName?:string;
   credentialId?:string;
   systemPrompt?: string;
   userPrompt?: string;
};

export const openAiExecutor:NodeExecutor<OpenAiData>=async({data,context,step,nodeId,publish})=>{
    await publish(
      OpenAiChannel().status({
         nodeId,
         status:'loading'
      }),
    );
if(!data.variableName){
   await publish(
      OpenAiChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw new NonRetriableError("No variable name provided for OpenAI node");
}
if(!data.credentialId){
   await publish(
      OpenAiChannel().status({
         nodeId,
         status:'error'
      }),
    );
      throw new NonRetriableError("No credentialId provided for OpenAI node");
}
if(!data.userPrompt){
   await publish(
      OpenAiChannel().status({
         nodeId,
         status:'error'
      }),
      );  throw new NonRetriableError("no userPrompt provided for OpenAI node");
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
      throw new NonRetriableError("Invalid credential ID provided for OpenAI node");
   }
   
   const openai= createOpenAI({
      apiKey:credential.value,
   })
   try{
     const {steps}=await step.ai.wrap(
      'openai-generate-text',
      generateText,
      {
         model: openai('gpt-5'),
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
      OpenAiChannel().status({
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
      OpenAiChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw error;
   }
}