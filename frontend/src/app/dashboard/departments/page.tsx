'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { DepartmentsManagement } from '@/components/admin/DepartmentsManagement';
import { Building2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function DepartmentsPage() {
    const { tenant } = useAuthStore();

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-indigo-600" />
                            Department Management
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Configure and manage hospital departments and clinical units for {tenant?.name || 'your hospital'}.
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <DepartmentsManagement />
                </div>
            </div>
        </DashboardLayout>
    );
}
