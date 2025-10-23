import { SignupForm } from "@/feature/auth/components/signup-form";
import { requireUnauth } from "@/lib/auth-utils";


const page = async () => {
    await requireUnauth();
    return <div>
        <SignupForm />
    </div>;
}

export default page;
