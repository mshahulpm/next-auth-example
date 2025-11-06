'use client';

import { loginApi } from '@/api/auth';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
    user_id: string
    email: string
    name: string
}

type AuthContextType = {
    user: User | null;
    isAuthorized: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [loading, setLoading] = useState(true);

    // Try loading user from localStorage or cookie
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setIsAuthorized(true)
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {

        const { data } = await loginApi({ email, password })

        setUser(data.user);
        setIsAuthorized(true);

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('accessToken', data.access_token);

    };

    const logout = () => {
        setUser(null);
        setIsAuthorized(false);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthorized, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
