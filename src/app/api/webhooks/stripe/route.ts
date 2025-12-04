import { sendWorkflowExecution } from "@/inngest/utils";
import { google } from "@ai-sdk/google";

import {type  NextRequest,NextResponse } from "next/server";




export async function POST(request:NextRequest){
    try{
         const url=new URL(request.url);
         const workfolwId=url.searchParams.get("workflowId");
            if(!workfolwId){
                return NextResponse.json({
                    success:false,
                    error:"No workflowId provided"
                },{status:400});
            }

            const body=await request.json();
            const stripeData={
               eventId:body.id,
               eventType:body.type,
               timestamp:body.created,
               livemode:body.livemode,
               raw:body.data?.object
            }

            await sendWorkflowExecution({
                workflowId:workfolwId,
                initialData:{
                    stripe: stripeData
                }
            });

       
    }catch(error){
        console.error("Error in Stripe workflow route:",error);
        return NextResponse.json({
            success:false,
            error:"Internal Server Error"}, {status:500});
    }
}