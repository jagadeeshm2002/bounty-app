import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const auth = NextAuth({ ...authOptions });

export { auth as GET, auth as POST };
