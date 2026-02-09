'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
    User,
    Calendar,
    Phone,
    Mail,
    MapPin,
    ArrowLeft,
    Clock,
    Activity,
    FileText,
    UserPlus,
    Search,
    Filter,
    CreditCard,
    Receipt,
    ShieldCheck,
    AlertCircle,
    Printer,
    DollarSign,
    Edit3,
    Power
} from 'lucide-react';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string;
    email: string;
    address?: string;
    createdAt: string;
}

interface Payment {
    id: string;
    amountCharged: number;
    amountPaid: number;
    method: 'CASH' | 'WAIVED' | 'PARTIAL' | 'OTHER';
    serviceType: 'REGISTRATION' | 'CONSULTATION' | 'LABORATORY' | 'PHARMACY' | 'PROCEDURE' | 'RADIOLOGY' | 'OTHER';
    status: string;
    reason?: string;
    createdAt: string;
    verifiedBy?: {
        firstName: string;
        lastName: string;
    };
}

interface InsurancePolicy {
    id: string;
    type: 'SELF' | 'GOVERNMENT_BOOK' | 'NGO' | 'OTHER';
    policyNumber: string;
    issuedToName?: string;
    issueYear?: number;
    expiryYear?: number;
    providerName?: string;
    notes?: string;
    isActive: boolean;
    createdAt: string;
}

interface Coverage {
    id: string;
    type: 'SELF' | 'GOVERNMENT_BOOK' | 'NGO' | 'OTHER';
    referenceNumber?: string;
    issuedToName?: string;
    issueYear?: number;
    expiryYear?: number;
    insurancePolicyId?: string;
    notes?: string;
    verifiedBy?: {
        firstName: string;
        lastName: string;
    };
    verifiedAt: string;
}

interface Visit {
    id: string;
    status: 'REGISTERED' | 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
    reason: string;
    createdAt: string;
    department: {
        name: string;
    };
    vitals?: {
        temperature: number;
        pulse: number;
        bpSystolic: number;
        bpDiastolic: number;
    };
    consultation?: {
        notes: string;
        prescription?: string;
    };
    payments?: Payment[];
    coverage?: Coverage;
}

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { token } = useAuthStore();
    const { id } = use(params); // Unwrap Promise in Next.js 15+
    const [patient, setPatient] = useState<Patient | null>(null);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isNewVisitModalOpen, setIsNewVisitModalOpen] = useState(false);
    const [visitSearchQuery, setVisitSearchQuery] = useState('');
    const [visitStatusFilter, setVisitStatusFilter] = useState<string>('ALL');
    const [visitStartDate, setVisitStartDate] = useState<string>('');
    const [visitEndDate, setVisitEndDate] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'medical' | 'billing' | 'insurance'>('medical');
    const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
    const [editingPolicy, setEditingPolicy] = useState<InsurancePolicy | null>(null);
    const selectedVisit = visits.find(v => v.id === selectedVisitId);
    useEffect(() => {
        if (token && id) {
            fetchPatientDetails();
            fetchPatientPolicies();
        }
    }, [token, id]);

    const fetchPatientPolicies = async () => {
        try {
            const res = await fetch(`http://localhost:3000/insurance-policies?patientId=${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch policies');
            const data = await res.json();
            setPolicies(data);
        } catch (error) {
            console.error('Error fetching policies:', error);
        }
    };

    const fetchPatientDetails = async () => {
        setLoading(true);
        try {
            // Fetch patient details
            const patientRes = await fetch(`http://localhost:3000/patients/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!patientRes.ok) throw new Error('Failed to fetch patient');
            const patientData = await patientRes.json();
            setPatient(patientData);

            // Fetch patient visits
            const visitsRes = await fetch(`http://localhost:3000/patients/${id}/visits`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!visitsRes.ok) throw new Error('Failed to fetch visits');
            const visitsData = await visitsRes.json();
            setVisits(visitsData);
        } catch (error) {
            console.error('Error fetching patient details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePolicyStatus = async (policy: InsurancePolicy) => {
        try {
            const res = await fetch(`http://localhost:3000/insurance-policies/${policy.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !policy.isActive })
            });
            if (!res.ok) throw new Error('Failed to update policy status');
            fetchPatientPolicies();
        } catch (error) {
            console.error('Error toggling policy status:', error);
        }
    };

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getStatusVariant = (status: string): 'info' | 'warning' | 'success' | 'danger' | 'default' => {
        switch (status) {
            case 'REGISTERED': return 'info';
            case 'WAITING': return 'warning';
            case 'IN_CONSULTATION': return 'warning';
            case 'COMPLETED': return 'success';
            case 'CANCELLED': return 'danger';
            default: return 'default';
        }
    };

    const formatStatus = (status: string) => status.split('_').join(' ');

    const filteredVisits = visits.filter(visit => {
        // Status Filter
        if (visitStatusFilter !== 'ALL' && visit.status !== visitStatusFilter) return false;

        // Date Filter
        if (visitStartDate) {
            const start = new Date(visitStartDate);
            start.setHours(0, 0, 0, 0);
            if (new Date(visit.createdAt) < start) return false;
        }
        if (visitEndDate) {
            const end = new Date(visitEndDate);
            end.setHours(23, 59, 59, 999);
            if (new Date(visit.createdAt) > end) return false;
        }

        // Search Query (Department, Reason, or Consultation Notes)
        if (!visitSearchQuery) return true;
        const query = visitSearchQuery.toLowerCase();
        const deptName = visit.department.name.toLowerCase();
        const reason = (visit.reason || '').toLowerCase();
        const notes = (visit.consultation?.notes || '').toLowerCase();
        const prescription = (visit.consultation?.prescription || '').toLowerCase();

        return (
            deptName.includes(query) ||
            reason.includes(query) ||
            notes.includes(query) ||
            prescription.includes(query)
        );
    });

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
                        <p className="text-slate-600">Loading patient details...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!patient) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <p className="text-slate-600">Patient not found</p>
                    <Button variant="outline" onClick={() => router.push('/dashboard/patients')} className="mt-4">
                        Back to Patients
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/patients')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {patient.firstName} {patient.lastName}
                            </h1>
                            <p className="text-slate-500 text-sm">Patient Profile</p>
                        </div>
                    </div>
                    <Button size="sm" onClick={() => setIsNewVisitModalOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        New Visit
                    </Button>
                </div>

                {/* Patient Demographics Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start space-x-6">
                        <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-indigo-200">
                            <User className="h-12 w-12 text-indigo-600" />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Personal Information</p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                                        <span className="text-slate-600">
                                            {calculateAge(patient.dateOfBirth)} years old
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <User className="h-4 w-4 text-slate-400 mr-2" />
                                        <span className="text-slate-600 capitalize">{patient.gender.toLowerCase()}</span>
                                    </div>
                                    {policies.find(p => p.isActive) && (
                                        <div className="flex items-center pt-1">
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none flex items-center gap-1 py-1">
                                                <ShieldCheck className="h-3 w-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                                    Active: {policies.find(p => p.isActive)?.type.split('_').join(' ')} #{policies.find(p => p.isActive)?.policyNumber}
                                                </span>
                                            </Badge>
                                        </div>
                                    )}
                                    <div className="text-xs text-slate-500">
                                        DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Contact Details</p>
                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <Phone className="h-4 w-4 text-slate-400 mr-2" />
                                        <span className="text-slate-600">{patient.phone}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Mail className="h-4 w-4 text-slate-400 mr-2" />
                                        <span className="text-slate-600">{patient.email}</span>
                                    </div>
                                    {patient.address && (
                                        <div className="flex items-start text-sm">
                                            <MapPin className="h-4 w-4 text-slate-400 mr-2 mt-0.5" />
                                            <span className="text-slate-600">{patient.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Statistics</p>
                                <div className="space-y-2">
                                    <div className="text-sm">
                                        <span className="text-slate-600">Total Visits: </span>
                                        <span className="font-bold text-slate-900">{visits.length}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-slate-600">Registered: </span>
                                        <span className="text-slate-500 text-xs">
                                            {new Date(patient.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200">
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'medical' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        onClick={() => setActiveTab('medical')}
                    >
                        Medical History
                        {activeTab === 'medical' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                        )}
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'billing' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        onClick={() => setActiveTab('billing')}
                    >
                        Billing & Visits
                        {activeTab === 'billing' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                        )}
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'insurance' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        onClick={() => setActiveTab('insurance')}
                    >
                        Insurance & Policies
                        {activeTab === 'insurance' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                        )}
                    </button>
                </div>

                {activeTab === 'medical' && (
                    <>
                        {/* Visit History */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">Visit History</h2>
                                        <p className="text-sm text-slate-500">Complete medical visit timeline</p>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-2">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="date"
                                                className="px-2 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white shadow-sm"
                                                value={visitStartDate}
                                                onChange={(e) => setVisitStartDate(e.target.value)}
                                                title="Start Date"
                                            />
                                            <span className="text-slate-400">to</span>
                                            <input
                                                type="date"
                                                className="px-2 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white shadow-sm"
                                                value={visitEndDate}
                                                onChange={(e) => setVisitEndDate(e.target.value)}
                                                title="End Date"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Search visits..."
                                                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full md:w-40 shadow-sm"
                                                value={visitSearchQuery}
                                                onChange={(e) => setVisitSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <select
                                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white shadow-sm"
                                            value={visitStatusFilter}
                                            onChange={(e) => setVisitStatusFilter(e.target.value)}
                                        >
                                            <option value="ALL">All Status</option>
                                            <option value="REGISTERED">Registered</option>
                                            <option value="WAITING">Waiting</option>
                                            <option value="IN_CONSULTATION">In Consultation</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                        {(visitSearchQuery || visitStatusFilter !== 'ALL' || visitStartDate || visitEndDate) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setVisitSearchQuery('');
                                                    setVisitStatusFilter('ALL');
                                                    setVisitStartDate('');
                                                    setVisitEndDate('');
                                                }}
                                                className="text-xs h-9"
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {filteredVisits.length === 0 ? (
                                <div className="px-6 py-12 text-center text-slate-500">
                                    <Activity className="h-12 w-12 text-slate-200 mb-2 mx-auto" />
                                    <p className="text-slate-900 font-medium">No visits found</p>
                                    <p className="text-xs">
                                        {visitSearchQuery || visitStatusFilter !== 'ALL'
                                            ? 'No visits match your current filters.'
                                            : 'This patient hasn\'t visited yet.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredVisits.map((visit) => (
                                        <div key={visit.id} className="p-6 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start space-x-4">
                                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        <Activity className="h-5 w-5 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <h3 className="font-semibold text-slate-900">{visit.department.name}</h3>
                                                            <Badge variant={getStatusVariant(visit.status)}>
                                                                {formatStatus(visit.status)}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-slate-600 mb-1">{visit.reason || 'No reason specified'}</p>
                                                        <div className="flex items-center text-xs text-slate-500">
                                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                                            {new Date(visit.createdAt).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Vitals */}
                                            {visit.vitals && (
                                                <div className="ml-14 mb-3 p-3 bg-slate-50 rounded-lg">
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Vitals</p>
                                                    <div className="grid grid-cols-4 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-slate-500">Temp:</span>{' '}
                                                            <span className="font-medium">{visit.vitals.temperature}°C</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500">BP:</span>{' '}
                                                            <span className="font-medium">{visit.vitals.bpSystolic}/{visit.vitals.bpDiastolic}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500">Pulse:</span>{' '}
                                                            <span className="font-medium">{visit.vitals.pulse} bpm</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Consultation */}
                                            {visit.consultation && (
                                                <div className="ml-14 p-3 bg-emerald-50 rounded-lg">
                                                    <p className="text-xs font-bold text-emerald-700 uppercase mb-2 flex items-center">
                                                        <FileText className="h-3.5 w-3.5 mr-1" />
                                                        Consultation Notes
                                                    </p>
                                                    <p className="text-sm text-slate-700 mb-2">{visit.consultation.notes}</p>
                                                    {visit.consultation.prescription && (
                                                        <div className="mt-2 pt-2 border-t border-emerald-100">
                                                            <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Prescription</p>
                                                            <p className="text-sm text-slate-700">{visit.consultation.prescription}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'billing' && (
                    <div className="space-y-6">
                        {/* Billing Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-slate-500">Total Billed</p>
                                    <DollarSign className="h-5 w-5 text-indigo-500" />
                                </div>
                                <p className="text-2xl font-bold text-slate-900">
                                    {visits.reduce((acc, v) => acc + (v.payments?.reduce((pAcc, p) => pAcc + Number(p.amountCharged), 0) || 0), 0).toFixed(2)} ETB
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-slate-500">Total Paid</p>
                                    <CreditCard className="h-5 w-5 text-emerald-500" />
                                </div>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {visits.reduce((acc, v) => acc + (v.payments?.reduce((pAcc, p) => pAcc + Number(p.amountPaid), 0) || 0), 0).toFixed(2)} ETB
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-slate-500">Outstanding Balance</p>
                                    <AlertCircle className="h-5 w-5 text-amber-500" />
                                </div>
                                <p className="text-2xl font-bold text-slate-900">
                                    {(
                                        visits.reduce((acc, v) => acc + (v.payments?.reduce((pAcc, p) => pAcc + Number(p.amountCharged), 0) || 0), 0) -
                                        visits.reduce((acc, v) => acc + (v.payments?.reduce((pAcc, p) => pAcc + Number(p.amountPaid), 0) || 0), 0)
                                    ).toFixed(2)} ETB
                                </p>
                            </div>
                        </div>

                        {/* Billing History Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Billing History</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {visits.length === 0 ? (
                                    <div className="p-12 text-center text-slate-500">No visits recorded for billing.</div>
                                ) : (
                                    visits.map((visit) => {
                                        const totalCharged = visit.payments?.reduce((acc, p) => acc + Number(p.amountCharged), 0) || 0;
                                        const totalPaid = visit.payments?.reduce((acc, p) => acc + Number(p.amountPaid), 0) || 0;
                                        const balance = totalCharged - totalPaid;
                                        const isCovered = !!visit.coverage;

                                        return (
                                            <div key={visit.id} className="p-6 hover:bg-slate-50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                            <Receipt className="h-5 w-5 text-slate-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">Visit – {visit.department.name}</p>
                                                            <div className="flex items-center space-x-2 mt-0.5">
                                                                <p className="text-xs text-slate-500">{new Date(visit.createdAt).toLocaleDateString()}</p>
                                                                <span className="text-slate-300">•</span>
                                                                <Badge variant="outline" size="sm" className="text-[10px] py-0 px-1 border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase">
                                                                    {visit.payments && visit.payments.length > 0
                                                                        ? [...new Set(visit.payments.map(p => p.serviceType))].join(', ').split('_').join(' ')
                                                                        : 'Pending Billing'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-6">
                                                        <div className="text-right">
                                                            <p className="text-xs text-slate-500 uppercase font-bold">Total Charged</p>
                                                            <p className="text-sm font-bold text-slate-900">{totalCharged.toFixed(2)} ETB</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-slate-500 uppercase font-bold">Amount Paid</p>
                                                            <p className="text-sm font-bold text-emerald-600">{totalPaid.toFixed(2)} ETB</p>
                                                        </div>
                                                        <div className="text-right w-24">
                                                            <p className="text-xs text-slate-500 uppercase font-bold">Balance</p>
                                                            <p className={`text-sm font-bold ${balance > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{balance.toFixed(2)} ETB</p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            {isCovered && (
                                                                <Badge variant="success" className="flex items-center">
                                                                    <ShieldCheck className="h-3 w-3 mr-1" />
                                                                    {visit.coverage?.type.split('_').join(' ')}
                                                                </Badge>
                                                            )}
                                                            <Button
                                                                size="sm"
                                                                variant={balance > 0 ? 'primary' : 'outline'}
                                                                onClick={() => {
                                                                    setSelectedVisitId(visit.id);
                                                                    setIsPaymentModalOpen(true);
                                                                }}
                                                            >
                                                                {balance > 0 ? 'Update Payment' : 'View Details'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Insurance & Policies Tab */}
                {activeTab === 'insurance' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <ShieldCheck className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Active Insurance Policies</h3>
                                </div>
                                <Button size="sm" onClick={() => setIsPolicyModalOpen(true)}>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Add New Policy
                                </Button>
                            </div>
                            <div className="p-6">
                                {policies.length === 0 ? (
                                    <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                            <ShieldCheck className="h-6 w-6 text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 font-medium">No insurance policies recorded</p>
                                        <p className="text-slate-400 text-xs mt-1">Add a government book or NGO policy to simplify billing</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {policies.map((policy) => (
                                            <div key={policy.id} className="p-4 border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-md transition-all group relative">
                                                {!policy.isActive && (
                                                    <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10">
                                                        <Badge variant="outline" className="bg-white">Inactive</Badge>
                                                    </div>
                                                )}
                                                <div className="flex items-start justify-between mb-3">
                                                    <Badge className={cn(
                                                        policy.type === 'GOVERNMENT_BOOK' ? 'bg-blue-100 text-blue-700' :
                                                            policy.type === 'NGO' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-slate-100 text-slate-700'
                                                    )}>
                                                        {policy.type.split('_').join(' ')}
                                                    </Badge>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                        Added {new Date(policy.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-slate-900 mb-1">#{policy.policyNumber}</h4>
                                                {policy.issuedToName && (
                                                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                                                        <User className="h-3 w-3" /> {policy.issuedToName}
                                                    </p>
                                                )}
                                                {policy.providerName && (
                                                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                                                        <Activity className="h-3 w-3" /> {policy.providerName}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                                    <p className="text-[10px] text-slate-400 font-medium">
                                                        {policy.issueYear} — {policy.expiryYear}
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => {
                                                                setEditingPolicy(policy);
                                                                setIsPolicyModalOpen(true);
                                                            }}
                                                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Edit Policy"
                                                        >
                                                            <Edit3 className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleTogglePolicyStatus(policy)}
                                                            className={cn(
                                                                "p-1.5 rounded-lg transition-colors",
                                                                policy.isActive
                                                                    ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                                    : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                                            )}
                                                            title={policy.isActive ? "Deactivate Policy" : "Activate Policy"}
                                                        >
                                                            <Power className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {patient && (
                <NewVisitModal
                    isOpen={isNewVisitModalOpen}
                    onClose={() => setIsNewVisitModalOpen(false)}
                    onSuccess={fetchPatientDetails}
                    token={token || ''}
                    patient={patient}
                />
            )}

            {patient && selectedVisit && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => {
                        setIsPaymentModalOpen(false);
                        setSelectedVisitId(null);
                    }}
                    onSuccess={() => {
                        fetchPatientDetails();
                        setIsPaymentModalOpen(false);
                        setSelectedVisitId(null);
                    }}
                    token={token || ''}
                    patient={patient}
                    visit={selectedVisit!}
                    policies={policies}
                    setActiveTab={setActiveTab}
                    setIsPolicyModalOpen={setIsPolicyModalOpen}
                />
            )}

            {patient && (
                <PolicyModal
                    isOpen={isPolicyModalOpen}
                    onClose={() => setIsPolicyModalOpen(false)}
                    onSuccess={() => {
                        fetchPatientPolicies();
                        setIsPolicyModalOpen(false);
                    }}
                    token={token || ''}
                    patient={patient}
                    editingPolicy={editingPolicy}
                    onResetEditing={() => setEditingPolicy(null)}
                />
            )}
        </DashboardLayout>
    );
}

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    token: string;
    patient: Patient;
    editingPolicy: InsurancePolicy | null;
    onResetEditing: () => void;
}

function PolicyModal({ isOpen, onClose, onSuccess, token, patient, editingPolicy, onResetEditing }: PolicyModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        type: 'GOVERNMENT_BOOK' as 'SELF' | 'GOVERNMENT_BOOK' | 'NGO' | 'OTHER',
        policyNumber: '',
        issuedToName: `${patient.firstName} ${patient.lastName}`,
        issueYear: new Date().getFullYear().toString(),
        expiryYear: (new Date().getFullYear() + 1).toString(),
        providerName: '',
        notes: ''
    });

    useEffect(() => {
        if (editingPolicy) {
            setFormData({
                type: editingPolicy.type,
                policyNumber: editingPolicy.policyNumber,
                issuedToName: editingPolicy.issuedToName || '',
                issueYear: (editingPolicy.issueYear || '').toString(),
                expiryYear: (editingPolicy.expiryYear || '').toString(),
                providerName: editingPolicy.providerName || '',
                notes: editingPolicy.notes || ''
            });
        } else {
            setFormData({
                type: 'GOVERNMENT_BOOK',
                policyNumber: '',
                issuedToName: `${patient.firstName} ${patient.lastName}`,
                issueYear: new Date().getFullYear().toString(),
                expiryYear: (new Date().getFullYear() + 1).toString(),
                providerName: '',
                notes: ''
            });
        }
    }, [editingPolicy, patient]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = editingPolicy
                ? `http://localhost:3000/insurance-policies/${editingPolicy.id}`
                : 'http://localhost:3000/insurance-policies';
            const method = editingPolicy ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    patientId: patient.id,
                    issueYear: parseInt(formData.issueYear),
                    expiryYear: parseInt(formData.expiryYear)
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `Failed to ${editingPolicy ? 'update' : 'add'} policy`);
            }

            onSuccess();
            onResetEditing();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onResetEditing();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={editingPolicy ? "Edit Insurance Policy" : "Add Insurance Policy"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" /> {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Policy Type</label>
                        <select
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            required
                        >
                            <option value="GOVERNMENT_BOOK">Government Book (CBHI)</option>
                            <option value="NGO">NGO Sponsorship</option>
                            <option value="OTHER">Private Insurance / Other</option>
                        </select>
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Policy/Book No.</label>
                        <input
                            type="text"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                            placeholder="e.g. CBHI-123456"
                            value={formData.policyNumber}
                            onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Issued To Name</label>
                    <input
                        type="text"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={formData.issuedToName}
                        onChange={(e) => setFormData({ ...formData, issuedToName: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Provider/Sponsor Name</label>
                    <input
                        type="text"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. Ministry of Health, Red Cross"
                        value={formData.providerName}
                        onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Issue Year</label>
                        <input
                            type="number"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                            value={formData.issueYear}
                            onChange={(e) => setFormData({ ...formData, issueYear: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Expiry Year</label>
                        <input
                            type="number"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                            value={formData.expiryYear}
                            onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                    <Button variant="outline" onClick={handleClose} type="button">Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? (editingPolicy ? 'Updating...' : 'Adding...') : (editingPolicy ? 'Update Policy' : 'Add Policy')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    token: string;
    patient: Patient;
    visit: Visit;
    policies?: InsurancePolicy[];
    setActiveTab: (tab: 'medical' | 'billing' | 'insurance') => void;
    setIsPolicyModalOpen: (open: boolean) => void;
}

function PaymentModal({ isOpen, onClose, onSuccess, token, patient, visit, policies = [], setActiveTab, setIsPolicyModalOpen }: PaymentModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAddingTransaction, setIsAddingTransaction] = useState(false);
    const [printMode, setPrintMode] = useState<'ledger' | 'receipt'>('ledger');
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [hasCoverage, setHasCoverage] = useState(visit.coverage?.type !== 'SELF');
    const [selectedPolicyId, setSelectedPolicyId] = useState<string>(visit.coverage?.insurancePolicyId || '');

    const totalBilled = visit.payments?.reduce((acc, p) => acc + Number(p.amountCharged), 0) || 0;
    const totalPaid = visit.payments?.reduce((acc, p) => acc + Number(p.amountPaid), 0) || 0;
    const balance = totalBilled - totalPaid;

    const [formData, setFormData] = useState({
        amountCharged: '0',
        amountPaid: '0',
        method: 'CASH' as 'CASH' | 'WAIVED' | 'PARTIAL' | 'OTHER',
        serviceType: 'CONSULTATION' as 'REGISTRATION' | 'CONSULTATION' | 'LABORATORY' | 'PHARMACY' | 'PROCEDURE' | 'RADIOLOGY' | 'OTHER',
        reason: '',
    });

    useEffect(() => {
        if (hasCoverage && policies.length > 0 && !selectedPolicyId) {
            // Auto-select first active policy if none selected
            const activePolicy = policies.find(p => p.isActive);
            if (activePolicy) setSelectedPolicyId(activePolicy.id);
        }
    }, [hasCoverage, policies, selectedPolicyId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const body: any = {
                visitId: visit.id,
                amountCharged: parseFloat(formData.amountCharged),
                amountPaid: parseFloat(formData.amountPaid),
                method: formData.method,
                serviceType: formData.serviceType,
                reason: formData.reason,
            };

            if (hasCoverage && selectedPolicyId) {
                const policy = policies.find(p => p.id === selectedPolicyId);
                if (policy) {
                    body.insurancePolicyId = selectedPolicyId;
                    body.coverage = {
                        type: policy.type,
                        referenceNumber: policy.policyNumber,
                        issuedToName: policy.issuedToName,
                        issueYear: policy.issueYear,
                        expiryYear: policy.expiryYear,
                        insurancePolicyId: policy.id
                    };
                    if (!body.reason) body.reason = `Covered by ${policy.type.split('_').join(' ')} (#${policy.policyNumber})`;
                }
            } else if (hasCoverage && !selectedPolicyId) {
                setError('Please select an insurance policy or uncheck coverage.');
                setLoading(false);
                return;
            }


            const response = await fetch('http://localhost:3000/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to process payment');
            }

            onSuccess();
            setIsAddingTransaction(false);
            setFormData({ ...formData, amountCharged: '0', amountPaid: '0', reason: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintLedger = () => {
        setPrintMode('ledger');
        // Give React a moment to update DOM before print dialog
        setTimeout(() => window.print(), 50);
    };

    const handlePrintReceipt = (paymentId?: string) => {
        const p = paymentId
            ? visit.payments?.find(pay => pay.id === paymentId)
            : visit.payments?.[visit.payments.length - 1];

        if (!p) return;

        setSelectedPayment(p as any);
        setPrintMode('receipt');
        setTimeout(() => window.print(), 50);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Visit Billing Ledger" size="xl">
            {/* Print-only Ledger Template */}
            <div id="ledger-print-area" className={cn(
                "hidden p-10 space-y-8 text-slate-900 border-[10px] border-slate-100",
                printMode === 'ledger' ? 'print:block' : 'print:hidden'
            )}>
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">MediFlow Medical Center</h1>
                        <p className="text-sm font-bold text-slate-600">Patient Billing & Visit Ledger</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold">Ledger ID: {visit.id.toUpperCase()}</p>
                        <p className="text-sm">Date Generated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 py-6">
                    <div>
                        <h2 className="text-xs font-bold text-slate-500 uppercase mb-2">Patient Information</h2>
                        <p className="text-lg font-bold">{patient.firstName} {patient.lastName}</p>
                        <p className="text-sm text-slate-600">Phone: {patient.phone}</p>
                        <p className="text-sm text-slate-600">Gender: {patient.gender}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xs font-bold text-slate-500 uppercase mb-2">Visit Details</h2>
                        <p className="text-lg font-bold">{visit.department.name}</p>
                        <p className="text-sm text-slate-600">Admission: {new Date(visit.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-slate-600">Status: {visit.status}</p>
                    </div>
                </div>

                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-900">
                            <th className="py-3 text-left font-bold uppercase text-xs">Date</th>
                            <th className="py-3 text-left font-bold uppercase text-xs">Description</th>
                            <th className="py-3 text-right font-bold uppercase text-xs">Billed (ETB)</th>
                            <th className="py-3 text-right font-bold uppercase text-xs">Paid (ETB)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {visit.payments?.map(p => (
                            <tr key={p.id}>
                                <td className="py-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 font-medium">{p.serviceType.split('_').join(' ')} - {p.reason || 'Service Charge'}</td>
                                <td className="py-3 text-right font-bold">{Number(p.amountCharged).toFixed(2)}</td>
                                <td className="py-3 text-right font-bold text-emerald-700">{Number(p.amountPaid).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-slate-900">
                            <td colSpan={2} className="py-4 text-right font-bold uppercase text-xs">Cumulative Totals:</td>
                            <td className="py-4 text-right font-bold text-lg">{totalBilled.toFixed(2)}</td>
                            <td className="py-4 text-right font-bold text-lg text-emerald-700">{totalPaid.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan={3} className="py-4 text-right font-black uppercase text-sm">Outstanding Balance:</td>
                            <td className="py-4 text-right font-black text-xl border-double border-b-4 border-slate-900">
                                {balance.toFixed(2)} ETB
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <div className="pt-20 text-center text-[10px] text-slate-400">
                    <p>This is a computer-generated document. No signature required.</p>
                    <p className="mt-2 font-bold text-slate-600">Thank you for choosing MediFlow Medical Center.</p>
                </div>
            </div>

            {/* Print-only Receipt Template */}
            <div id="receipt-print-area" className={cn(
                "hidden p-8 space-y-6 text-slate-900 border-2 border-dashed border-slate-300 max-w-sm mx-auto",
                printMode === 'receipt' ? 'print:block' : 'print:hidden'
            )}>
                <div className="text-center space-y-1">
                    <h1 className="text-xl font-black uppercase">MediFlow</h1>
                    <p className="text-xs font-bold text-slate-500 uppercase">Official Payment Receipt</p>
                </div>

                <div className="border-y border-slate-200 py-3 text-xs space-y-1">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Receipt No:</span>
                        <span className="font-bold">{selectedPayment?.id.slice(0, 8).toUpperCase() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Date:</span>
                        <span>{selectedPayment ? new Date(selectedPayment.createdAt).toLocaleString() : ''}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Patient</p>
                        <p className="text-sm font-bold">{patient.firstName} {patient.lastName}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Service</p>
                        <p className="text-sm font-bold">{selectedPayment?.serviceType.split('_').join(' ')}</p>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-xs">
                        <span>Amount Charged:</span>
                        <span>{Number(selectedPayment?.amountCharged || 0).toFixed(2)} ETB</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-200">
                        <span>Amount Paid:</span>
                        <span className="text-indigo-600">{Number(selectedPayment?.amountPaid || 0).toFixed(2)} ETB</span>
                    </div>
                </div>

                <div className="text-center pt-6 space-y-2">
                    <div className="inline-block px-4 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-full uppercase">
                        {selectedPayment?.method} Payment
                    </div>
                    <p className="text-[10px] text-slate-400 italic">Thank you for your visit!</p>
                </div>
            </div>

            <div className="space-y-6 print:hidden">
                {/* Ledger Header Summary */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Billed</p>
                        <p className="text-xl font-bold text-slate-900">{totalBilled.toFixed(2)} <span className="text-xs font-normal text-slate-500">ETB</span></p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Total Paid</p>
                        <p className="text-xl font-bold text-emerald-600">{totalPaid.toFixed(2)} <span className="text-xs font-normal text-emerald-500">ETB</span></p>
                    </div>
                    <div className={`${balance > 0 ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4`}>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Balance Due</p>
                        <p className={`text-xl font-bold ${balance > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{balance.toFixed(2)} <span className="text-xs font-normal text-slate-500">ETB</span></p>
                    </div>
                </div>

                {/* Transaction History Table */}
                {!isAddingTransaction && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Transaction History</h3>
                            <Button size="sm" onClick={() => setIsAddingTransaction(true)}>
                                <UserPlus className="h-3.5 w-3.5 mr-1" />
                                Add Transaction
                            </Button>
                        </div>
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Service Category</th>
                                        <th className="px-4 py-3 text-right">Billed</th>
                                        <th className="px-4 py-3 text-right">Paid</th>
                                        <th className="px-4 py-3">Cashier</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {visit.payments && visit.payments.length > 0 ? (
                                        visit.payments.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3 text-slate-500 text-xs">
                                                    {new Date(p.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" size="sm" className="bg-slate-100 text-slate-600 border-none font-bold text-[10px]">
                                                        {p.serviceType.split('_').join(' ')}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-900">{Number(p.amountCharged).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right font-medium text-emerald-600">{Number(p.amountPaid).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-slate-500 text-[10px]">
                                                    {p.verifiedBy ? `${p.verifiedBy.firstName} ${p.verifiedBy.lastName}` : 'System'}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => handlePrintReceipt(p.id)}
                                                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors mx-auto block"
                                                        title="Print Receipt"
                                                    >
                                                        <Printer className="h-3.5 w-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">No transactions recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Add Transaction Form */}
                {isAddingTransaction && (
                    <div className="bg-slate-50 border border-indigo-100 rounded-xl p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-800 flex items-center">
                                <Activity className="h-4 w-4 mr-2 text-indigo-500" />
                                Record New Charge or Payment
                            </h4>
                            <Button variant="ghost" size="sm" onClick={() => setIsAddingTransaction(false)}>Cancel</Button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-xs flex items-center">
                                <AlertCircle className="h-3.5 w-3.5 mr-2" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Service Category</label>
                                    <select
                                        className="w-full rounded-lg border-slate-200 text-sm p-2 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border outline-none font-medium"
                                        value={formData.serviceType}
                                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
                                    >
                                        <option value="REGISTRATION">Registration (Check-in)</option>
                                        <option value="CONSULTATION">Consultation</option>
                                        <option value="LABORATORY">Laboratory</option>
                                        <option value="PHARMACY">Pharmacy (Medicine)</option>
                                        <option value="PROCEDURE">Procedure</option>
                                        <option value="RADIOLOGY">Radiology</option>
                                        <option value="OTHER">Other Service</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Payment Method</label>
                                    <select
                                        className="w-full rounded-lg border-slate-200 text-sm p-2 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border outline-none font-medium"
                                        value={formData.method}
                                        onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                                    >
                                        <option value="CASH">Cash</option>
                                        <option value="WAIVED">Waived (Free)</option>
                                        <option value="PARTIAL">Partial</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Amount Billed (ETB)</label>
                                    <input
                                        type="number" step="0.01" required
                                        className="w-full rounded-lg border-slate-200 text-sm p-2 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border outline-none font-bold"
                                        value={formData.amountCharged}
                                        onChange={(e) => setFormData({ ...formData, amountCharged: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Amount Collected (ETB)</label>
                                    <input
                                        type="number" step="0.01" required
                                        className="w-full rounded-lg border-slate-200 text-sm p-2 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border outline-none font-bold text-emerald-600"
                                        value={formData.amountPaid}
                                        onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                                    />
                                    {/* Coverage Options */}
                                    <div className="pt-4 border-t border-slate-200">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                checked={hasCoverage}
                                                onChange={(e) => setHasCoverage(e.target.checked)}
                                            />
                                            <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Apply Insurance / Coverage</span>
                                        </label>

                                        {hasCoverage && (
                                            <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-indigo-600 uppercase tracking-tight">Select Policy</label>
                                                    {policies.length > 0 ? (
                                                        <select
                                                            className="w-full p-2.5 bg-white border border-indigo-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 font-medium"
                                                            value={selectedPolicyId}
                                                            onChange={(e) => setSelectedPolicyId(e.target.value)}
                                                            required={hasCoverage}
                                                        >
                                                            <option value="">-- Choose a Policy --</option>
                                                            {policies.map(p => (
                                                                <option key={p.id} value={p.id} disabled={!p.isActive}>
                                                                    {p.type.split('_').join(' ')} - #{p.policyNumber} {p.isActive ? '' : '(Inactive)'}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <div className="p-3 bg-white border border-dashed border-indigo-200 rounded-lg text-center">
                                                            <p className="text-xs text-slate-500 mb-2">No active policies found for this patient.</p>
                                                            <button
                                                                type="button"
                                                                className="text-xs font-bold text-indigo-600 hover:underline"
                                                                onClick={() => {
                                                                    onClose();
                                                                    setActiveTab('insurance');
                                                                    setIsPolicyModalOpen(true);
                                                                }}
                                                            >
                                                                + Create a Policy First
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {selectedPolicyId && (
                                                    <div className="grid grid-cols-2 gap-3 p-3 bg-white/60 rounded-lg border border-indigo-50 text-[10px]">
                                                        <div>
                                                            <span className="text-slate-400 uppercase font-bold block">Issuer</span>
                                                            <span className="text-slate-700">
                                                                {policies.find(p => p.id === selectedPolicyId)?.providerName || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400 uppercase font-bold block">Expires</span>
                                                            <span className="text-slate-700">
                                                                {policies.find(p => p.id === selectedPolicyId)?.expiryYear || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Notes / Remarks</label>
                                <textarea
                                    rows={2}
                                    placeholder="Explanation for this charge/payment..."
                                    className="w-full rounded-lg border-slate-200 text-sm p-2 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border outline-none"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full py-6 text-base shadow-lg shadow-indigo-100">
                                {loading ? 'Processing...' : (
                                    <span className="flex items-center">
                                        <ShieldCheck className="mr-2 h-5 w-5" />
                                        Post Transaction to Ledger
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handlePrintLedger}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print Full Ledger
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handlePrintReceipt()}>
                            <Receipt className="h-4 w-4 mr-2" />
                            Print Receipt
                        </Button>
                    </div>
                    <Button variant="primary" onClick={onClose}>Close Ledger</Button>
                </div>
            </div>
        </Modal>
    );
}

// New Visit Modal Component
function NewVisitModal({ isOpen, onClose, onSuccess, token, patient }: {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    token: string;
    patient: { id: string; firstName: string; lastName: string };
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        departmentId: '',
        reason: ''
    });

    useEffect(() => {
        if (isOpen && token) {
            fetchDepartments();
        }
    }, [isOpen, token]);

    const fetchDepartments = async () => {
        try {
            const response = await fetch('http://localhost:3000/departments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDepartments(data);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.departmentId) {
            setError('Please select a department');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    patientId: patient.id,
                    departmentId: formData.departmentId,
                    reason: formData.reason || 'General consultation'
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create visit');
            }

            onSuccess();
            onClose();
            // Reset form
            setFormData({ departmentId: '', reason: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Visit">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Patient Info */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-indigo-900 mb-1">Patient</p>
                    <p className="text-indigo-700">{patient.firstName} {patient.lastName}</p>
                </div>

                {/* Department Selection */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Department <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full rounded-lg border-slate-200 text-sm p-3 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                        required
                    >
                        <option value="">Select department...</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reason */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Reason for Visit
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Brief description of the visit reason..."
                        className="w-full rounded-lg border-slate-200 text-sm p-3 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Visit'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
