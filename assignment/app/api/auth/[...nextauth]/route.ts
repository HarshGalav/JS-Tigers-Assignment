import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", 
    maxAge: 1*60*60, 
  },
  callbacks: {
    async session({ session, token,user }) {
      session.user.id = token.sub;
      
      session.expires = new Date(token.iat * 1000 + 1 * 60 * 60 * 1000).toISOString(); 

      return session;
    },
    async jwt({ token }) {
      if (!token.iat) return token;
      
      const expiryTime = token.iat + 1 * 60 * 60; // Set token expiry (2 hours from issued time)
      if (Date.now() / 1000 > expiryTime) {
        return null; // Expire token
      }
      
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
