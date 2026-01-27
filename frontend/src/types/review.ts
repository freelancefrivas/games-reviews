import type {Post} from "@/types/post.ts";

export interface Review {
    id: number;
    post: Post;
}