import { inngest } from "./client";
import * as Sentry from "@sentry/nextjs";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const groq = createGroq();

export const executeAI = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {

    await step.sleep('pretend', '5s');

    Sentry.logger.info('User triggered test log', { log_source: 'sentry_test' })
    console.warn("Error might detect by sentry");
    console.log('Error occur');

    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: "What is 2+2 ?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    const { steps: groqSteps } = await step.ai.wrap(
      "groq-generate-text",
      generateText,
      {
        model: groq("openai/gpt-oss-20b"),
        system: "You are a helpful assistant.",
        prompt: "What is 2+2 ?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openai("gpt-4"),
        system: "You are a helpful assistant.",
        prompt: "What is 2+2 ?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    return {
      geminiSteps,
      openaiSteps,
      groqSteps,
    };
  }
);
