"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Role } from "@/actions/types";
import { coin } from "@/assets/dataUrl";
import { Button } from "@/components/ui/button";
import { Result } from "postcss";
import { Github } from "lucide-react";

type Props = {};

const SignIn = (props: Props) => {
  //   const router = useRouter();

  const handleSignIn = async (role: Role) => {
    try {
      const result = await signIn("github", {
        redirect: false,
        callbackUrl: `/dashboard`,
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
        <div className=" flex min-h-36 min-w-52 flex-col px-4 py-4 rounded-md bg-slate-800 border border-slate-600 gap-6">
          <h1>Welcome Back🫣</h1>

          <div className="flex flex-row justify-center items-center">
            <Button variant="secondary" onClick={() => handleSignIn(Role.USER)}>
              <Github />
              <p>signin</p>
            </Button>
          </div>
          {JSON.stringify(Result)}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
