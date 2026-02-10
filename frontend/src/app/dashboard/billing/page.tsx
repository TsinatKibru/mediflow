'use client';

import { useState, useEffect } from 'react';
import {
    CreditCard,
    Search,
    Filter,
    ChevronRight,
    DollarSign,
    AlertCircle,
    CheckCircle2,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Receipt,
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Visit, Payment, Patient, InsurancePolicy } from '@/types/billing';
import { useAuthStore } from '@/store/authStore';
import { PaymentModal } from '@/components/billing/PaymentModal';

export default function BillingPage() {
    const { token, isHydrated } = useAuthStore();
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PARTIAL' | 'UNPAID'>('ALL');
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
    const [selectedPatientPolicies, setSelectedPatientPolicies] = useState<InsurancePolicy[]>([]);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        if (isHydrated && token) {
            fetchVisits(token);
        }
    }, [isHydrated, token]);

    const fetchVisits = async (t: string) => {
        try {
            const res = await fetch('http://localhost:3000/visits', {
                headers: { 'Authorization': `Bearer ${t}` }
            });
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched visits:', data); // Diagnostic log
                setVisits(data);
            }
        } catch (err) {
            console.error('Failed to fetch visits:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatientPolicies = async (patientId: string) => {
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:3000/insurance-policies/patient/${patientId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedPatientPolicies(data);
            } else {
                setSelectedPatientPolicies([]);
            }
        } catch (err) {
            console.error('Failed to fetch policies:', err);
            setSelectedPatientPolicies([]);
        }
    };

    const getBillingStatus = (visit: Visit) => {
        const totalBilled = visit.payments?.reduce((acc, p) => acc + Number(p.amountCharged), 0) || 0;
        const totalPaid = visit.payments?.reduce((acc, p) => acc + Number(p.amountPaid), 0) || 0;

        if (totalBilled === 0) return 'UNPAID';
        if (totalPaid >= totalBilled) return 'PAID';
        if (totalPaid > 0) return 'PARTIAL';
        return 'UNPAID';
    };

    const filteredVisits = visits.filter(v => {
        const status = getBillingStatus(v);
        const matchesStatus = statusFilter === 'ALL' || status === statusFilter;
        const searchStr = `${v.patient?.firstName} ${v.patient?.lastName} ${v.id}`.toLowerCase();
        const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const stats = {
        totalOutstanding: visits.reduce((acc, v) => {
            const billed = v.payments?.reduce((pacc, p) => pacc + Number(p.amountCharged), 0) || 0;
            const paid = v.payments?.reduce((pacc, p) => pacc + Number(p.amountPaid), 0) || 0;
            return acc + (billed - paid);
        }, 0),
        collectedToday: visits.filter(v => {
            const today = new Date().toISOString().split('T')[0];
            return v.payments?.some(p => p.createdAt.startsWith(today));
        }).reduce((acc, v) => {
            const today = new Date().toISOString().split('T')[0];
            const paidToday = v.payments?.filter(p => p.createdAt.startsWith(today))
                .reduce((pacc, p) => pacc + Number(p.amountPaid), 0) || 0;
            return acc + paidToday;
        }, 0),
        pendingClaims: visits.filter(v => v.coverage?.type !== 'SELF' && getBillingStatus(v) !== 'PAID').length
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen pb-24">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                        <CreditCard className="h-7 w-7" />
                    </div>
                    Billing & Finance Board
                </h1>
                <p className="text-slate-500 mt-2 font-medium">Manage patient invoices, insurance claims, and revenue cycle.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-none shadow-sm bg-indigo-600 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-24 w-24" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-2">Total Outstanding Balance</p>
                        <h3 className="text-3xl font-black">{stats.totalOutstanding.toLocaleString()} <span className="text-base font-normal opacity-80 uppercase">ETB</span></h3>
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-2 py-1 rounded-lg">
                            <ArrowUpRight className="h-3 w-3" /> 12% from last week
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-none shadow-sm bg-white border-l-4 border-emerald-500">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Collected Today</p>
                    <h3 className="text-3xl font-black text-slate-900">{stats.collectedToday.toLocaleString()} <span className="text-base font-normal text-slate-400 uppercase">ETB</span></h3>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" /> Goal: 50,000 ETB
                    </div>
                </Card>

                <Card className="p-6 border-none shadow-sm bg-white border-l-4 border-amber-500">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Pending Claims</p>
                    <h3 className="text-3xl font-black text-slate-900">{stats.pendingClaims} <span className="text-base font-normal text-slate-400 uppercase">Visits</span></h3>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-600">
                        <ShieldCheck className="h-3 w-3" /> Insurance Verification Needed
                    </div>
                </Card>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search patient or invoice ID..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-white border outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-slate-100">
                    {['ALL', 'UNPAID', 'PARTIAL', 'PAID'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s as any)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === s
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Billing Table */}
            <Card className="border-none shadow-sm overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visit Info</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Billed Amt</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredVisits.map((visit) => {
                                const billed = visit.payments?.reduce((acc, p) => acc + Number(p.amountCharged), 0) || 0;
                                const paid = visit.payments?.reduce((acc, p) => acc + Number(p.amountPaid), 0) || 0;
                                const balance = billed - paid;
                                const status = getBillingStatus(visit);

                                return (
                                    <tr key={visit.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-mono text-[10px] font-bold">
                                                    #{visit.id.slice(-4).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{visit.department.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{visit.status}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-700">{visit.patient?.firstName} {visit.patient?.lastName}</p>
                                            <p className="text-xs text-slate-500">{visit.patient?.phone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-900">{billed.toLocaleString()} <span className="text-[10px] text-slate-400">ETB</span></p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className={`text-sm font-bold ${balance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                {balance.toLocaleString()} <span className="text-[10px] opacity-70">ETB</span>
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className={
                                                    status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        status === 'PARTIAL' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                            'bg-red-50 text-red-700 border-red-100'
                                                }
                                                variant="outline"
                                            >
                                                {status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-medium text-slate-500">{new Date(visit.createdAt).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(visit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 hover:bg-indigo-50"
                                                    onClick={() => {
                                                        setSelectedVisit(visit);
                                                        if (visit.patient) fetchPatientPolicies(visit.patient.id);
                                                        setIsPaymentModalOpen(true);
                                                    }}
                                                >
                                                    <Receipt className="h-4 w-4 text-indigo-600" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredVisits.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-slate-50 rounded-full">
                                                <Search className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-medium">No billing records found matching your filters.</p>
                                            <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}>Clear Filters</Button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modals */}
            {selectedVisit && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => {
                        setIsPaymentModalOpen(false);
                        setSelectedVisit(null);
                    }}
                    onSuccess={() => {
                        if (token) fetchVisits(token);
                    }}
                    token={token!}
                    patient={selectedVisit.patient!}
                    visit={selectedVisit}
                    policies={selectedPatientPolicies}
                />
            )}
        </div>
    );
}
