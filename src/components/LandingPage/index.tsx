import React from "react";
import Image from "next/image";
import { grid } from "@/assets/dataUrl";
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
              <Image
                src="data:image/png;base64,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"
                alt="Bounty"
                width={50}
                height={50}
              />
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
            <Link href="/auth/signin" className="border-yellow-600 border-2 bg-yellow-600 bg-opacity-20 px-5 py-2 rounded-md hover:bg-opacity-10">
              Get Started
            </Link>
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
