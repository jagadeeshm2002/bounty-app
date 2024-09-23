import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/db";

import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@/actions/types";

// Custom Session Interface
export interface CustomSession extends Session {
  user: {
    id: string;
    jwtToken: string;
    username: string;
    email: string;
    name: string;
    role: Role;
  };
}

// Custom JWT Interface
export interface CustomJWT extends JWT {
  id: string;
  accessToken: string;
  username: string;
  role: Role;
}

// Adapter initialization
const adapter = PrismaAdapter(prisma) as any;

export const authOptions: NextAuthOptions = {
  adapter,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        const githubUser = profile as any;
        const username = githubUser.login;

        const role =
          account.role && Object.values(Role).includes(account.role as Role)
            ? (account.role as Role)
            : Role.USER;

        // Update or create user in the database
        await prisma.user.upsert({
          where: { id: user.id },
          update: { username: username, role: role },
          create: {
            id: user.id,
            name: user.name,
            email: user.email,
            username: username,
            role: role,
          },
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      const customToken = token as CustomJWT;

      if (account && user) {
        customToken.id = user.id;
        customToken.username = (user as any).username || "";
        customToken.accessToken = account.access_token!;
        customToken.role = (user as any).role || Role.USER;
      }
      return customToken;
    },
    async session({ session, token }) {
      const customSession = session as CustomSession;
      const customToken = token as CustomJWT;

      if (customSession.user) {
        customSession.user.id = customToken.id;
        customSession.user.username = customToken.username;
        customSession.user.jwtToken = customToken.accessToken;
        customSession.user.role = customToken.role;
      }

      return customSession;
    },
  },
};
