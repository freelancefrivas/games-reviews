import type {Post} from "@/types/post.ts";
import type {User} from "@/types/user.ts";

export interface Comment {
    id: number;
    createdAt: string;
    body: string;
    author: User;
    post: Post;
    likes: number;
}