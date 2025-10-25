import { requireAuth } from "@/lib/auth-utils";

interface pageProps {
   params:Promise<{
     credentialId:string
   }>
}

const page = async ({params}:pageProps) => {
  await requireAuth();
  const {credentialId}=await params;
  return <div>Credential Page for ID: {credentialId}</div>;
}
export default page;
