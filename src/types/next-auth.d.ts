import {DefaultSession, DefaultUser} from "next-auth";
import type {UserRole} from "@prisma/client";
import {DefaultJWT} from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    name: string;
    role: UserRole;
  }
  interface Session extends DefaultSession {
    user: User & {
      id: string;
      role: UserRole;
      name: string;
      image: string
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    name: string;
  }
}
