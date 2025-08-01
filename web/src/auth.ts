import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
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

        const response = await fetch(`https://localhost:8000/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) return null;
        const userData = await response.json();

        if (!userData.data || !userData.data.accessToken) return null;

        return userData;
      },
    }),
  ],
});
