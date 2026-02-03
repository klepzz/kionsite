import { Post } from "../types/post";
import { allPosts as modularPosts } from "../data/posts";

export type BlogPost = Post;

export const allPosts: BlogPost[] = modularPosts;
