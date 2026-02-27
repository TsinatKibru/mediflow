'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { StaffManagement } from '@/components/admin/StaffManagement';
import { Users } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function StaffPage() {
    const { tenant } = useAuthStore();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Users className="h-6 w-6 text-indigo-600" />
                            Staff Management
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Manage hospital personnel, roles, and department assignments for {tenant?.name}.
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <StaffManagement />
                </div>
            </div>
        </DashboardLayout>
    );
}
