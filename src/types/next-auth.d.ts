import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        access_token?: string;
        refresh_token?: string;
        user: {
            user_type?: string;
        } & DefaultSession["user"];
    }

    interface User {
        access_token?: string;
        refresh_token?: string;
        user_type?: string;
        id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        access_token?: string;
        refresh_token?: string;
        user_type?: string;
    }
}
