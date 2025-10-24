import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("a", "5s");
    await step.sleep("b", "5s");
    await step.sleep("c", "5s");
    await step.run("create-workflow", async () => {
        return prisma.workflow.create({
            data: {name: 'Workflow-form-inngest'},
        })
    });

   
  },
);