'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function LoginForm() {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            alert('Login successful!');
            // Optionally redirect to dashboard
            // router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

                {error && (
                    <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
                        {error}
                    </p>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Don’t have an account?{' '}
                    <a href="/signup" className="text-blue-600 hover:underline">
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    );
}
