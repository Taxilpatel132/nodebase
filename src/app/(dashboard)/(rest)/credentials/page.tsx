import { CredentialsList,CredentialsContainer, CredentialsError, CredentialsLoading } from "@/feature/credentials/components/credentials";
import { credentialsParamsLoader } from "@/feature/credentials/server/params-loader";
import { prefetchCredentials } from "@/feature/credentials/server/prefatch";
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
  const params=await credentialsParamsLoader(SearchParams);
  prefetchCredentials(params);
  return (
    <CredentialsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialsError />}>
          <Suspense fallback={<CredentialsLoading />}>
            <CredentialsList/>
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialsContainer>
  )
}
export default page;
