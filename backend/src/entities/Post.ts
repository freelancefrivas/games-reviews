import { Entity, PrimaryKey, Property, ManyToOne, Enum, Index } from '@mikro-orm/core';
import {User} from "./User.ts";

export enum PostType {
    NEWS = 'News',
    REVIEW = 'Review',
    OPINION = 'Opinion'
}

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

    @Property({ nullable: true })
    mainImage?: string;

    @Property({ columnType: 'text', fieldName: 'slug_code' })
    @Index()
    slugCode!: string;

    @Property({ columnType: 'text'})
    excerpt!: string;

    @Enum(() => PostType)
    type!: PostType;

    @ManyToOne(() => User)
    author!: User;

}