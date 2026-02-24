'use client';

import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Convert hex color to "R, G, B" string for rgba() usage
function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '79, 70, 229'; // default indigo-600
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { token, isHydrated, tenant } = useAuthStore();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Wait for hydration before checking auth
        if (!isHydrated) return;

        if (!token) {
            router.push('/login');
        } else {
            setIsReady(true);
        }
    }, [token, isHydrated, router]);

    // Show loading while hydrating or checking auth
    if (!isHydrated || !isReady || !token) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    const brandColor = tenant?.primaryColor || '#4f46e5';
    const brandRgb = hexToRgb(brandColor);

    return (
        <div
            className="flex h-screen bg-slate-50"
            style={{
                '--brand-color': brandColor,
                '--brand-rgb': brandRgb,
            } as React.CSSProperties}
        >
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <TopNav />
                <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
        </div>
    );
}
