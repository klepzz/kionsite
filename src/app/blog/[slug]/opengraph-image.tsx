import { ImageResponse } from 'next/og';
import { allPosts } from '@/lib/posts';

export const runtime = 'edge';

export const alt = 'Kion Blog Post';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const post = allPosts.find((p) => p.slug === slug);

    if (!post) {
        return new Response('Not Found', { status: 404 });
    }

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #fafaf9, #f5f5f4)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '80px',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '40px',
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#000',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '16px',
                        }}
                    >
                        <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>K</span>
                    </div>
                    <span style={{ fontSize: '32px', fontWeight: '600', color: '#1c1917', letterSpacing: '-0.02em' }}>Kion</span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#6366f1',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '24px'
                    }}
                >
                    {post.category}
                </div>

                <div
                    style={{
                        fontSize: '84px',
                        fontWeight: '800',
                        lineHeight: 1.1,
                        color: '#1c1917',
                        marginBottom: '40px',
                        maxWidth: '900px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {post.title}
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 'auto'
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '1px',
                            backgroundColor: '#d6d3d1',
                            marginRight: '20px'
                        }}
                    />
                    <span style={{ fontSize: '24px', color: '#78716c' }}>
                        {post.date} • {Math.ceil(post.content.split(' ').length / 200)} min read
                    </span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
