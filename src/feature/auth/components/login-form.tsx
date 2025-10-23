'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,

} from '@/components/ui/form';

import { Input } from '@/components/ui/input';


import { authClient } from '@/lib/auth-client';

const loginformSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginformSchema>;

export const LoginForm = () => {
    const router = useRouter();
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginformSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const onSubmit = async (values: LoginFormValues) => {
     await authClient.signIn.email({
        email:values.email,
        password:values.password,
        callbackURL:'/'

     },{
        onSuccess(){
           
            router.push('/');
        },
        onError(cnt){
            toast.error(`Login failed: ${cnt.error.message}`);
        }
     })
    }

    const ispanding = form.formState.isSubmitting;
    return (
        <div className='flex flex-col gap-6'>
            <Card>
                <CardHeader className='text-center'>
                    <CardTitle>
                        wellcome back!
                    </CardTitle>
                    <CardDescription>
                        Sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='grid gap-6'>
                                <div className='flex flex-col gap-4'>
                                    <Button variant='outline' className="w-full" type='button' disabled={ispanding}>
                                        continue with github
                                    </Button>
                                    <Button variant='outline' className="w-full" type='button' disabled={ispanding}>
                                        continue with google
                                    </Button>
                                </div>
                                <div className='grid  gap-6'>
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type='email'  placeholder='you@example.com' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type='password'  placeholder='••••••••' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='submit' disabled={ispanding} className='w-full'>
                                        {ispanding ? 'Logging in...' : 'Login'}
                                    </Button>
                                </div>
                                <div className='text-sm text-center'>
                                    Don't have an account?{" "}<Link href='/signup'>Sign up</Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
