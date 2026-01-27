import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config.js';

export let orm: MikroORM;

export async function initORM(): Promise<void> {
    if (orm) return;

    orm = await MikroORM.init(config);
}