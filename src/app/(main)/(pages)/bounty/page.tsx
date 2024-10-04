import prisma from "@/db";

import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

import React from "react";

type Props = {};

async function BountyPage({}: Props) {
  const session = await getServerSession(authOptions);
  const username = session?.user?.username;

  const data = await prisma.bounty.findMany({
    where: { assignedTo: username },
  });
  console.log(data)

  // const data = prisma.bounty.findMany({where: {assignedTo: session?.user?.username}})
  return <div>BountyPage
    {JSON.stringify(data)}
  </div>;
}

export default BountyPage;
