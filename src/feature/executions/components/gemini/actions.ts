'use server';

import { getSubscriptionToken,type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { GeminiChannel } from "@/inngest/channels/gemini";

    
export type GeminiRequestToken=Realtime.Token<
typeof GeminiChannel,
['status']
>;

export async function fetchGeminiRealtimeToken():Promise<GeminiRequestToken>{
    const token=await getSubscriptionToken(inngest, {
        channel: GeminiChannel(),
        topics: ['status'],
    });
    return token;
}