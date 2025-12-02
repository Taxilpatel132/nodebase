import { InitialNode } from "@/components/initial-node";
import { HttpRequestNode } from "@/feature/executions/components/http-request/node";
import { GoogleFormTriggerNode } from "@/feature/triggers/components/google-form-trigger/node";
import { ManualTriggerNode } from "@/feature/triggers/components/manual-triggers/node";
import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents={
    [NodeType.INITIAL]:InitialNode,
    [NodeType.MANUAL_TRIGGER]:ManualTriggerNode,
    [NodeType.HTTP_REQUEST]:HttpRequestNode,
    [NodeType.GOOGLE_FORM_TRIGGER]:GoogleFormTriggerNode,

}as const satisfies NodeTypes;


export type RegisteredNodeType= keyof typeof nodeComponents;