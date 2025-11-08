"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const loginSchema = z.object({
  email: z.email("Please provide a valid email address"),
  password: z.string().min(1, "Password required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    if (form.getValues("password").length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Login successful!");
          router.push("/");
        },
        onError: (ctx) => {
          console.error("Login error", ctx.error);
          toast.error(ctx.error.message);
        },
      }
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-muted-foreground/50">
        <CardHeader className="text-center">
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant={"outline"}
                    className="w-full border-muted-foreground/50"
                    type="button"
                    disabled={isPending}
                  >
                    <Image src={'/github.svg'} alt="Github" width={20} height={20} />
                    Continue with GitHub
                  </Button>
                  <Button
                    variant={"outline"}
                    className="w-full border-muted-foreground/50"
                    type="button"
                    disabled={isPending}
                  >
                    <Image src={'/google.svg'} alt="Google" width={20} height={20} />
                    Continue with Google
                  </Button>
                </div>

                <div className="grid gap-6">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="xyz@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="w-full" type="submit" disabled={isPending}>
                    {isPending ? (
                      <div className="flex gap-2 items-center">
                        <Spinner /> Logging in...
                      </div>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link href="/signup" className="underline-offset-4 underline">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
