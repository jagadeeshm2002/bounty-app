import { NextAuthOptions, Profile } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Prisma, User, Account } from "@prisma/client";
import prisma from "@/db";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@/actions/types";
import { AdapterUser } from "next-auth/adapters";
import { Projector } from "lucide-react";

// Define a type for the user with included accounts
type UserWithAccounts = Prisma.UserGetPayload<{
  include: { accounts: true };
}>;
export interface CustomAccount extends Account {
  role: Role;
}
// export interface CustomUser extends User {
//   role: Role;
//   username: string;
// }

// function isCustomUser(user: User | AdapterUser): user is CustomUser {
//   return 'username' in user && 'role' in user;
// }

type CustomUser = AdapterUser & {
  username: string | null;
  role: Role | null;
};

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
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile}) {
      if (account?.provider === "github") {
        const githubUser = profile as any;
        const username = githubUser.login;
        

        try {
          // Check if the user already exists
          const existingUser = (await prisma.user.findUnique({
            where: { email: user.email! }, // Email will exist on both User and AdapterUser
            include: { accounts: true },
          })) as UserWithAccounts | null;

          if (existingUser) {
            if (
              !existingUser.accounts.some((acc) => acc.provider === "github")
            ) {
              // Link the GitHub account to the existing user
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

              // Update the existing user with GitHub information
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { username: username, role: Role.USER},
              });
            }
            return true; // Allow sign in
          } else {
            // Create a new user if one doesn't exist
            await prisma.user.create({
              data: {
                id: user.id,
                name: user.name || githubUser.name,
                email: user.email!,
                username: username,
                role: Role.USER,
                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    token_type: account.token_type,
                    scope: account.scope,
                  },
                },
              },
            });
          }

          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false; // Prevent sign in if there's an error
        }
      }
      return true; // Allow sign in for other providers
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
