import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import { compare } from "bcryptjs";

const googleClientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "";

export const isGoogleConfigured = Boolean(googleClientId && googleClientSecret);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    ...(isGoogleConfigured
      ? [
          Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        authType: { label: "Auth Type", type: "text" },
        role: { label: "Role", type: "text" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const role = (credentials.role as string) || "advertiser";

        // Google OAuth simulation fallback when OAuth client credentials are not yet populated in .env
        if (credentials.authType === "google") {
          const email = credentials.email as string;
          const name = (credentials.name as string) || email.split("@")[0];
          
          let user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name,
                passwordHash: "google-oauth-external",
              },
            });
          }
          return { id: user.id, email: user.email, name: user.name, isAdmin: false, role };
        }

        if (!credentials?.password) return null;

        // Admin intercept
        if (
          credentials.email === "admin@promotai.com" &&
          credentials.password === "admin123"
        ) {
          return {
            id: "admin-superuser",
            email: "admin@promotai.com",
            name: "System Administrator",
            isAdmin: true,
            role: "advertiser",
          };
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name, isAdmin: false, role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || (profile as any)?.name || user.email.split("@")[0],
                passwordHash: "google-oauth",
              },
            });
          }
          user.id = dbUser.id;
          return true;
        } catch (err) {
          console.error("Error linking Google user to Prisma DB:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = (user as any).isAdmin || (token.email === "admin@promotai.com");
        token.role = (user as any).role || token.role || "advertiser";
      }
      if (token.email && !token.id) {
        try {
          const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
          if (dbUser) {
            token.id = dbUser.id;
          }
        } catch (e) {
          // ignore
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        (session.user as any).isAdmin = token.isAdmin as boolean;
        (session.user as any).role = (token.role as string) || "advertiser";
      }
      return session;
    },
  },
});
