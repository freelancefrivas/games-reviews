import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import {User} from "./User.js";

@Entity({ tableName: 'posts' })
export class Post {
    @PrimaryKey()
    id!: number;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

    @Property({  })
    title!: string;

    @Property({ columnType: 'text' })
    body!: string;

    @ManyToOne(() => User)
    author!: User;

}