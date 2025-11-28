'use client';
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Node, type Edge, type NodeChange,type EdgeChange,type Connection, Background, Controls, MiniMap, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; 
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/feature/workflows/hooks/use-workflows";
import { nodeComponents } from '@/config/node-components';
import { AddNodeButton } from './add-node-button';
import { useSetAtom } from 'jotai';
import { editorAtoms } from '../store/atoms';

export const EditorLoading=() => {
    return <LoadingView message="Loading editor..." />
}

export const EditorError=() => {
    return <ErrorView message="Failed to load editor." />
}

 
export const Editor=({workflowId}:{workflowId:string}) => {
    const {data:workflows}=useSuspenseWorkflow(workflowId);
    const [nodes, setNodes] = useState<Node[]>(workflows.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflows.edges);
  const setEditor=useSetAtom(editorAtoms);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
    return (
       <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                nodeTypes={nodeComponents}
                onInit={setEditor}
                snapGrid={[10,10]}
                snapToGrid
                panOnScroll
                panOnDrag={false}
                selectionOnDrag
            >
                <Background />
                <Controls /> 
                <MiniMap />
                <Panel position='top-right'>
                    <AddNodeButton />
                </Panel>
            </ReactFlow>
       </div>
    )
}