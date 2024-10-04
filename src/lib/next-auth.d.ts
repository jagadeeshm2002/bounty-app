import "next-auth";
import { Role } from "@/actions/types";

import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
      role?: string | null;
    };
  }

  interface User {
    username?: string | null;
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
    username: string;
    role: Role;
  }
}