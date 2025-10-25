import { requireAuth } from "@/lib/auth-utils";

const page = async() => {
  await requireAuth();
  return <div>credentials Page</div>;
}
export default page;