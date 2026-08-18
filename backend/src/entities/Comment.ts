import {Entity, PrimaryKey, Property, ManyToOne, Enum, Index} from '@mikro-orm/core';
import {User} from "./User.ts";
import {Post} from "./Post.ts";


@Entity({tableName: 'comments'})
export class Comment {
    @PrimaryKey()
    id!: number;

    @Property()
    createdAt = new Date();

    @Property({columnType: 'text'})
    body!: string;

    @Property({columnType: 'numeric', default: 0})
    likes: number = 0;

    @ManyToOne('User', {deleteRule: 'cascade'})
    @Index()
    author!: User;

    @ManyToOne('Post', {deleteRule: 'cascade'})
    @Index()
    post!: Post;
}