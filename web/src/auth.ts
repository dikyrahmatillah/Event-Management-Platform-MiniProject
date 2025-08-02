import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  }

  interface JWT {
    accessToken?: string;
    user?: {
      id: string;
      email: string;
      name?: string;
    };
  }

  interface User {
    accessToken?: string;
    userData?: {
      user: {
        id: string;
        email: string;
        name?: string;
      };
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "Enter your email",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "******",
        },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        try {
          const response = await fetch(
            `${process.env.API_URL}/api/v1/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const userData = await response.json();

          if (!response.ok) {
            return null;
          }

          if (!userData.data || !userData.data.accessToken) {
            console.error(
              "Invalid response format - missing token or user data"
            );
            return null;
          }

          console.log("Access Token:", userData.data.accessToken);

          return {
            accessToken: userData.data.accessToken,
          };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as User & {
          accessToken: string;
          userData: { user: { id: string; email: string; name?: string } };
        };
        token.accessToken = customUser.accessToken;
        token.user = customUser.userData?.user;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        if (token.user) {
          const user = token.user as {
            id: string;
            email: string;
            name?: string;
          };
          session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: null,
          };
        }
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
  },
});
