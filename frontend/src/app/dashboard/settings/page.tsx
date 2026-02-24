'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { ClinicSettings } from '@/components/settings/ClinicSettings';
import { Settings as SettingsIcon, UserCircle, Building2 } from 'lucide-react';

export default function SettingsPage() {
    const { user, isHydrated } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'profile' | 'clinic'>('profile');

    if (!isHydrated) return null;

    const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'HOSPITAL_ADMIN';

    return (
        <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen pb-24">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                        <SettingsIcon className="h-7 w-7" />
                    </div>
                    System Settings
                </h1>
                <p className="text-slate-500 mt-2 font-medium">Manage your personal profile and clinic configurations.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-2 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'profile'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                >
                    <UserCircle className="h-4 w-4 mr-2" />
                    My Profile
                </button>
                {isAdmin && (
                    <button
                        onClick={() => setActiveTab('clinic')}
                        className={`flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'clinic'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        <Building2 className="h-4 w-4 mr-2" />
                        Clinic Setup
                    </button>
                )}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'clinic' && isAdmin && <ClinicSettings />}
            </div>
        </div>
    );
}
