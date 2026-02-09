'use client';

import { useAuthStore } from '@/store/authStore';
import { User, Bell } from 'lucide-react';

export function TopNav() {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="h-16 border-b bg-white px-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
            </div>

            <div className="flex items-center space-x-6">
                <button className="text-slate-500 hover:text-slate-700">
                    <Bell className="h-5 w-5" />
                </button>

                <div className="flex items-center space-x-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                            {user?.role?.toLowerCase().replace('_', ' ')}
                        </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <User className="h-6 w-6 text-slate-600" />
                    </div>
                </div>
            </div>
        </header>
    );
}
