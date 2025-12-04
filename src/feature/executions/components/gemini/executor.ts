import type { NodeExecutor } from "@/feature/executions/types";
import { NonRetriableError } from "inngest";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import Handlebars from "handlebars";
import { GeminiChannel } from "@/inngest/channels/gemini";
import { generateText } from "ai";

Handlebars.registerHelper('json', function(context) {
   const jsonString = JSON.stringify(context, null, 2);
   const safeString = new Handlebars.SafeString(jsonString);
   return safeString;
});

type GeminiData={
   variableName?:string;
   systemPrompt?: string;
   userPrompt?: string;
};

export const geminiExecutor:NodeExecutor<GeminiData>=async({data,context,step,nodeId,publish})=>{
    await publish(
      GeminiChannel().status({
         nodeId,
         status:'loading'
      }),
    );
if(!data.variableName){
   await publish(
      GeminiChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw new NonRetriableError("No variable name provided for Gemini node");
}
if(!data.userPrompt){
   await publish(
      GeminiChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw new NonRetriableError("no userPrompt provided for Gemini node");
}

  const systemPrompt= data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : 'You are A helpful assistant.';
   const userPrompt= Handlebars.compile(data.userPrompt)(context);
   const CredentialValue=process.env.GOOGLE_API_KEY!;
   const google= createGoogleGenerativeAI({
      apiKey:CredentialValue,
   })
   try{
     const {steps}=await step.ai.wrap(
      'gemini-generate-text',
      generateText,
      {
         model: google('gemini-2.0-flash'),
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
      GeminiChannel().status({
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
      GeminiChannel().status({
         nodeId,
         status:'error'
      }),
    );
    throw error;
   }
}