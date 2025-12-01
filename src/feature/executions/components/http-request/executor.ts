import type { NodeExecutor } from "@/feature/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as KyOptions} from "ky";
type HttpRequestData={
   variableName?:string;
   endpoint?:string;
   method?:'GET' | 'POST' | 'PUT'|'PATCH' | 'DELETE';
   body?:string;
};

export const httpRequestExecuter:NodeExecutor<HttpRequestData>=async({data,context,step,nodeId})=>{
   if(!data.endpoint){
      throw new NonRetriableError("No endpoint provided for HTTP Request node");
   }
   if(!data.variableName){
      throw new NonRetriableError("No variable name provided for HTTP Request node");
   }

   //const result=await step.fetch(data.endpoint);
   const result= await step.run(`http-request`, async()=>{
      const method=data.method || 'GET';
      const endpoint=data.endpoint!
      const options:KyOptions={method}
      if(['POST','PUT','PATCH'].includes(method)){
         options.body=data.body;
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
     
     if(data.variableName) return {
        ...context,
        [data.variableName]:responsePayload
   }

   return{
      ...context,
      ...responsePayload
   }
   });
   return result;
   
}