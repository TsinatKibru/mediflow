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
import {
    Patient,
    Payment,
    InsurancePolicy,
    Coverage,
    Visit
} from '@/types/billing';
import { PolicyModal } from '@/components/billing/PolicyModal';
import { PaymentModal } from '@/components/billing/PaymentModal';


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
