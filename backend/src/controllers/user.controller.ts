import {type Request, type Response, Router} from 'express';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {User} from '../entities/User.ts';
import {z} from 'zod';
import 'multer';
import {Post} from "../entities/Post.ts";
import {QueryOrder} from "@mikro-orm/core";

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
            maxAge: rememberMe ? 1000 * 60 * 60 * 24 * 30 : undefined
        });

        res.json({id: user.id, email: user.email});
    });

    router.put('/:id', async (req, res) => {
        const {id} = req.params;
        const {firstName, lastName, email, newPassword, nickname} = req.body;
        const fs = require('fs');
        const newPicture = req.file;

        // Validations:
        const updateUserSchema = z.object({
            firstName: z.string(), lastName: z.string(), nickname: z.string(), email: z.email("Invalid email format"),
            newPassword: z.string().optional(),
        });
        if (newPicture && !['image/jpeg', 'image/png'].includes(newPicture.mimetype)) {
            return res.status(400).json({errors: {newPicture: ['File is not an image']}});
        }
        const result = updateUserSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({errors: result.error});
        }

        const user = await DI.em.findOne(User, {id});

        if (!user) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.nickname = nickname;

        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
        }

        if (newPicture) {
            user.picture = newPicture.buffer;
        }

        await DI.em.flush();

        return res.status(200).json({status: 'OK'});

    })

    router.get('/', async (req, res) => {
        // Order by lastName then firstName (both descending). Use MikroORM find options
        const users = await DI.em.find(User, {}, { orderBy: { lastName: QueryOrder.DESC, firstName: QueryOrder.DESC } });
        res.json(users);
    });

    return router;
}


