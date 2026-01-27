import {Entity, PrimaryKey, Property, ManyToOne, OneToOne, } from '@mikro-orm/core';
import {Post} from "./Post.ts";
import {User} from "./User.js";


@Entity({ tableName: 'reviews' })
export class Review {
    @PrimaryKey()
    id!: number;

    @OneToOne(() => Post, { owner: true })
    post!: Post;
}