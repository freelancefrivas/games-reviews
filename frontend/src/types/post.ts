import type { User } from './user';

export enum PostType {
    NEWS = 'News',
    REVIEW = 'Review',
    OPINION = 'Opinion'
}

export interface Post {
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    body: string;
    author: User;
    type: PostType;
    mainImage?: string;
    slugCode: string;
    excerpt: string;
}