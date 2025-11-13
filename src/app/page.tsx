'use client';
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const page = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useQuery(trpc.getWorkflows.queryOptions())

  const testAI = useMutation(trpc.testAi.mutationOptions())

  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: ()=> {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    }
  }));

  return (
    <div className="min-h-screen min-w-screen flex items-center flex-col justify-center">
      Protected server component 
      <p>
        {JSON.stringify(data, null, 2)}
      </p>

      <Button disabled={create.isPending} onClick={()=> create.mutate()}>
        Create Workflow
      </Button>
      <Button disabled={testAI.isPending} className="mt-2" onClick={()=> testAI.mutate()}>
        Test AI
      </Button>
    </div>
  );
};

export default page;
