import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'verification' })
export class Verification {
    @PrimaryKey({ type: 'text' })
    id!: string;

    @Property({ type: 'text' })
    identifier!: string;

    @Property({ type: 'text' })
    value!: string;

    @Property({ type: 'timestamptz' })
    expiresAt!: Date;

    @Property({ type: 'timestamptz' })
    createdAt!: Date;

    @Property({ type: 'timestamptz', onUpdate: () => new Date() })
    updatedAt!: Date;
}