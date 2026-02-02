import {type Request, type Response, Router} from 'express';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {User} from '../entities/User.ts';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const UserController = (DI: any) => {
    router.get('/login', async (req, res) => {
        const {email, password, rememberMe} = req.body;

        const user = await DI.em.findOne(User, {email});
        if (!user) return res.sendStatus(401);

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.sendStatus(401);

        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: rememberMe ? '30d' : '15m'}
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: rememberMe
                ? 1000 * 60 * 60 * 24 * 30
                : undefined
        });

        res.json({id: user.id, email: user.email});
    });

    return router;
}


