import { NextAuthConfig } from "next-auth";
import Okta from "next-auth/providers/okta";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import getUserByUsername from "./getUserByUsername";
import getUserByEmail from "./getUserByEmail";
import { signOut } from "./auth";
import { LoginUser } from "src/types";

export const authConfig = {
  pages: {
    signIn: "/login",
    // signOut: "/login",
  },

  providers: [
    Okta,
    GoogleProvider,
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials;
        const user = await getUserByUsername(username as string);

        if (!user || !user.password || password !== user.password) return null;

        const userToJwt = {
          id: user.userId.toString(),
          name: user.username,
          role: user.role,
          email: user.email,
          fullName: user.firstName + " " + user.lastName,
        };
        return userToJwt;
      },
    }),
  ],

  secret: process.env.SECRET as string,

  callbacks: {
    // Persist the user info to the token right after signin
    async jwt({ token, user, account }) {
      const loginUser = user as LoginUser;
      if (user && account?.provider === "credentials") {
        token.id = loginUser.id;
        token.role = loginUser.role;
        token.email = loginUser.email;
        token.name = loginUser.fullName;
      }
      if (user && account?.provider === "google") {
        const user = await getUserByEmail(token.email as string);
        token.role = user ? user.role : "unregistered";
        token.id = user ? user.userId : "0";
        token.name = user && user.firstName + " " + user.lastName;
        token.image = token.picture;
      }

      return token;
    },

    // Add user info to the session
    async session({ session, token }) {
      if (session.user == undefined) return session;
      const { id, name, role, email, image } = token;
      Object.assign(session.user, { id, name, role, email, image });
      console.log("session", session);
      return session;
    },
  },
} satisfies NextAuthConfig;
