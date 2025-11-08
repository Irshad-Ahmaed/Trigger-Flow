import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col gap-6 p-6 items-center justify-center md:p-10">
      <div className="w-full flex max-w-sm flex-col gap-6">
        <Link
          href={"/"}
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image src={"/logo.svg"} alt="trigger-flow" width={30} height={30} />
          Trigger Flow
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
