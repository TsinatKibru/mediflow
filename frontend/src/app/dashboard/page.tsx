'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { UserPlus, Calendar } from 'lucide-react';

export default function DashboardPage() {
    const { user, tenant } = useAuthStore();
    const router = useRouter();
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

    if (!user || !tenant) return null;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.firstName}!</h1>
                    <p className="text-slate-500">Here is what's happening at {tenant.name} today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Patients" value="128" change="+4% from last month" />
                    <StatCard title="Active Visits" value="12" change="6 pending triage" />
                    <StatCard title="Today's Revenue" value="$1,240.00" change="+12% from yesterday" />
                    <StatCard title="Available Doctors" value="4" change="2 on duty" />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Ready to manage your hospital?</h2>
                    <p className="text-slate-600 mb-6">Start by adding new patients or tracking active visits in real-time.</p>
                    <div className="flex justify-center space-x-4">
                        <Button onClick={() => router.push('/dashboard/patients')}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add New Patient
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/dashboard/appointments')}>
                            <Calendar className="mr-2 h-4 w-4" />
                            View Schedule
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ title, value, change }: { title: string; value: string; change: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors cursor-default">
            <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-slate-900 mb-2">{value}</p>
            <p className="text-xs text-indigo-600 font-medium">{change}</p>
        </div>
    );
}
