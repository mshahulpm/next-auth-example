'use client';

import { useAuth } from '@/context/AuthContext';

export default function UserStatus() {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <div className="flex items-center justify-center p-4 bg-gray-100 rounded-md">
                <p className="text-gray-700">You are not logged in.</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-4 bg-white shadow rounded-md">
            <div>
                <p className="font-medium text-gray-800">👋 Hello, {user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
                Logout
            </button>
        </div>
    );
}
