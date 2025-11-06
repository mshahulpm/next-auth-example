'use client';

import AuthGuard from '@/guards/AuthGuard';

const dummyUsers = [
    { id: 1, name: 'Alice', email: 'alice@mail.com' },
    { id: 2, name: 'Bob', email: 'bob@mail.com' },
    { id: 3, name: 'Charlie', email: 'charlie@mail.com' },
];

export default function UsersPage() {
    return (
        <AuthGuard>
            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Users</h1>
                <ul className="space-y-2">
                    {dummyUsers.map((u) => (
                        <li
                            key={u.id}
                            className="border p-3 rounded bg-white shadow-sm flex justify-between"
                        >
                            <span>{u.name}</span>
                            <span className="text-gray-500 text-sm">{u.email}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </AuthGuard>
    );
}
