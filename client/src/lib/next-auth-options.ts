import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, Awaitable } from "next-auth";
import { ServerResponse } from "./types/server-response";
import { User } from "./types/data-type";
import { error } from "console";

const google_client_id = process.env.GOOGLE_CLIENT_ID;
if (!google_client_id)
  throw new Error("GOOGLE_CLIENT_ID is missing on your .env.local file");
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
if (!google_client_secret)
  throw new Error("GOOGLE_CLIENT_SECRET is missing on your .env.local file");

const secret = process.env.NEXTAUTH_SECRET;
if (!secret)
  throw new Error("NEXTAUTH_SECRET is missing on your .env.local file");

const server_url = process.env.SERVER_URL;
if (!server_url)
  throw new Error("SERVER_URL is missing on your .env.local file");

// const facebook_client_id = process.env.FACEBOOK_CLIENT_ID;
// if (!facebook_client_id) throw new Error("FACEBOOK_CLIENT_ID");
// const facebook_client_secret = process.env.FACEBOOK_CLIENT_SECRET;
// if (!facebook_client_secret) throw new Error("FACEBOOK_CLIENT_SECRET");

const auth_options: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "Email" },
        password: {
          label: "password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        const response = await fetch(server_url + "/v1/user/authenticate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const response_json = (await response.json()) as ServerResponse;

        if (response_json.status !== "OK")
          throw new Error(response_json.message);

        return (await response_json.data) as User;
      },
    }),
    GoogleProvider({
      clientId: google_client_id,
      clientSecret: google_client_secret,
    }),
    // FacebookProvider({
    //   clientId: facebook_client_id,
    //   clientSecret: facebook_client_secret,
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/",
  },
  secret,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async signIn({ user, profile }) {
      try {
        if (profile) {
          const { email } = user;
          const response = await fetch(server_url + "/v1/user/email/" + email);

          const response_json = (await response.json()) as ServerResponse;
          if (response_json.status === "NOT_FOUND") {
            await fetch(server_url + "/v1/user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email!,
                first_name: profile.given_name,
                last_name: profile.family_name,
                photo: {
                  url: profile.picture,
                },
              } as User),
            });
          }
        }
        return true;
      } catch (error) {
        console.error("ISngUP::", error);
        return false;
      }
    },
    async jwt({ token, profile, user }) {
      delete token.sub;
      delete token.name;
      delete token.sub;
      delete token.picture;
      delete token.jti;

      try {
        if (profile) {
          const response = await fetch(
            server_url + "/v1/user/email/" + profile.email
          );

          const response_json = (await response.json()) as ServerResponse;
          const db_user = response_json.data as User;
          return { ...token, ...db_user };
        }
        return { ...token, ...user };
      } catch (error) {
        throw error;
      }
    },
    async session({ session, token }) {
      try {
        session.user = token as any;
        return session;
      } catch (error) {
        throw error;
      }
    },
  },
};

export default auth_options;
