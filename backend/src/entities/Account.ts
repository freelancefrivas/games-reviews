import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { User } from './User.ts';

@Entity({ tableName: 'account' })
export class Account {
    @PrimaryKey({ type: 'text' })
    id!: string;

    @ManyToOne(() => User, { deleteRule: 'cascade' })
    user!: User;

    @Property({ type: 'text' })
    accountId!: string;

    @Property({ type: 'text' })
    providerId!: string;

    @Property({ type: 'text', nullable: true })
    accessToken?: string;

    @Property({ type: 'text', nullable: true })
    refreshToken?: string;

    @Property({ type: 'timestamptz', nullable: true })
    accessTokenExpiresAt?: Date;

    @Property({ type: 'timestamptz', nullable: true })
    refreshTokenExpiresAt?: Date;

    @Property({ type: 'text', nullable: true })
    scope?: string;

    @Property({ type: 'text', nullable: true })
    idToken?: string;

    @Property({ type: 'text', nullable: true })
    password?: string;

    @Property({ type: 'timestamptz' })
    createdAt!: Date;

    @Property({ type: 'timestamptz', onUpdate: () => new Date() })
    updatedAt!: Date;
}