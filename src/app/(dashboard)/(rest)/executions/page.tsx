
import { ExecutionsContainer, ExecutionsError, ExecutionsList, ExecutionsLoading } from "@/feature/executions/components/executions";
import { executionParamsLoader } from "@/feature/executions/server/params-loader";
import { prefetchExecutions } from "@/feature/executions/server/prefatch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
type Props = {
  SearchParams: Promise<SearchParams>;
}

const page = async ({SearchParams}:Props) => {
  await requireAuth();
  const params=await executionParamsLoader(SearchParams);
  prefetchExecutions(params);
  return (
    <>
      <ExecutionsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ExecutionsError />}>
          <Suspense fallback={<ExecutionsLoading />}>
            <ExecutionsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
      </ExecutionsContainer>
    </>
  )
}
export default page;
