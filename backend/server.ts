import 'reflect-metadata';
import {MikroORM, EntityManager, type ForkOptions, RequestContext} from '@mikro-orm/core';
import express from 'express';
import {User} from './src/entities/User.js';
import {Post} from './src/entities/Post.js';
import {Tag} from "./src/entities/Tag.js";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
//import routes from "./src/routes.js";
import {initORM} from './src/config/orm.js';
import  mikroORMConfig from "./mikro-orm.config";
import {createAuth} from "./src/utils/auth.ts";
import {toNodeHandler} from "better-auth/node";

import {PostController} from "./src/controllers/post.controller.js";
import {TagController} from "./src/controllers/tag.controller.js";
import {UserController } from "./src/controllers/user.controller.js";
//import {AuthController} from "./src/controllers/auth.controller.js";
import {SaleController} from "./src/controllers/sale.controller.js";
import path from "node:path";
import {initAuth} from "./src/utils/auth-instance.ts";
import {CommentController} from "./src/controllers/comment.controller.ts";

export const DI: { orm?: MikroORM; em?: EntityManager } = {};

await initORM();

async function main() {

    const JWT_SECRET = process.env.JWT_SECRET as string;
    /* const orm = await MikroORM.init(mikroConfig);
     const em = orm.em.fork();*/
    const orm = await MikroORM.init(mikroORMConfig);
    DI.orm = orm;
    DI.em = orm.em;

    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin: ['http://localhost:5173'],
        credentials: true
    }));

    app.use((req, res, next) => {
        RequestContext.create(orm.em, next)
    })

   // app.use('/api', routes);
    const auth = initAuth(DI.orm)
    app.all("/api/auth/*splat", toNodeHandler(auth))
    app.use('/api/post', PostController(DI));
    app.use('/api/tag', TagController(DI));
    app.use('/api/user', UserController(DI));
   // app.use('/api/auth', AuthController(DI));
    app.use('/api/sale', SaleController(DI));
    app.use('/api/comment', CommentController(DI));
    app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

    //await orm.schema.refreshDatabase();



    app.listen(3000, () => {
        console.log('Server listening on port 3000');
    });
}

main().catch(console.error);