'use server';

import { getSubscriptionToken,type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { OpenAiChannel } from "@/inngest/channels/openai";

    
export type openaiRequestToken=Realtime.Token<
typeof OpenAiChannel,
['status']
>;

export async function fetchOpenAiRealtimeToken():Promise<openaiRequestToken>{
    const token=await getSubscriptionToken(inngest, {
        channel: OpenAiChannel(),
        topics: ['status'],
    });
    return token;
}