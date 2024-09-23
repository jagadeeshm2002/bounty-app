"use client";
import Dashboard from "@/components/Dashboard";
import LandingPage from "@/components/LandingPage";
import { url } from "inspector";
import { useSession } from "next-auth/react";
import{Role} from '@/actions/types'

import Image from "next/image";
import { use } from "react";
import { useRouter } from "next/router";


export default function Home() {
  const router = useRouter
  const { data: sessionData } = useSession();

  
  return (
    <>
    <LandingPage/>
    {JSON.stringify(sessionData)}
    </>
  );
}
