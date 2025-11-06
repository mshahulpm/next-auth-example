// src/lib/axiosClient.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import * as tokenUtil from '@/utils/token';

let logoutCallback: (() => void) | null = null;

/**
 * Register a logout callback function.
 * This will be called when refresh token is invalid or refresh fails.
 */
export const registerAxiosLogoutCallback = (callback: () => void) => {
    logoutCallback = callback;
};

/**
 * Create Axios client with token & refresh logic.
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    headers: { 'Content-Type': 'application/json' },
});

// ✅ Attach access token to every request
apiClient.interceptors.request.use((config) => {
    const accessToken = tokenUtil.getAccessToken();
    if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// ✅ Handle expired token (401)
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // If token expired and not retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = tokenUtil.getRefreshToken();
            if (!refreshToken || !tokenUtil.isRefreshTokenValid()) {
                // No valid refresh token — logout
                tokenUtil.clearTokens();
                logoutCallback?.();
                return Promise.reject(error);
            }

            try {
                // Attempt to refresh access token
                const newAccessToken = await tokenUtil.refreshAccessToken();
                if (!newAccessToken) {
                    // Refresh failed — logout
                    tokenUtil.clearTokens();
                    logoutCallback?.();
                    return Promise.reject(error);
                }

                // Save new access token & retry the failed request
                tokenUtil.setAccessToken(newAccessToken);
                tokenUtil.setRefreshToken(refreshToken)
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh request failed — logout user
                tokenUtil.clearTokens();
                logoutCallback?.();
                return Promise.reject(refreshError);
            }
        }

        // Pass through any other errors
        return Promise.reject(error);
    }
);

export default apiClient;
