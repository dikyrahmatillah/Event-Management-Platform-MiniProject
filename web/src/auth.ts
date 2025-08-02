import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: string;
  name: string;
  email: string;
  role: string;
};

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      email: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email", placeholder: "Email" },
        password: { type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );
          if (!response.ok) return null;

          const data = await response.json();

          const token = data?.data?.accessToken?.accessToken;

          if (!token) return null;

          return { accessToken: token };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;

        try {
          const decoded = jwtDecode<DecodedToken>(user.accessToken);
          token.id = decoded.id;
          token.name = `${decoded.name}`;
          token.email = decoded.email;
          token.role = decoded.role;
        } catch (error) {
          console.error("Token decode error:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        const user = token as DecodedToken;
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.role = user.role;
      }

      return session;
    },
  },

  session: { strategy: "jwt" },
  pages: { signIn: "/auth/sign-in" },
});

/* ----------------------- Semangat nad ᕙ( •̀ ᗜ •́ )ᕗ ----------------------- */
