import { requireAuth } from "@/lib/auth-utils";

interface pageProps {
   params:Promise<{
     executionId:string
   }>
}

const page = async ({params}:pageProps) => {
  await requireAuth();
  const {executionId}=await params;
  return <div>Execution Page for ID: {executionId}</div>;
}
export default page;
