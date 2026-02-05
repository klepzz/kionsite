import { MetadataRoute } from 'next';
import { allPosts } from '@/lib/posts';
import { allTests } from '@/lib/tests'; // Added import

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://kion.online';

    // Home, About, Tests, etc.
    const staticPages = [
        '',
        '/about',
        '/tests',
        '/archive',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Dynamic Blog Posts
    const postPages = allPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Dynamic Quiz Pages
    const testPages = allTests.map((test) => ({
        url: `${baseUrl}/tests/${test.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Dynamic Categories (Localized)
    const categorySlugs = ['bilim', 'spor', 'psikoloji', 'seyahat', 'teknoloji', 'science', 'sport', 'psychology', 'travel', 'technology'];
    const categoryPages = categorySlugs.map(slug => ({
        url: `${baseUrl}/category/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticPages, ...postPages, ...testPages, ...categoryPages];
}
