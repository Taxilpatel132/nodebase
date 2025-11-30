import type { NodeExecutor } from "@/feature/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as KyOptions} from "ky";
type HttpRequestData={
   endpoint?:string;
   method?:'GET' | 'POST' | 'PUT'|'PATCH' | 'DELETE';
   body?:string;
};

export const httpRequestExecuter:NodeExecutor<HttpRequestData>=async({data,context,step,nodeId})=>{
   if(!data.endpoint){
      throw new NonRetriableError("No endpoint provided for HTTP Request node");
   }

   //const result=await step.fetch(data.endpoint);
   const result= await step.run(`http-request`, async()=>{
      const method=data.method || 'GET';
      const endpoint=data.endpoint!
      const options:KyOptions={method}
      if(['POST','PUT','PATCH'].includes(method)){
         options.body=data.body;
      }
      const response= await ky(endpoint,options);
      const contentType=response.headers.get('content-type');
      const responsedata= contentType?.includes('application/json') ? await response.json() : await response.text();
      return {
        ...context,
        httpResponse:{
            status:response.status,
            statusText:response.statusText,
            data:responsedata,
      }
   }
   });
   return result;
   
}