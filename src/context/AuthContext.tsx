'use client';

import { loginApi } from '@/api/auth';
import { registerAxiosLogoutCallback } from '@/api/apiClient';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as tokenUtils from '@/utils/token'

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


    const login = async (email: string, password: string) => {

        const { data } = await loginApi({ email, password })

        setUser(data.user);
        setIsAuthorized(true);
        setLoading(false)

        localStorage.setItem('user', JSON.stringify(data.user));
        tokenUtils.setAccessToken(data.access_token)
        tokenUtils.setRefreshToken(data.refresh_token)

    };

    const logout = () => {
        setUser(null);
        setIsAuthorized(false);
        localStorage.removeItem('user');
        tokenUtils.clearTokens()
    };

    // Try loading user from localStorage or cookie
    useEffect(() => {
        // need to fetch user info and store
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setIsAuthorized(true)
        }
        setLoading(false);
        registerAxiosLogoutCallback(logout)
    }, []);

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
