import type { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './src/entities/User.js';
import { Post } from './src/entities/Post.js';
import { Migrator } from '@mikro-orm/migrations';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import {Tag} from "./src/entities/Tag.js";

const config: Options = {
    driver: PostgreSqlDriver,
    dbName: 'outer_games',
    user: 'user',
    password: 'password',
    host: 'localhost',
    port: 5432,
    entities: [User, Post, Tag],
    forceEntityConstructor: true,
    extensions: [Migrator],
    metadataProvider: TsMorphMetadataProvider,
};

export default config;