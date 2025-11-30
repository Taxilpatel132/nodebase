import { NodeType } from "@/generated/prisma";
import { no } from "zod/v4/locales";
import { NodeExecutor } from "../types";
import { manualTriggerExecuter } from "@/feature/triggers/components/manual-triggers/executor";
import { httpRequestExecuter } from "../components/http-request/executor";
export const executorRegistry:Record<NodeType,NodeExecutor>={
    [NodeType.MANUAL_TRIGGER]:manualTriggerExecuter,
     [NodeType.HTTP_REQUEST]:httpRequestExecuter,
      [NodeType.INITIAL]:manualTriggerExecuter,
}

export const getExecutor=(type:NodeType):NodeExecutor=>{
    const executor= executorRegistry[type];
    if(!executor){
        throw new Error(`No executor found for node type: ${type}`);
    }
    return executor;
}