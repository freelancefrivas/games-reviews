// auth.ts
import { mikroOrmAdapter } from "better-auth-mikro-orm"
import { betterAuth } from "better-auth"
import { MikroORM } from "@mikro-orm/core"
import { admin } from "better-auth/plugins";

export function createAuth(orm: MikroORM) {
    return betterAuth({
        trustedOrigins: ['http://localhost:5173'],
        database: mikroOrmAdapter(orm),
        emailAndPassword: {
            enabled: true,
        },
        socialProviders: {
           /* google: {
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            },*/
        },
        user: {
            additionalFields: {
                nickname: {
                    type: "string",
                    required: true,
                },
                role: {
                    type: "string",
                    required: true,
                    defaultValue: "reader",
                },
            },
        },
        plugins: [admin({
            defaultRole: "reader",
            adminRoles: ["admin"],
        })],
        /*advanced: {
            database: {
                generateId: false
            }
        }*/
    })
}