import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type Props = {};

export default function ReposPage({}: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between mb-2">
        <div>Your Repos</div>
        <div >
          <Link href={"/repos/new"} className="flex items-center" passHref={true}>
            <Button variant="ghost" className="px-4 outline outline-2">
              New
            </Button>
            <span className="sr-only">New Repo Create</span>{" "}
          </Link>
        </div>
      </div>
      <hr className="opacity-35"/>

      <div className=" flex w-full flex-col mt-3">
        <div className="w-full border border-gray-400 border-opacity-20 rounded-lg p-3">list</div>
      </div>
    </div>
  );
}
