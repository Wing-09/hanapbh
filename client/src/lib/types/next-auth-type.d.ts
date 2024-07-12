import NextAuth, { Session } from "next-auth";
import { User as UserType } from "./data-type";

declare module "next-auth" {
  interface Session {
    user: UserType;
  }
  interface Profile {
    given_name: string;
    family_name: string;
    picture: string;
  }
  interface User extends UserType {}
}

declare module "next-auth/jwt" {
  interface JWT extends UserType {}
}
