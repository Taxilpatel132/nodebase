import { requireAuth } from "@/lib/auth-utils";

const page = async() => {
  await requireAuth();
  return <div>Workflows Page</div>;
}
export default page;