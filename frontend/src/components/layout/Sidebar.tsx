'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    Calendar,
    Clock,
    Settings,
    LogOut,
    CreditCard
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
    { name: 'Visits', href: '/dashboard/visits', icon: ClipboardList },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Schedule', href: '/dashboard/schedule', icon: Clock },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const tenant = useAuthStore((state) => state.tenant);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
            <div className="flex h-16 items-center justify-center border-b border-slate-800 px-4">
                <h1 className="text-xl font-bold text-indigo-400">MediFlow</h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {tenant?.name || 'Loading...'}
                    </p>
                </div>

                <nav className="space-y-1 px-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-slate-800 text-indigo-400'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <item.icon className={cn(
                                    'mr-3 h-5 w-5 flex-shrink-0',
                                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-white'
                                )} aria-hidden="true" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-slate-800 p-4">
                <button
                    onClick={handleLogout}
                    className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" />
                    Logout
                </button>
            </div>
        </div>
    );
}
