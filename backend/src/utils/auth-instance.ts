// src/utils/auth-instance.ts
import { MikroORM } from '@mikro-orm/core';
import { createAuth } from './auth.js';

type AuthInstance = ReturnType<typeof createAuth>;

let authInstance: AuthInstance;

export function initAuth(orm: MikroORM): AuthInstance {
    authInstance = createAuth(orm);
    return authInstance;
}

export function getAuth(): AuthInstance {
    if (!authInstance) {
        throw new Error('Auth not initialized yet. Call initAuth() first.');
    }
    return authInstance;
}