import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const { handlers, auth, signOut, signIn } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      authorize: async (credentials) => {
        
        try {
          const { email, password, role } = credentials as {
            email: string;
            password: string;
            role: string;
          };
          const response = await axios.post("http://localhost:4000/signin", {
            email,
            password,
            role,
          });        
          console.log(response.status)
          if (response.status === 200) {
            const { user } = response.data;
            console.log(response.data)
            if (user) {
              return {
                id: response.data.userId,
                email: response.data.userEmail,
              };
            }
          }
          throw new CredentialsSignin("Invalid email or password");
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || "Authentication failed";
          console.error("Authorization error:", errorMessage);
          throw new Error(errorMessage); 
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user }) {
      if (user) {
        return true;
      } else {
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // token.role = user.role; 
        token.name = user.name;
      }
      return token;
    },  
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        // session.user.role = token.role as string;
        session.user.name = token.name as string;
      }
      return session;
    } 
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,    
  },
  debug: process.env.NODE_ENV === "development",
});