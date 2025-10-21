
import { Button } from '@/components/ui/button';
import prisma from '@/lib/db';
export default async function Page() {
  const users = await prisma.user.findMany();
  return (

    <div className='min-h-screen min-w-screen flex items-center justify-center'>
      {JSON.stringify(users)}
    </div>
  );
}

