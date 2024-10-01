// types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";

// Extending the built-in Session type to include `username`
declare module "next-auth" {
  interface Session {
    user: {
      /** The user's unique username. */
      username?: string;
      id?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    id?: string;
  }
}
