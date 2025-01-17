
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios, { AxiosError } from "axios";
import { SessionStrategy } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      email: string;
      id: string;
      emailVerified: null;
    };
  }
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password, role } = credentials as { email: string; password: string; role: string };

        if (!email || !password) {
          console.error("Missing email or password");
          return null;
        }

        try {
          const response = await axios.post('http://localhost:4000/login', {
            email,
            password,
            role,
            redirect:false,
          });

          const { data } = response;
          if (data && data.user && data.token) {
            return {
              name: data.user.name,
              email: data.user.email,
              id: data.user.id,
              token: data.token,
            };
          } else {
            console.warn("Unexpected response structure:", data);
            return null;
          }
        } catch (error) {
          const err = error as AxiosError;
          if (err.response) {
            console.error("API response error:", err.response.data);
          } else if (err.request) {
            console.error("Network error:", err.request);
          } else {
            console.error("Unexpected error:", err.message);
          }
          return null;  
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user.name;
        token.email = user.email;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        name: token.user as string,
        email: token.email as string,
        id: token.id as string,
        emailVerified: null,
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt"  as SessionStrategy,
  },
  debug: process.env.NODE_ENV === "development",
};

export default authOptions;
