export interface Post {
    title: string;
    excerpt: string;
    category: "science" | "sport" | "psychology" | "travel" | "technology";
    date: string;
    slug: string;
    imageUrl: string;
    content: string;
    featured?: boolean;
    tags?: string[];
    keyTakeaways?: string[];
    glossary?: Record<string, string>;
    inlineQuiz?: {
        question: string;
        options: string[];
        answer: string;
        explanation: string;
    };
}
