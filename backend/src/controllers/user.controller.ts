import {type Request, type Response, Router} from 'express';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {User} from '../entities/User.ts';
import {z} from 'zod';
import {Post} from "../entities/Post.ts";
import {QueryOrder} from "@mikro-orm/core";
import {uploadImage} from '../config/upload.js';
import multer from "multer";
import {requireAuth} from "../middleware.ts";
import {Sale} from "../entities/Sale.ts";

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

    /**
     * UPDATE USER DATA
     */
    router.put('/:id', requireAuth, async (req, res) => {
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
            return res.status(404).json({error: 'User not found'});
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

    /**
     * LIST USERS
     */
    router.get('/', requireAuth, async (req, res) => {
        const users = await DI.em.find(User, {}, {orderBy: {name: QueryOrder.DESC}});
        console.log(users);
        res.json(users);
    });

    router.post('/upload-image', requireAuth, (req, res) => {
        uploadImage.single('file')(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({error: 'File too large. Max 5MB.'});
                }
                return res.status(400).json({error: 'Upload error: ' + err.message});
            }

            if (err) {
                if (err.message === 'INVALID_FILE_TYPE') {
                    return res.status(400).json({error: 'Invalid file type. Only JPEG, PNG, WEBP, GIF allowed.'});
                }
                return res.status(500).json({error: 'Unexpected upload error' + err.message});
            }

            if (!req.file) {
                return res.status(400).json({error: 'No file provided'});
            }

            try {
                const url = `/uploads/profile-images/${req.file.filename}`;
                res.json({url});
            } catch (e) {
                res.status(500).json({error: 'Failed to process upload'});
            }
        });
    });


    return router;
}


