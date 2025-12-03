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


interface Props{
    open:boolean;
    onOpenChange:(open:boolean)=>void;
}

export const StripeTriggerDialog=({
    open,
    onOpenChange
}:Props)=>{
    const parmas= useParams();
    const workflowId=parmas.workflowId as string;
    const BaseUrl=process.env.NEXT_PUBLIC_BASE_URL||'http://localhost:3000';
    const webhookurl=`${BaseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;
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
                <DialogTitle>Stripe Trigger Activated</DialogTitle>
                <DialogDescription>
                   use this Webhook Url in your stripe's apps Script to trigger the workflow when a form is submitted.
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
                    <li>Open your stripe dashboard. </li >
                    <li> Go to Developers -webhooksm  .</li>
                    <li> Click "Add endpoints"</li>
                    <li>Paste the webhook url above.</li>
                    <li>Select events to listen for (e.g. ,Payment_intent.succeeded</li>
                    <li> Save and copy the Signing secret.</li>
                </ol>
               </div>
              
               <div className=" rounded-lg bg-muted p-4 space-y-2">
                <h4 className="font-medium text-sm">Available Variables</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{stripe.Amount}}"}
                            </code>
                            -- Payment Amount
                        </li>
                         <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{stripe.Currency}}"}
                            </code>
                            -- Currency code
                        </li>
                          <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{stripe.CustomerId}}"}
                            </code>{" "}
                            -- CustomerId
                        </li>
                         <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{json stripe}}"}
                            </code>{" "}
                            -- Full event payload
                        </li>
                          <li>
                            <code className="bg-background px-1 py-0.5 rounded">
                                {"{{stripe.eventType}}"}
                            </code>{" "}
                            -- event type
                        </li>
                    </ul>
                
               </div>
            </div>
        </DialogContent>
    </Dialog>
    );
}