import { LoginForm } from "@/features/auth/components/loginForm";
import { requireUnauth } from "@/lib/auth-utils";
import React from "react";

const Login = async () => {
  await requireUnauth();

  return <LoginForm />;
};

export default Login;
