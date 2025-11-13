import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { createOpenAI } from '@ai-sdk/openai';
import { createGroq  } from '@ai-sdk/groq';

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const groq = createGroq();

export const executeAI = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps: geminiSteps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google('gemini-2.5-flash'),
      system: 'You are a helpful assistant.',
      prompt: 'What is 2+2 ?'
    });
    
    const { steps: groqSteps } = await step.ai.wrap("groq-generate-text", generateText, {
      model: groq('openai/gpt-oss-120b'),
      system: 'You are a helpful assistant.',
      prompt: 'What is 2+2 ?'
    });

    const { steps: openaiSteps } = await step.ai.wrap("openai-generate-text", generateText, {
      model: openai('gpt-4'),
      system: 'You are a helpful assistant.',
      prompt: 'What is 2+2 ?'
    });
    

    return {
      geminiSteps,
      openaiSteps,
      groqSteps
    };
  },
);