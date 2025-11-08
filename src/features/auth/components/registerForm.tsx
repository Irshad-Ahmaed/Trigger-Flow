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

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.email("Please provide a valid email address"),
    password: z.string().min(1, "Password required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    if (form.getValues("password").length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Account created Successfully!.");
          router.push("/");
        },
        onError: (ctx) => {
          console.error("Registration error", ctx.error);
          toast.error(`Error: ${ctx.error.message}`);
        },
      }
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-muted-foreground/50">
        <CardHeader className="text-center">
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create an account to get started</CardDescription>
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
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="John Doe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    name="confirmPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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
                        <Spinner /> Signing up...
                      </div>
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline-offset-4 underline">
                    Log in
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
