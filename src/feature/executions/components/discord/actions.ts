'use server';

import { getSubscriptionToken,type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";

import { DiscordChannel } from "@/inngest/channels/discord";

    
export type DiscordRequestToken=Realtime.Token<
typeof DiscordChannel,
['status']
>;

export async function fetchDiscordRealtimeToken():Promise<DiscordRequestToken>{
    const token=await getSubscriptionToken(inngest, {
        channel: DiscordChannel(),
        topics: ['status'],
    });
    return token;
}