'use client';

import { loginApi } from '@/api/auth';
import { registerAxiosLogoutCallback } from '@/api/apiClient';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as tokenUtils from '@/utils/token'
import { getProfileApi } from '@/api/profile';

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

    const storedUser = localStorage.getItem('user');
    const isAccessTokenValid = tokenUtils.isAccessTokenValid()
    const isRefreshTokenValid = tokenUtils.isRefreshTokenValid()
    const isValidTokens = isAccessTokenValid && isRefreshTokenValid

    const [user, setUser] = useState<User | null>(storedUser ? JSON.parse(storedUser) : null);
    const [isAuthorized, setIsAuthorized] = useState(isValidTokens)
    const [loading, setLoading] = useState(isValidTokens && !storedUser);


    const login = async (email: string, password: string) => {

        const { data } = await loginApi({ email, password })

        setUser(data.user);
        setIsAuthorized(true);
        setLoading(false);

        localStorage.setItem('user', JSON.stringify(data.user));
        tokenUtils.setAccessToken(data.access_token)
        tokenUtils.setRefreshToken(data.refresh_token)

    };

    const logout = () => {
        setUser(null);
        setIsAuthorized(false);
        localStorage.removeItem('user');
        tokenUtils.clearTokens();
    };

    // Try loading user from localStorage or cookie
    useEffect(() => {
        // need to fetch user info and store

        async function init() {

            if (isValidTokens) {
                try {
                    // need to fetch the user info 
                    const user = await getProfileApi()
                    setUser(user as User)
                    setLoading(false)
                } catch (error) {
                    setIsAuthorized(false)
                    setLoading(false)
                    setUser(null)
                }
            } else {
                setIsAuthorized(false)
                setLoading(false)
                setUser(null)
            }

        }

        init()

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
