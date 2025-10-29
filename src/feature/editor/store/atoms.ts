import type { ReactFlowInstance } from "@xyflow/react";
import {atom} from "jotai";
export const editorAtoms=atom<ReactFlowInstance|null>(null);