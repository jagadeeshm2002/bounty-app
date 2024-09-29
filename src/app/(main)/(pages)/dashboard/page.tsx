// "use server";

// import Header from "@/components/Header";
// import { authOptions } from "@/lib/authOptions";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";


// const getUserSession = async () => {
//   const session = await getServerSession(authOptions);
//   return session;
// };
// export default async function DashboardPage() {
//   const session = await getUserSession();
//   if (!session) {
//     redirect("/auth/signin");
//   }
//   return <Header />;
// }

import React from 'react'

type Props = {}

export default function Dashboard({}: Props) {
  return (
    <div>Dashboard</div>
  )
}