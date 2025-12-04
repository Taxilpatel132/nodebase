import { InitialNode } from "@/components/initial-node";
import { HttpRequestNode } from "@/feature/executions/components/http-request/node";
import { GoogleFormTriggerNode } from "@/feature/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/feature/triggers/components/manual-triggers/node";
import { StripeTriggerNode } from "@/feature/triggers/components/stripe-trigger/node";
import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from "@xyflow/react";
import { GeminiNode } from "@/feature/executions/components/gemini/node";
import { OpenAiNode } from "@/feature/executions/components/openAi/node";
import { AnthropicNode } from "@/feature/executions/components/anthropic/node";

export const nodeComponents={
    [NodeType.INITIAL]:InitialNode,
    [NodeType.MANUAL_TRIGGER]:ManualTriggerNode,
    [NodeType.HTTP_REQUEST]:HttpRequestNode,
    [NodeType.GOOGLE_FORM_TRIGGER]:GoogleFormTriggerNode,
    [NodeType.STRIPE_TRIGGER]:StripeTriggerNode,
    [NodeType.GEMINI]:GeminiNode,
    [NodeType.OPENAI]:OpenAiNode, //placeholder
    [NodeType.ANTHOROPIC]:AnthropicNode, //placeholder
}as const satisfies NodeTypes;


export type RegisteredNodeType= keyof typeof nodeComponents;