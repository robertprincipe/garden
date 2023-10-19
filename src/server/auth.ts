/**
 * @see https://authjs.dev/reference/adapter/drizzle
 * @see https://github.com/jherr/app-router-auth-using-next-auth
 * @see https://github.com/rexfordessilfie/next-auth-account-linking/tree/app-router
 */
import { NextRequest } from "next/server";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { defaultLocale } from "~/i18n/locales";
import bcrypt from "bcryptjs";
import { and, eq, isNotNull } from "drizzle-orm";
import NextAuth, {
  getServerSession,
  NextAuthOptions,
  type AuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { type Provider } from "next-auth/providers/index";
import { Client } from "postmark";
import { z } from "zod";

import { signInPagePath } from "~/server/utils";
import { db } from "~/data/db/client";
import { users } from "~/data/db/schema";
import { env } from "~/data/env/env.mjs";
// import { sendVerificationRequest } from "~/server/request";
import {
  createAccount,
  createUser,
  findAccount,
} from "~/data/routers/handlers/users";

export const signInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
    }),
});

/**
 * Returns a NextAuthOptions object with extended functionality that requires a request and response object
 * In this specific case, the extended functionality allows for one user multiple accounts
 * @param req A NextRequest
 * @param res A NextResponse
 * @returns A NextAuthOptions object with extended functionality that requires a request and response object
 */
export const authOptions = () => {
  const extendedOptions: NextAuthOptions = {
    // todo: fix errors when using:
    // adapter: DrizzleAdapter(db),
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "  " },
          password: { label: "Password", type: "password" },
        },

        async authorize(credentials, _) {
          const { email, password } = signInSchema.parse(credentials);

          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user) {
            throw new Error("User not found");
          }

          if (!user.password) {
            throw new Error("Password not set");
          }

          const correct = await bcrypt.compare(password, user.password);

          if (!correct) {
            return null;
          }

          return user;
        },
      }),
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
      }),
      // todo: use drizzle auth adapter for this
    ],

    pages: {
      signIn: "/",
      error: "/",
      signOut: "/",
    },
    callbacks: {
      async signIn(params) {
        const { account, user } = params;

        const currentSession = await getServerSession(extendedOptions);

        const currentUserId = currentSession?.userId;

        // If there is a user logged in already that we recognize,
        // and we have an account that is being signed in with
        if (account && currentUserId) {
          // Do the account linking
          const existingAccount = await findAccount({
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          });

          if (existingAccount) {
            throw new Error("Account is already connected to another user!");
          }

          // Only link accounts that have not yet been linked
          // Link the new account
          await createAccount({
            providerAccountId: account.providerAccountId,
            provider: account.provider,
            type: account?.type,
            userId: currentUserId,
            email: user.email!, // Email field not absolutely necessary, just for keeping record of user emails
          });

          // Redirect to the home page after linking is complete
          return "/";
        }

        // Your Other logic to block sign-in's

        return true;
      },

      async jwt(params) {
        const { token, account, user } = params;

        // If there is an account for which we are generating JWT for (e.g on sign in)
        // then attach our userId to the token
        if (account) {
          const existingAppAccount = await findAccount({
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          });

          // User account already exists so set user id on token to be added to session in the session callback
          if (existingAppAccount) {
            token.userId = existingAppAccount.userId;
          }

          // No account exists under this provider account id so probably new "user"
          if (!existingAppAccount) {
            const appUser = await createUser({
              provider: account.provider, // Provider field not absolutely necessary, just for keeping record of provider the account was created with
            } as any);

            const newAppAccount = await createAccount({
              providerAccountId: account.providerAccountId,
              provider: account.provider,
              userId: appUser?.id,
              type: account?.type,
              email: user.email!, // Email field not absolutely necessary, just for keeping record of user emails
            });

            token.userId = newAppAccount?.userId;
          }
        }

        return token;
      },

      async session(params) {
        const { session, token } = params;
        // Attach the user id from our table to session to be able to link accounts later on sign in
        // when we make the call to getServerSession
        session.userId = token.userId;
        return session;
      },
    },
  };

  return extendedOptions;
};
