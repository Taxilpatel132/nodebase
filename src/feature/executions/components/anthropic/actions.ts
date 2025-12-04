'use server';

import { getSubscriptionToken,type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { AnthropicChannel} from "@/inngest/channels/anthropic";

    
export type anthropicRequestToken=Realtime.Token<
typeof AnthropicChannel,
['status']
>;

export async function fetchAnthropicRealtimeToken():Promise<anthropicRequestToken>{
    const token=await getSubscriptionToken(inngest, {
        channel: AnthropicChannel(),
        topics: ['status'],
    });
    return token;
}