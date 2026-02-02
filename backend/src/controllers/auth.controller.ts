// backend/routes/auth.routes.ts
import {Router, type Request, type Response} from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../entities/User';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secret-key-super-segura';
const JWT_EXPIRES_IN = '24h';

export const AuthController = (DI: any) => {
// POST /auth/login
    router.post('/login', async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email and password are required'
                });
            }

            const user = await DI.em.findOne(User, {email});

            if (!user) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }

            const isValidPassword = await user.verifyPassword(password);

            if (!isValidPassword) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }

            // Create JWT
            const token = jwt.sign({userId: user.id, email: user.email}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

            res.json({token, user: user.toJSON()});

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    });


// POST /auth/verify
    router.post('/verify', async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({
                    message: 'Token not present'
                });
            }

            const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };

            const user = await DI.userRepository.findOne({id: decoded.userId});
            if (!user) {
                return res.status(401).json({
                    message: 'User not found',
                    valid: false
                });
            }

            res.json({
                valid: true,
                user: user.toJSON()
            });

        } catch (error) {
            res.status(401).json({
                message: 'Invalid or expired token',
                valid: false
            });
        }
    });
    return router;
}

