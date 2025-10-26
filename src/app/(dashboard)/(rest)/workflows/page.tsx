import { requireAuth } from "@/lib/auth-utils";
import { WorkflowsContainer, WorkflowsList } from "@/feature/workflows/components/workflows";
import {prefetchWorkflows} from "@/feature/workflows/server/prefatch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import {ErrorBoundary} from 'react-error-boundary';
const page = async() => {
  

    await requireAuth();
    await prefetchWorkflows();
  return (
    <WorkflowsContainer>
    <HydrateClient>
      <Suspense fallback={<p>Loading workflows...</p>}>
        <ErrorBoundary fallback={<p>Failed to load workflows.</p>}>
          <WorkflowsList />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
    </WorkflowsContainer>
  );
}
export default page;