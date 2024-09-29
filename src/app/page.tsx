"use server";
import LandingPage from "@/components/LandingPage";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const getUserSession = async () => {
  const session = await getServerSession(authOptions);
  return session;
};

export default async function Home() {
  const session = await getUserSession();

  // Redirect
  if (session?.user) {
    redirect("/dashboard");
    return null;
  }

  return (
    <main>
      <LandingPage />
    </main>
  );
}
