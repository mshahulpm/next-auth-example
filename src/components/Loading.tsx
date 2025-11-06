'use client';

export default function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4 text-lg font-medium">Loading...</p>
        </div>
    );
}
