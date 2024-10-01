import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type Props = {};

export default function ReposPage({}: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div>Your Repos</div>
        <div>
          <Link href={"/repos/new"} className="flex items-center" passHref={true}>
            <Button variant="ghost" className="px-4 outline outline-2">
              New
            </Button>
            <span className="sr-only">New Repo Create</span>{" "}
          </Link>
        </div>
      </div>
      <div>REpo List</div>
    </div>
  );
}
