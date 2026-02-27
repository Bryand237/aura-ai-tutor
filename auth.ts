import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { Utilisateur } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import postgres from "postgres";

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing POSTGRES_URL or DATABASE_URL env var");
}

const sql = postgres(connectionString, { ssl: "require", prepare: false });

async function getUser(email: string): Promise<Utilisateur | undefined> {
  try {
    const user = await sql<
      Utilisateur[]
    >`SELECT * FROM utilisateur WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(6) })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            console.error("[auth] Invalid credentials payload", {
              issues: parsedCredentials.error.issues,
            });
            return null;
          }

          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) {
            console.error("[auth] User not found", { email });
            return null;
          }

          if (!user.mot_de_passe || typeof user.mot_de_passe !== "string") {
            console.error("[auth] Missing/invalid stored password hash", {
              email,
              mot_de_passe: user.mot_de_passe,
            });
            return null;
          }

          if (!user.mot_de_passe.startsWith("$2")) {
            console.error("[auth] Stored password is not a bcrypt hash", {
              email,
              mot_de_passe_prefix: user.mot_de_passe.slice(0, 10),
            });
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            user.mot_de_passe,
          );
          if (!isPasswordValid) {
            console.error("[auth] Invalid password", { email });
            return null;
          }

          return {
            id: String(user.id_utilisateur),
            name: user.nom,
            email: user.email,
          };
        } catch (error) {
          console.error("[auth] Credentials authorize failed", error);
          return null;
        }
      },
    }),
  ],
});
