"use server";
import React from "react";
import Image from "next/image";
import { coin, grid } from "@/assets/dataUrl";
import Noise from "@/assets/grainNoise.gif";
import Link from "next/link";

function LandingPage() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <main className="w-full h-screen relative">
        <div
          className={`w-full h-screen bg-opacity-90 bg-scroll absolute -z-10`}
          style={{ backgroundImage: `url(${grid})` }}
        >
          <div className="w-full flex justify-center items-center ">
            <div className="top-0 left-0 bg-blue-700 blur-[300px] w-[500px] h-[300px] "></div>
            <div className="bottom-0 right-0  w-[500px] h-[200px] bg-blue-700 blur-[300px] absolute "></div>
            <div
              className="bg-red-500 w-full h-5 rounded-full rotate-45 left-0 top-0"
              style={{ filter: "blur(100px)" }}
            ></div>
          </div>
        </div>
        <div
          className="w-full h-screen bg-noise bg-repeat z-20 absolute opacity-5 inset-0 !pointer-events-none"
          style={{ backgroundImage: `url(${Noise.src})` }}
        ></div>

        <div className="w-full">
          <nav className="flex w-full h-20 pt-3 justify-center items-center">
            <div className="flex flex-row justify-center items-center mx-auto">
              <Image src={coin} alt="Bounty" width={50} height={50} />
              <p className="text-[36px] font-mono ">Bounty.</p>
            </div>
          </nav>
        </div>
        <div className="w-full h-[550px] flex justify-center items-center flex-col gap-8">
          <div>
            <h2 className="text-[50px] font-mono text-center font-bold">
              Streamline Bounty Management <br className="hidden md:block" />{" "}
              for GitHub Repositories
            </h2>
            <p className="text-[16px] font-mono text-center mx-auto px-20 mt-2">
              Effortlessly assign, track, and claim bounties on GitHub pull
              requests. Sign in, set up your payment details, and{" "}
              <br className="hidden md:block" />
              get rewarded for your contributions.
            </p>
          </div>
          <div className="flex flex-row justify-between items-center gap-7">
            <Link
              href="/auth/signin"
              className="border-yellow-600 border-2 bg-yellow-600 bg-opacity-20 px-5 py-2 rounded-md hover:bg-opacity-10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
