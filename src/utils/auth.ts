/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import { AuthOptions, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

import { AuthApi } from "@/api/auth";

const refreshToken = async (token: JWT) => {
  try {
    const response = {
      data: {
        token: "",
        refreshToken: "",
      },
    };
    return {
      ...token,
      accessToken: response.data?.token,
      refreshToken: response.data?.refreshToken ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("RefreshAccessTokenError", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/",
    error: "/",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        id: {
          type: "number",
        },
        first_name: {},
        auth_date: {
          type: "number",
        },
        hash: {},
        last_name: {},
        photo_url: {},
        username: {},
      },
      authorize: async (body) => {
        console.log("🚀 ~ authorize: ~ body:", body);
        try {
          const response = await AuthApi.login();
          return response.data;
        } catch (error) {
          console.error(error);
          throw new Error("Login failed!");
        }
      },
    }),
  ],
  jwt: {
    maxAge: 60 * 60 * 24 * 2, //2 days
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === "update" && session) {
        token.user.info = session;
      }
      if (user) {
        token.user = user as any;
      }
      const decodeToken = jwtDecode(token.user.accessToken);
      if (Date.now() < (decodeToken.exp as number) * 1000) {
        return token;
      }
      return refreshToken(token);
    },
    session: async ({ session, token }) => {
      session.user = token.user.info;
      session.accessToken = token.user.accessToken;
      // console.log("🚀 ~ session: ~ session:", session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_URL,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 2, //2 days
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
