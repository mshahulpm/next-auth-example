'use client';

import AuthGuard from '@/guards/AuthGuard';

const dummyPosts = [
    { id: 1, title: 'My First Post', body: 'Hello world!' },
    { id: 2, title: 'Learning Next.js', body: 'Next.js is awesome!' },
    { id: 3, title: 'Context API Rocks', body: 'So easy to share state.' },
];

export default function PostsPage() {
    return (
        <AuthGuard>
            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Posts</h1>
                <div className="space-y-3">
                    {dummyPosts.map((post) => (
                        <div key={post.id} className="p-4 border rounded bg-white shadow-sm">
                            <h2 className="font-semibold text-lg">{post.title}</h2>
                            <p className="text-gray-600">{post.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AuthGuard>
    );
}
