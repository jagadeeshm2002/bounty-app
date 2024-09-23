"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Role } from "@/actions/types";

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
        <div>signin</div>
        <div className=" w-72 h-96  px-4 py-4 rounded-md bg-slate-500" >
          <h1>WELCOME BACK</h1>
          <button onClick={() => handleSignIn(Role.USER)}>User</button>
          <button onClick={() => handleSignIn(Role.OWNER)}>Owner</button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
