import { Entity, PrimaryKey, Property } from '@mikro-orm/core';


@Entity({ tableName: 'users' })
export class User {
    @PrimaryKey({ type: 'number', autoincrement: true })
    id!: number;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

    @Property({ fieldName: 'first_name' })
    firstName!: string;

    @Property({ fieldName: 'last_name' })
    lastName!: string;

    @Property({  })
    email!: string;

    @Property({ })
    nickname!: string;

    @Property()
    password!: string;

    @Property()
    admin!: boolean;

    @Property()
    writer!: boolean;


}