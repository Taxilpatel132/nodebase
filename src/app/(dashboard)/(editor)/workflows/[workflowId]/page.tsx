
import { Editor, EditorError, EditorLoading } from "@/feature/editor/components/editor";
import { EditorHeader } from "@/feature/editor/components/editor-header";
import { prefetchWorkflow } from "@/feature/workflows/server/prefatch";
import { requireAuth } from "@/lib/auth-utils";
import { prefetch } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import { Edit } from "lucide-react";
import { Suspense } from "react";
import {ErrorBoundary} from 'react-error-boundary';

interface pageProps {
   params:Promise<{
     workflowId:string
   }>
}

const page = async ({params}:pageProps) => {
  await requireAuth();
  const {workflowId}=await params;
  prefetchWorkflow(workflowId);
  return (
     <HydrateClient>
           <ErrorBoundary fallback={<EditorError />}>
          <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={workflowId} />
          <main className="flex-1">
          <Editor workflowId={workflowId} />
          </main>
      </Suspense>
      </ErrorBoundary>
      </HydrateClient>
  );
}
export default page;
