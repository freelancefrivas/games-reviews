import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity({ tableName: 'roles' })
export class Role {
    @PrimaryKey()
    id!: number;

    @Property()
    @Unique()
    name!: string;

}