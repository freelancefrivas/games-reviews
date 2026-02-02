import type {Options} from '@mikro-orm/core';
import {PostgreSqlDriver} from '@mikro-orm/postgresql';
import {User} from './src/entities/User.ts';
import {Post} from './src/entities/Post.ts';
import {Migrator} from '@mikro-orm/migrations';
import {TsMorphMetadataProvider} from '@mikro-orm/reflection';
import {Tag} from "./src/entities/Tag.ts";
import dotenv from 'dotenv';
import {Review} from "./src/entities/Review.ts";
import {PostMonthlyClicks} from "./src/entities/PostMonthlyClicks.js";
dotenv.config();


const config  = {
    driver: PostgreSqlDriver,
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    entities: [User, Post, Tag, Review, PostMonthlyClicks],
    forceEntityConstructor: true,
    extensions: [Migrator],
    metadataProvider: TsMorphMetadataProvider,
};

export default config;