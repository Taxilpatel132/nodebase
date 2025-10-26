import {generateSlug} from 'random-word-slugs'
import  prisma  from '@/lib/db'
import { createTRPCRouter, premiumProcedure, protectedProcedure } from '@/trpc/init';
import z from 'zod';
import { id } from 'date-fns/locale';

export const workflowsRouter = createTRPCRouter({
    create: premiumProcedure.mutation(async ({ctx})=>{
        return prisma.workflow.create({
            data:{
                name:generateSlug(3),
                userId:ctx.auth.user.id, 
            }
        });
    }),
    remove:protectedProcedure.input(z.object({id:z.string()})).mutation(async({ctx,input})=>{
        return prisma.workflow.delete({
            where:{
                id:input.id,//make sure only owner can delete & input is unique id
                userId:ctx.auth.user.id,
            }
        });
    }),
    updateName:protectedProcedure.input(z.object({id:z.string(),name:z.string()})).mutation(async({ctx,input})=>{
        return prisma.workflow.update({
            where:{
                id:input.id,
                userId:ctx.auth.user.id,
            },
            data:{
                name:input.name,
            }
        });
    }),
    getOne:protectedProcedure.input(z.object({id:z.string()})).query(async({ctx,input})=>{
        return prisma.workflow.findUnique({
            where:{
                id:input.id,
                userId:ctx.auth.user.id,
            }
        });
    
        }),
    getMany:protectedProcedure.query(async({ctx,})=>{
        return prisma.workflow.findMany({
            where:{
                userId:ctx.auth.user.id,
            }
        });
        }),
    
});