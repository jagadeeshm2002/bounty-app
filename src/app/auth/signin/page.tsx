"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Role } from "@/actions/types";
import { coin } from "@/assets/dataUrl";
import { Button } from "@/components/ui/button";
import { Result } from "postcss";

type Props = {};

const SignIn = (props: Props) => {
  //   const router = useRouter();

  const handleSignIn = async (role: string) => {
    try {
      const result = await signIn("github", {
        redirect: false,
        callbackUrl: "/dashboard",
        role: role,
      });

      if (result?.error) {
        console.error("SignIn error:", result.error);
      } else if (result?.url) {
        // router.push(result.url);
      }
    } catch (error) {
      console.error("SignIn error:", error);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center  bg-slate-950">
      <div className="w-full h-full flex flex-col justify-center items-center ">
        <div className="flex flex-row justify-center items-center my-5 ">
          <img src={coin} width={50} height={50} alt="" />
          <p className="text-[36px] font-mono">Bounty</p>
        </div>
        <div className=" flex flex-col gap-4 px-4 py-4 rounded-md bg-slate-800 border border-slate-600">
          <h1>Welcome Back🫣</h1>

          <div className="flex gap-4">
          <Button variant="secondary" onClick={() => handleSignIn(Role.USER)}>
          <img src="https://github.com/fluidicon.png" alt="github" width={24} height={24} />
            <p>signin as User</p>
          </Button>
          <Button variant="secondary" onClick={() => handleSignIn(Role.OWNER)}>
          <img src="https://github.com/fluidicon.png" alt="github" width={24} height={24} />
            <p >signin as owner</p>
          </Button>
          </div>
          {JSON.stringify(Result)}
          
        </div>
      </div>
    </div>
  );
};

export default SignIn;
