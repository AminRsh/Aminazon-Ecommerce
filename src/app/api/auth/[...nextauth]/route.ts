import { prisma } from '@/lib/db/prisma';
import { NextAuthOptions, Session } from 'next-auth';                                                 
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth/next';
import { Adapter } from 'next-auth/adapters';
import Google from 'next-auth/providers/google';
import { env } from '@/lib/env';
import { mergeAnonymousCartIntoUserCart } from '@/lib/db/cart';
import { PrismaClient } from '@prisma/client';

const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
    providers: [
        Google({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        session({session, user}) {
            if (session.user) {
                session.user.id = user.id
            }
            return session;
        },
    },
    events: {
        async signIn({user}) {
            await mergeAnonymousCartIntoUserCart(user.id)
        },
    }
};

const handler = NextAuth(authOptions)

export const GET = handler;
export const POST = handler;