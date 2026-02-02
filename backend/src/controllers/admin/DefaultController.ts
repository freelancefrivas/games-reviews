import {Router} from 'express';

import { authMiddleware, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();


export const DefaultController = (DI: any) => {

    router.get('/api/dashboard', authMiddleware, (req: AuthRequest, res: Response) => {
        res.json({
            message: 'Dashboard data',
            userId: req.user!.userId
        });
    });

    return router;
});