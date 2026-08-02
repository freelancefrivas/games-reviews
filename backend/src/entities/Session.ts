import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './User.js';

@Entity({ tableName: 'session' })
export class Session {
    @PrimaryKey({ type: 'text' })
    id!: string;

    @ManyToOne(() => User, { deleteRule: 'cascade' })
    user!: User;

    @Property({ type: 'text', unique: true })
    token!: string;

    @Property({ type: 'timestamptz' })
    expiresAt!: Date;

    @Property({ type: 'text', nullable: true })
    ipAddress?: string;

    @Property({ type: 'text', nullable: true })
    userAgent?: string;

    @Property({ type: 'timestamptz' })
    createdAt!: Date;

    @Property({ type: 'timestamptz', onUpdate: () => new Date() })
    updatedAt!: Date;
}