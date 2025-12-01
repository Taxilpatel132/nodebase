'use server';

import { getSubscriptionToken,type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { ManualTriggerChannel } from "@/inngest/channels/manual-trigger";


export type manualTriggerToken=Realtime.Token<
typeof ManualTriggerChannel,
['status']
>;

export async function fatchManualTriggerRealtimeToken():Promise<manualTriggerToken>{
    const token=await getSubscriptionToken(inngest, {
        channel: ManualTriggerChannel(),
        topics: ['status'],
    });
    return token;
}