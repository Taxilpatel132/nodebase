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

import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';

const signupFormSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
        
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

export const SignupForm = () => {
    const router = useRouter();
    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });
    const onSubmit = async (values: SignupFormValues) => {
        await authClient.signUp.email({
            name:values.email,

            email: values.email,
            password: values.password,
            callbackURL:'/'

        },
        {
            onSuccess: () => {
                toast.success('Account created successfully!');
                router.push('/');
            },
            onError: (cnt) => {
                toast.error(`Error: ${cnt.error.message}`);
            }
        }
    )
    }

    const ispanding = form.formState.isSubmitting;
    return (
        <div className='flex flex-col gap-6'>
            <Card>
                <CardHeader className='text-center'>
                    <CardTitle>
                        Get started today!
                    </CardTitle>
                    <CardDescription>
                        Create your account
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
                                     <FormField
                                        control={form.control}
                                        name='confirmPassword'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type='password'  placeholder='••••••••' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='submit' disabled={ispanding} className='w-full'>
                                        {ispanding ? 'Signing up...' : 'Sign Up'}
                                    </Button>
                                </div>
                                <div className='text-sm text-center'>
                                    Already have an account?{" "}<Link href='/login'>Log in</Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
