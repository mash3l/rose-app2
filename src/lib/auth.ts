import { NextAuthOptions } from "next-auth";
import type { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type UserRole = "USER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & { role: UserRole };
    accessToken?: string;
  }
  interface User {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://rose-app.elevate-bootcamp.cloud";

interface LoginApiUser {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  gender: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: UserRole;
}

interface LoginApiResponse {
  status: boolean;
  code: number;
  payload: {
    user: LoginApiUser;
    token: string;
  };
}

function buildFullName(user: LoginApiUser) {
  return `${user.firstName} ${user.lastName}`.trim();
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          const data: LoginApiResponse = await response.json();

          if (!response.ok || !data.status) {
            return null;
          }

          const { user, token } = data.payload;

          return {
            id: user.id,
            token,
            name: buildFullName(user),
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { token?: string }).token;
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
