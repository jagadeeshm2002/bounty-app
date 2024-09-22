import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/db"; // Adjust the path based on your folder structure
const adapter = PrismaAdapter(prisma) as any;
export interface session extends Session {
  user: {
    id: string;
    jwtToken: string;
    username: string;
    email: string;
    name: string;
  };
}

export interface token extends jwt {
  id: string;
  accessToken: string;
}

export const authOptions: NextAuthOptions = {
  adapter: adapter,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt", // Using JWT instead of database sessions
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // Make sure this is set in .env
  },
  callbacks: {
    // Customize JWT contents
    async jwt({ token, user, account }) {
      if (account && user) {
        // Store additional info in the token
        token.id = user.id;
        token.accessToken = account.access_token;
      }
      return token;
    },
    // Attach token data to session
    async session({ session, token }) {
        const newSession: session = session as session;
      if (session?.user && session?.user?.id) {
        session?.user?.id = token.id;
        session?.user?.jwtToken = token.accessToken;
      }
      return session;
    },
  },
};
