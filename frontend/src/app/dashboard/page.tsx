'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { useBrandColor } from '@/hooks/useBrandColor';
import { Button } from '@/components/ui/Button';
import {
    Users, UserPlus, Calendar, Clock, CreditCard, Activity,
    CheckCircle2, AlertCircle, TrendingUp, ArrowRight,
    Stethoscope, ClipboardList, RefreshCw
} from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api.config';

interface DashboardStats {
    totalPatients: number;
    activeVisits: number;
    waitingVisits: number;
    completedToday: number;
    collectedToday: number;
    upcomingToday: number;
}

interface RecentVisit {
    id: string;
    status: string;
    createdAt: string;
    patient: { firstName: string; lastName: string };
    doctor?: { firstName: string; lastName: string };
}

interface TodayAppointment {
    id: string;
    startTime: string;
    status: string;
    patient: { firstName: string; lastName: string };
    doctor?: { firstName: string; lastName: string };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    WAITING: { label: 'Waiting', color: '#b45309', bg: '#fef3c7' },
    IN_PROGRESS: { label: 'In Progress', color: '#1d4ed8', bg: '#dbeafe' },
    COMPLETED: { label: 'Completed', color: '#15803d', bg: '#dcfce7' },
    CHECKED_IN: { label: 'Checked In', color: '#7c3aed', bg: '#ede9fe' },
    SCHEDULED: { label: 'Scheduled', color: '#0369a1', bg: '#e0f2fe' },
    CANCELLED: { label: 'Cancelled', color: '#b91c1c', bg: '#fee2e2' },
};

function getStatus(s: string) {
    return STATUS_CONFIG[s] || { label: s, color: '#64748b', bg: '#f1f5f9' };
}

export default function DashboardPage() {
    const { user, tenant, token } = useAuthStore();
    const { brandColor, brandAlpha } = useBrandColor();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activeVisits, setActiveVisits] = useState<RecentVisit[]>([]);
    const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([]);
    const [loading, setLoading] = useState(true);

    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const fetchDashboardData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [patientsRes, visitsRes, appRes, payRes] = await Promise.all([
                fetch(API_ENDPOINTS.PATIENTS.BASE, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(API_ENDPOINTS.VISITS.BASE, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(API_ENDPOINTS.APPOINTMENTS.BASE, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(API_ENDPOINTS.BILLING.PAYMENTS, { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            const patientsResult = patientsRes.ok ? await patientsRes.json() : { data: [], total: 0 };
            const visitsResult = visitsRes.ok ? await visitsRes.json() : { data: [], total: 0 };
            const appointments = appRes.ok ? await appRes.json() : [];
            const paymentsResult = payRes.ok ? await payRes.json() : { data: [], total: 0 };

            const patients = patientsResult.data || [];
            const visits = visitsResult.data || [];
            const payments = paymentsResult.data || [];

            const today = new Date().toDateString();

            // Active visits (WAITING or IN_PROGRESS)
            const active: RecentVisit[] = visits.filter((v: any) =>
                ['WAITING', 'IN_PROGRESS', 'CHECKED_IN'].includes(v.status)
            ).slice(0, 6);

            // Today's appointments
            const todayAppts: TodayAppointment[] = appointments.filter((a: any) => {
                return new Date(a.startTime).toDateString() === today && a.status !== 'CANCELLED';
            }).slice(0, 6);

            // Today's collected revenue (non-voided)
            const collectedToday = payments
                .filter((p: any) => !p.isVoided && new Date(p.createdAt).toDateString() === today)
                .reduce((sum: number, p: any) => sum + Number(p.amountPaid || 0), 0);

            // Visits completed today
            const completedToday = visits.filter((v: any) =>
                v.status === 'COMPLETED' && new Date(v.updatedAt || v.createdAt).toDateString() === today
            ).length;

            setActiveVisits(active);
            setTodayAppointments(todayAppts);
            setStats({
                totalPatients: patientsResult.total || patients.length,
                activeVisits: visits.filter((v: any) => ['WAITING', 'IN_PROGRESS', 'CHECKED_IN'].includes(v.status)).length,
                waitingVisits: visits.filter((v: any) => v.status === 'WAITING').length,
                completedToday,
                collectedToday,
                upcomingToday: todayAppts.length
            });
        } catch (err) {
            console.error('Dashboard data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        // Refresh every 60 seconds
        const interval = setInterval(fetchDashboardData, 60_000);
        return () => clearInterval(interval);
    }, [token]);

    if (!user || !tenant) return null;

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-screen-2xl">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            {greeting}, {user.firstName} 👋
                        </h1>
                        <p className="text-slate-500 text-sm mt-0.5">{dateStr} — {tenant.name}</p>
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700 transition-colors bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        icon={Users}
                        label="Total Patients"
                        value={loading ? '—' : String(stats?.totalPatients ?? 0)}
                        sub="Registered in system"
                        color={brandColor}
                        bg={brandAlpha(0.1)}
                        onClick={() => router.push('/dashboard/patients')}
                    />
                    <KpiCard
                        icon={Activity}
                        label="Active Visits"
                        value={loading ? '—' : String(stats?.activeVisits ?? 0)}
                        sub={`${stats?.waitingVisits ?? 0} waiting for triage`}
                        color="#d97706"
                        bg="#fef3c7"
                        onClick={() => router.push('/dashboard/visits')}
                    />
                    <KpiCard
                        icon={CheckCircle2}
                        label="Completed Today"
                        value={loading ? '—' : String(stats?.completedToday ?? 0)}
                        sub="Visits discharged"
                        color="#15803d"
                        bg="#dcfce7"
                    />
                    <KpiCard
                        icon={CreditCard}
                        label="Collected Today"
                        value={loading ? '—' : `${(stats?.collectedToday ?? 0).toLocaleString()} ETB`}
                        sub="Revenue (non-voided)"
                        color="#1d4ed8"
                        bg="#dbeafe"
                        onClick={() => router.push('/dashboard/billing')}
                    />
                </div>

                {/* Main Content: Active Visits + Today's Appointments */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Active Visits */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg" style={{ backgroundColor: brandAlpha(0.1) }}>
                                    <ClipboardList className="h-4 w-4" style={{ color: brandColor }} />
                                </div>
                                <h2 className="font-bold text-slate-800 text-sm">Active Visits</h2>
                                {stats && stats.activeVisits > 0 && (
                                    <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: brandColor }}>
                                        {stats.activeVisits}
                                    </span>
                                )}
                            </div>
                            <button className="text-xs font-bold flex items-center gap-1" style={{ color: brandColor }} onClick={() => router.push('/dashboard/visits')}>
                                View all <ArrowRight className="h-3 w-3" />
                            </button>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {loading ? (
                                <div className="p-8 text-center text-slate-400">
                                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" style={{ color: brandColor }} />
                                    Loading...
                                </div>
                            ) : activeVisits.length === 0 ? (
                                <div className="p-8 text-center">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-300 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-700">All clear!</p>
                                    <p className="text-xs text-slate-400">No active visits right now.</p>
                                </div>
                            ) : (
                                activeVisits.map((visit) => {
                                    const st = getStatus(visit.status);
                                    return (
                                        <div key={visit.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => router.push('/dashboard/visits')}>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: brandAlpha(0.12), color: brandColor }}>
                                                    {visit.patient.firstName[0]}{visit.patient.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{visit.patient.firstName} {visit.patient.lastName}</p>
                                                    {visit.doctor && <p className="text-xs text-slate-400">Dr. {visit.doctor.firstName} {visit.doctor.lastName}</p>}
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ color: st.color, backgroundColor: st.bg }}>
                                                {st.label}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Today's Appointments */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-sky-50">
                                    <Calendar className="h-4 w-4 text-sky-600" />
                                </div>
                                <h2 className="font-bold text-slate-800 text-sm">Today's Schedule</h2>
                                {stats && stats.upcomingToday > 0 && (
                                    <span className="text-xs font-bold text-white bg-sky-500 px-2 py-0.5 rounded-full">
                                        {stats.upcomingToday}
                                    </span>
                                )}
                            </div>
                            <button className="text-xs font-bold text-sky-600 flex items-center gap-1" onClick={() => router.push('/dashboard/appointments')}>
                                View calendar <ArrowRight className="h-3 w-3" />
                            </button>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {loading ? (
                                <div className="p-8 text-center text-slate-400">
                                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-sky-400" />
                                    Loading...
                                </div>
                            ) : todayAppointments.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Calendar className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-700">No appointments today</p>
                                    <p className="text-xs text-slate-400">Schedule is clear for today.</p>
                                </div>
                            ) : (
                                todayAppointments.map((appt) => {
                                    const st = getStatus(appt.status);
                                    const time = new Date(appt.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                    return (
                                        <div key={appt.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => router.push('/dashboard/appointments')}>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-sky-50 flex items-center justify-center text-xs font-bold text-sky-600">
                                                    {appt.patient.firstName[0]}{appt.patient.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{appt.patient.firstName} {appt.patient.lastName}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {appt.doctor ? `Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}` : 'No doctor assigned'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-700">{time}</p>
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: st.color, backgroundColor: st.bg }}>
                                                    {st.label}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <QuickAction
                            icon={UserPlus} label="Register Patient"
                            description="Add a new patient record"
                            onClick={() => router.push('/dashboard/patients')}
                            brandColor={brandColor} brandBg={brandAlpha(0.08)}
                        />
                        <QuickAction
                            icon={Stethoscope} label="Start Visit"
                            description="Check in a patient"
                            onClick={() => router.push('/dashboard/visits')}
                            brandColor={brandColor} brandBg={brandAlpha(0.08)}
                        />
                        <QuickAction
                            icon={Calendar} label="Book Appointment"
                            description="Schedule a new booking"
                            onClick={() => router.push('/dashboard/appointments')}
                            brandColor={brandColor} brandBg={brandAlpha(0.08)}
                        />
                        <QuickAction
                            icon={CreditCard} label="New Invoice"
                            description="Create a billing record"
                            onClick={() => router.push('/dashboard/billing')}
                            brandColor={brandColor} brandBg={brandAlpha(0.08)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function KpiCard({ icon: Icon, label, value, sub, color, bg, onClick }: {
    icon: any; label: string; value: string; sub: string;
    color: string; bg: string; onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
        >
            <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg" style={{ backgroundColor: bg }}>
                    <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <TrendingUp className="h-4 w-4 text-slate-200" />
            </div>
            <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
            </div>
            <p className="text-xs text-slate-400">{sub}</p>
        </div>
    );
}

function QuickAction({ icon: Icon, label, description, onClick, brandColor, brandBg }: {
    icon: any; label: string; description: string; onClick: () => void;
    brandColor: string; brandBg: string;
}) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-start p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all text-left bg-slate-50/50 hover:bg-white"
        >
            <div className="p-2 rounded-lg mb-3" style={{ backgroundColor: brandBg }}>
                <Icon className="h-5 w-5" style={{ color: brandColor }} />
            </div>
            <p className="text-sm font-bold text-slate-800">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </button>
    );
}
