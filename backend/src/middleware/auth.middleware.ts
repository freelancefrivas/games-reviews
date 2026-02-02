// backend/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DI } from '../server';

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secret-key-super-segura';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                message: 'Token not present'
            });
            return;
        }

        const token = authHeader.replace('Bearer ', '');

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: number;
            email: string;
        };

        const user = await DI.userRepository.findOne({ id: decoded.userId });
        if (!user) {
            res.status(401).json({
                message: 'User not found'
            });
            return;
        }


        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                message: 'Token expired'
            });
            return;
        }

        res.status(401).json({
            message: 'Invalid token'
        });
    }
};