import React, { createContext, useContext, useState, ReactNode } from 'react';
import { allBlogPosts as initialBlogPosts } from '../components/Blog';

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    date: string;
}

interface BlogContextType {
    posts: BlogPost[];
    addPost: (post: Omit<BlogPost, 'id' | 'date'>) => void;
    updatePost: (id: number, post: Omit<BlogPost, 'id'>) => void;
    deletePost: (id: number) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
};

interface BlogProviderProps {
    children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
    const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts);

    const addPost = (post: Omit<BlogPost, 'id' | 'date'>) => {
        const newPost: BlogPost = {
            id: Math.max(...posts.map(p => p.id)) + 1,
            ...post,
            date: new Date().toLocaleDateString('vi-VN')
        };
        setPosts([newPost, ...posts]);
    };

    const updatePost = (id: number, updatedPost: Omit<BlogPost, 'id'>) => {
        setPosts(posts.map(post =>
            post.id === id
                ? { ...post, ...updatedPost }
                : post
        ));
    };

    const deletePost = (id: number) => {
        setPosts(posts.filter(post => post.id !== id));
    };

    return (
        <BlogContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
            {children}
        </BlogContext.Provider>
    );
}; 