'use client';

import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";


export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthorized, loading } = useAuth();

    if (loading) {
        return <h2>Loading</h2>
    }
    // If not logged in, show login form
    if (!isAuthorized) {
        return <LoginForm />;
    }

    // Otherwise show original page content
    return <>{children}</>;
}
