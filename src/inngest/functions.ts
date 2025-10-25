import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
const google = createGoogleGenerativeAI();
import * as Sentry from "@sentry/nextjs";

export const executeAi = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
  

  Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' })
    await step.sleep('pretend','5s');
    const steps=await step.ai.wrap("gemini-generate-text", generateText,{
      model: google("gemini-2.5-flash"),
      system: "You are a helpful assistant.",
      prompt: "what is 2+2?",
       experimental_telemetry: {
    isEnabled: true,
    recordInputs: true,
    recordOutputs: true,
  },
    });

    return steps;
  }
);