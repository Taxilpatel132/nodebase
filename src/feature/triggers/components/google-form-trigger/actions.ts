'use server';

import { getSubscriptionToken,type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";

import { GoogleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";


export type GoogleFornTriggerToken=Realtime.Token<
typeof GoogleFormTriggerChannel,
['status']
>;
    
export async function fatchGoogleFormTriggerRealtimeToken():Promise<GoogleFornTriggerToken>{
    const token=await getSubscriptionToken(inngest, {
        channel: GoogleFormTriggerChannel(),
        topics: ['status'],
    });
    return token;
}