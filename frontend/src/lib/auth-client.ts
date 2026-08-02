import { createAuthClient } from "better-auth/vue"
import { adminClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL, // The base URL of your auth server
    fetchOptions: {
        credentials: "include",
    },
    plugins: [
        adminClient(),
        inferAdditionalFields({
            user: {
                nickname: {
                    type: "string",
                    required: true,
                },
                role: {
                    type: "string",
                    required: true,
                },
            },
        })
    ],

})