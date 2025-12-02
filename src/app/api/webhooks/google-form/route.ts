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
            const formData={
                formId:body.formId,
                formTitle:body.formTitle,
                responseId:body.responseId,
                timestamp:body.timestamp,
                respondentEmail:body.respondentEmail,
                responses:body.responses,
                raw:body
            }

            await sendWorkflowExecution({
                workflowId:workfolwId,
                initialData:{
                    googleform: formData
                }
            });
    }catch(error){
        console.error("Error in Google Form workflow route:",error);
        return NextResponse.json({
            success:false,
            error:"Internal Server Error"}, {status:500});
    }
}