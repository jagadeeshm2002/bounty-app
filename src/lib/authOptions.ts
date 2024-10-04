import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Prisma, Account } from "@prisma/client";
import prisma from "@/db";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@/actions/types";
import { AdapterUser } from "next-auth/adapters";

type UserWithAccounts = Prisma.UserGetPayload<{
  include: { accounts: true };
}>;

export interface CustomAccount extends Account {
  role: Role;
}

type CustomUser = AdapterUser & {
  username: string | null;
  role: Role | null;
};

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

export interface CustomJWT extends JWT {
  id: string;
  accessToken: string;
  username: string;
  role: Role;
}

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
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        const githubUser = profile as any;
        const username = githubUser.login;

        try {
          const existingUser = await prisma.user.upsert({
            where: { email: user.email! },
            update: {
              username: username,
              role: Role.USER,
            },
            create: {
              id: user.id,
              name: user.name || githubUser.name,
              email: user.email!,
              username: username,
              role: Role.USER,
            },
            include: { accounts: true },
          });

          if (!existingUser.accounts.some((acc) => acc.provider === "github")) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
              },
            });
          }

          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          id: user.id,
          username: (user as CustomUser).username || "",
          accessToken: account.access_token!,
          role: (user as CustomUser).role || Role.USER,
        } as CustomJWT;
      }
      return token as CustomJWT;
    },
    async session({ session, token }) {
      const customToken = token as CustomJWT;
      if (session.user) {
        // Fetch the user from the database
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: { id: true, username: true, role: true },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.username = dbUser.username;
          session.user.role = dbUser.role;
        }
      }
      return {
        ...session,
        user: {
          ...session.user,
          jwtToken: customToken.accessToken,
        },
      } as CustomSession;
    },
  },
};
