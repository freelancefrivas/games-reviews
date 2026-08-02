import { getAuth } from './utils/auth-instance.js';
import {fromNodeHeaders} from "better-auth/node";

export async function requireAuth(req: any, res: any, next: any) {
    try {
        const auth = getAuth();
        const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

        if (!session) {
            return res.status(401).json({ errors: ['Not authenticated'] });
        }

        req.session = session;
        next();
    } catch (err) {
        console.error('Error in requireAuth:', err);
        res.status(500).json({ errors: ['Internal server error'] });
    }
}