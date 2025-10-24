
import { inngest } from '@/inngest/client';
import {  baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';



export const appRouter = createTRPCRouter({
    testAi: baseProcedure.mutation(async ()=>{
           await inngest.send({
            name:'execute/ai',
           
           });
           return { success: true ,message:'AI execution initiated.'};
          
    }),

    getWorkflows: protectedProcedure.query(({ctx}) => {
           try{
               return prisma.workflow.findMany();
           }catch (error){
               console.error("Error fetching workflows:", error);
               throw new Error("Failed to fetch workflows");
           }
        }),
    createWorkflow: protectedProcedure.mutation(async ()=>{
       await inngest.send({
        name:'test/hello.world',
        data:{
            email:'test@example.com',
        },
       })
        return { success: true ,message:'Workflow creation initiated via Inngest.'};
    })
});
// export type definition of API
export type AppRouter = typeof appRouter;