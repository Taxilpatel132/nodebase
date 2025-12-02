'use client';

import { Button } from "@/components/ui/button";
import{
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";

interface Props{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
}

export const GoogleFormTriggerDialog=({
    open,
    onOpenChange
}:Props)=>{
    const parmas= useParams();
    const workflowId=parmas.workflowId as string;
    const BaseUrl=process.env.NEXT_PUBLIC_BASE_URL||'http://localhost:3000';
    const webhookurl=`${BaseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;
    const copyToClipboard=async()=>{
        try{
            await navigator.clipboard.writeText(webhookurl);
           toast.success('Webhook URL copied to clipboard');
        }catch(err){
            toast.error('Failed to copy Webhook URL');
        }
    }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Google Form Trigger Activated</DialogTitle>
                <DialogDescription>
                   use this Webhook Url in your google form's apps Script to trigger the workflow when a form is submitted.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="webhook-url">
                    Webhook URL
                </Label>
                <div className="flex gap-2">
                    <Input
                    id="webhook-url"
                    value={webhookurl}
                    readOnly
                    className="font-mono test-sm"
                    />
                    <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={copyToClipboard}
                    >
                        <CopyIcon className="size-4"/>
                    </Button>
                </div>
               </div>
               <div className=" rounded-lg bg-muted p-4 space-y-2">
                <h4 className="font-medium text-sm">Instructions</h4>
                <ol className="list-decimal list-inside text-muted-foreground text-sm space-y-1">
                    <li>Open your Google Form.</li>
                    <li> Click the three dots menu - Script editor.</li>
                    <li> copy and paste the script below</li>
                    <li>Replace WEBHOOK_URL with the above webhook URL in the script.</li>
                    <li>save and click "Triggers"-  Add Trigger.</li>
                    <li> Choose: From form - On form submit - same </li>
                </ol>
               </div>
               <div className="rounded-lg bg-muted p-4 space-y-4">
                <h4 className="font-medium text-sm">Google Apps Script:</h4>
                <Button  
                type='button'
                variant='outline'
                onClick={async()=>{
                    const script=generateGoogleFormScript(webhookurl);
                    try{
                        await navigator.clipboard.writeText(script);
                        toast.success('Google Apps Script copied to clipboard');
                    }catch(err){
                        toast.error('Failed to copy script');
                    }
                }}

                >
                 <CopyIcon className="size-4 mr-2"/>
                    Copy Google Apps Script
                </Button>

                <p className="text-xs text-muted-foreground">
                  this script captures form submissions and sends the data to the specified webhook URL in JSON format.
                </p> 
               </div>
               <div className=" rounded-lg bg-muted p-4 space-y-2">
                <h4 className="font-medium text-sm">Available Variables</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{googleForm.respondentEmail}}"}
                            </code>
                            -- Respondent's Email
                        </li>
                         <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{googleForm.responses['Question name']}}"}
                            </code>
                            -- specific answer
                        </li>
                          <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{json googleForm.responses}}"}
                            </code>{" "}
                            -- all responses as JSON
                        </li>
                    </ul>
                
               </div>
            </div>
        </DialogContent>
    </Dialog>
    );
}