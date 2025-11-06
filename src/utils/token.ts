import Cookies from 'js-cookie';

// --- Constants ---
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// --- Helpers ---
function decodeJwt(token: string): any | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

// --- Token Setters/Getters ---
export function setTokens(accessToken: string, refreshToken: string) {
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1 / 24 }); // 1 hour
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7 });    // 7 days
}

export function getAccessToken(): string | undefined {
    return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
    return Cookies.get(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!Cookies.get(ACCESS_TOKEN_KEY);
}

// --- NEW FUNCTIONS: Token Validity ---
export function isAccessTokenValid(): boolean {
    const token = getAccessToken();
    if (!token) return false;

    const decoded = decodeJwt(token);
    if (!decoded?.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
}

export function isRefreshTokenValid(): boolean {
    const token = getRefreshToken();
    if (!token) return false;

    const decoded = decodeJwt(token);
    if (!decoded?.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
}

// --- Refresh Logic ---
export async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = getRefreshToken();
    if (!refreshToken || !isRefreshTokenValid()) return null;

    try {
        const res = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!res.ok) throw new Error('Failed to refresh token');
        const data = await res.json();

        if (data.access_token) {
            Cookies.set(ACCESS_TOKEN_KEY, data.access_token, { expires: 1 / 24 });
            return data.access_token;
        }

        return null;
    } catch (error) {
        console.error('Token refresh failed:', error);
        clearTokens();
        return null;
    }
}
