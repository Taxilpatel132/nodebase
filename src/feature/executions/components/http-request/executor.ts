import type { NodeExecutor } from "@/feature/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as KyOptions} from "ky";
import Handlebars from "handlebars";

Handlebars.registerHelper('json', function(context) {
   const jsonString = JSON.stringify(context, null, 2);
   const safeString = new Handlebars.SafeString(jsonString);
   return safeString;
});

type HttpRequestData={
   variableName:string;
   endpoint:string;
   method:'GET' | 'POST' | 'PUT'|'PATCH' | 'DELETE';
   body?:string;
};

export const httpRequestExecuter:NodeExecutor<HttpRequestData>=async({data,context,step,nodeId})=>{
   if(!data.endpoint){
      throw new NonRetriableError("No endpoint provided for HTTP Request node");
   }
   if(!data.variableName){
      throw new NonRetriableError("No variable name provided for HTTP Request node");
   }
   if(!data.method){
      throw new NonRetriableError("No method provided for HTTP Request node");
   }

   //const result=await step.fetch(data.endpoint);
   const result= await step.run(`http-request`, async()=>{
      const method=data.method;
      const endpoint= Handlebars.compile(data.endpoint)(context);
      const options:KyOptions={method}
      if(['POST','PUT','PATCH'].includes(method)){
         const bodyTemplate= Handlebars.compile(data.body||"{}")(context);
         JSON.parse(bodyTemplate);
         options.body=bodyTemplate;
         options.headers={
            'Content-Type':'application/json',
         };

      }
      const response= await ky(endpoint,options);
      const contentType=response.headers.get('content-type');
      const responsedata= contentType?.includes('application/json') ? await response.json() : await response.text();

      const responsePayload={
         httpResponse:{
            status:response.status,
            statusText:response.statusText,
            data:responsedata,
      }
      }
     
    return {
        ...context,
        [data.variableName]:responsePayload
   }

  
   });
   return result;
   
}