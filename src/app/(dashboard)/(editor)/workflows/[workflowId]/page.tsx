import { requireAuth } from "@/lib/auth-utils";

interface pageProps {
   params:Promise<{
     workflowId:string
   }>
}

const page = async ({params}:pageProps) => {
  await requireAuth();
  const {workflowId}=await params;
  return <div>Workflow Page for ID: {workflowId}</div>;
}
export default page;
