import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";

export const appRouter = createTRPCRouter({
  testAi: protectedProcedure.mutation(async()=> {
    await inngest.send({
      name: 'execute/ai',
    });

    return {success: true, message: 'AI Job queued'}
  }),

  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workFlow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async()=> {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: 'irsamd07@gmail.com'
      },
    });

    return prisma.workFlow.create({
      data: {
        name: "test-workflow"
      }
    })
  })
});
// export type definition of API
export type AppRouter = typeof appRouter;
