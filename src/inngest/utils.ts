import { Connection, Node } from "@/generated/prisma";

import toposort from "toposort";
import { inngest } from "./client";

export const topologicalsort=(
    nodes:Node[],
    connections:Connection[]
):Node[]=>{
   if (connections.length===0){
    return nodes;
   }
    const edges:[string,string][]=connections.map((conn)=>[
        conn.formNodeId,
        conn.toNodeId
    ]);

    const connectedNodeIds=new Set<string>();
    for(const conn of connections){
        connectedNodeIds.add(conn.formNodeId);
        connectedNodeIds.add(conn.toNodeId);
    }

    // Add isolated nodes as self-loop edges
    for(const node of nodes){
        if(!connectedNodeIds.has(node.id)){
            edges.push([node.id,node.id]);
        }
    }
    // Perform topological sort
    let sortedNodeIds:string[];
    try{
        sortedNodeIds=toposort(edges);
        sortedNodeIds=[...new Set(sortedNodeIds)];
    }catch(error){
        if(error instanceof Error && error.message.includes('Cyclic')){
            throw new Error("Cyclic dependency detected in workflow nodes.");
        }
        throw error;
    }
    const nodeMap=new Map(nodes.map((n)=>[n.id,n]));
    return sortedNodeIds.map((id)=>nodeMap.get(id)!).filter(Boolean);
};

export const sendWorkflowExecution=async(data:{
    workflowId:string;
    [key:string]:any;
})=>{
    return inngest.send({
        name:"workflow/execute.workflow",
        data,
    })
}