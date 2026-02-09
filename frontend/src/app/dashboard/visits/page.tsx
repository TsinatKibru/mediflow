'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
    ClipboardList,
    Stethoscope,
    UserPlus,
    Search,
    RefreshCw,
    Clock,
    User as UserIcon,
    Activity,
    Filter,
    X
} from 'lucide-react';

interface Visit {
    id: string;
    status: 'REGISTERED' | 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED';
    reason: string;
    createdAt: string;
    patient: {
        firstName: string;
        lastName: string;
    };
    department: {
        name: string;
    };
    vitals?: any;
}

export default function VisitsPage() {
    const { token, tenant } = useAuthStore();
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
    const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
    const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [departmentFilter, setDepartmentFilter] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);

    const fetchVisits = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/visits', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch visits');
            const data = await response.json();
            setVisits(data);
        } catch (error) {
            console.error('Error fetching visits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchVisits();
    }, [token]);

    const getStatusVariant = (status: string) => {
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

    // Get unique departments
    const departments = Array.from(new Set(visits.map(v => v.department.name)));

    // Filter visits based on search query, status, and department
    const filteredVisits = visits.filter(visit => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const patientName = `${visit.patient.firstName} ${visit.patient.lastName}`.toLowerCase();
            const department = visit.department.name.toLowerCase();
            const status = visit.status.toLowerCase();
            const reason = (visit.reason || '').toLowerCase();
            const matchesSearch = patientName.includes(query) || department.includes(query) || status.includes(query) || reason.includes(query);
            if (!matchesSearch) return false;
        }

        // Status filter
        if (statusFilter !== 'all' && visit.status !== statusFilter) {
            return false;
        }

        // Department filter
        if (departmentFilter !== 'all' && visit.department.name !== departmentFilter) {
            return false;
        }

        return true;
    });

    const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + (departmentFilter !== 'all' ? 1 : 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Patient Visits</h1>
                        <p className="text-slate-500 text-sm">Monitor and manage active patient flow at {tenant?.name}.</p>
                    </div>
                    <div className="flex space-x-3">
                        <Button size="sm" onClick={() => setIsCheckInModalOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Check-in Patient
                        </Button>
                        <Button variant="outline" size="sm" onClick={fetchVisits}>
                            <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3 bg-white p-2 rounded-lg border shadow-sm flex items-center px-4">
                        <Search className="h-5 w-5 text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search patients, departments or status..."
                            className="flex-1 border-none focus:ring-0 text-sm p-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 px-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-3 shadow-md shadow-indigo-200">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Active</p>
                                <p className="text-lg font-bold text-slate-900 leading-none">{visits.filter(v => ['REGISTERED', 'WAITING', 'IN_CONSULTATION'].includes(v.status)).length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-lg border shadow-sm p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                            >
                                <Filter className="h-4 w-4" />
                                <span>Filters</span>
                                {activeFiltersCount > 0 && (
                                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={() => {
                                        setStatusFilter('all');
                                        setDepartmentFilter('all');
                                    }}
                                    className="text-xs text-slate-500 hover:text-slate-700 underline"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                        <div className="text-sm text-slate-500">
                            Showing {filteredVisits.length} of {visits.length} visits
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="REGISTERED">Registered</option>
                                    <option value="WAITING">Waiting</option>
                                    <option value="IN_CONSULTATION">In Consultation</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="NO_SHOW">No Show</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Department</label>
                                <select
                                    value={departmentFilter}
                                    onChange={(e) => setDepartmentFilter(e.target.value)}
                                    className="w-full rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                                >
                                    <option value="all">All Departments</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Visits Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <RefreshCw className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
                                            <p>Loading visits history...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredVisits.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <ClipboardList className="h-12 w-12 text-slate-200 mb-2" />
                                            <p className="text-slate-900 font-medium">{searchQuery || activeFiltersCount > 0 ? 'No visits match your filters' : 'No active visits found'}</p>
                                            <p className="text-xs">{searchQuery || activeFiltersCount > 0 ? 'Try adjusting your search or filters' : 'Any patient check-ins will appear here.'}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredVisits.map((visit) => (
                                    <tr key={visit.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mr-3 border border-slate-200">
                                                    <UserIcon className="h-5 w-5 text-slate-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {visit.patient.firstName} {visit.patient.lastName}
                                                    </p>
                                                    <p className="text-xs text-slate-500 font-medium">{visit.reason || 'No reason specified'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600 font-medium">{visit.department.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-xs text-slate-500">
                                                <Clock className="h-3.5 w-3.5 mr-1" />
                                                {new Date(visit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getStatusVariant(visit.status)}>
                                                {formatStatus(visit.status)}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {visit.status === 'REGISTERED' && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="h-8 py-0 px-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white border-indigo-100 shadow-none"
                                                        onClick={() => {
                                                            setSelectedVisitId(visit.id);
                                                            setIsTriageModalOpen(true);
                                                        }}
                                                    >
                                                        <Activity className="h-3.5 w-3.5 mr-1.5" />
                                                        Triage
                                                    </Button>
                                                )}
                                                {visit.status === 'WAITING' && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="h-8 py-0 px-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border-emerald-100 shadow-none"
                                                        onClick={() => {
                                                            setSelectedVisitId(visit.id);
                                                            setIsConsultModalOpen(true);
                                                        }}
                                                    >
                                                        <Stethoscope className="h-3.5 w-3.5 mr-1.5" />
                                                        Consult
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <Search className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Triage Modal */}
            <TriageModal
                isOpen={isTriageModalOpen}
                onClose={() => setIsTriageModalOpen(false)}
                visitId={selectedVisitId}
                onSuccess={fetchVisits}
            />

            {/* Consultation Modal */}
            <ConsultationModal
                isOpen={isConsultModalOpen}
                onClose={() => setIsConsultModalOpen(false)}
                visitId={selectedVisitId}
                onSuccess={fetchVisits}
            />

            {/* Check-in Modal */}
            <CheckInModal
                isOpen={isCheckInModalOpen}
                onClose={() => setIsCheckInModalOpen(false)}
                onSuccess={fetchVisits}
                token={token || ''}
            />
        </DashboardLayout>
    );
}

// Sub-components

function TriageModal({ isOpen, onClose, visitId, onSuccess }: { isOpen: boolean, onClose: () => void, visitId: string | null, onSuccess: () => void }) {
    const { token } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        temperature: 37,
        heartRate: 70,
        bpSystolic: 120,
        bpDiastolic: 80,
        weight: 70,
        height: 170
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/visits/${visitId}/triage`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error submitting triage:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Capture Patient Vitals (Triage)">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Temp (°C)</label>
                        <input
                            type="number" step="0.1" required
                            className="w-full rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                            value={formData.temperature}
                            onChange={e => setFormData({ ...formData, temperature: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Heart Rate (bpm)</label>
                        <input
                            type="number" required
                            className="w-full rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                            value={formData.heartRate}
                            onChange={e => setFormData({ ...formData, heartRate: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">BP (Systolic)</label>
                        <input
                            type="number" required
                            className="w-full rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                            value={formData.bpSystolic}
                            onChange={e => setFormData({ ...formData, bpSystolic: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">BP (Diastolic)</label>
                        <input
                            type="number" required
                            className="w-full rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                            value={formData.bpDiastolic}
                            onChange={e => setFormData({ ...formData, bpDiastolic: Number(e.target.value) })}
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Complete Triage'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

function ConsultationModal({ isOpen, onClose, visitId, onSuccess }: { isOpen: boolean, onClose: () => void, visitId: string | null, onSuccess: () => void }) {
    const { token } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        notes: '',
        prescription: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/visits/${visitId}/consultation`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error submitting consultation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Physician Consultation">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Clinical Notes</label>
                    <textarea
                        required rows={4}
                        placeholder="Enter diagnosis and observation notes..."
                        className="w-full rounded-lg border-slate-200 text-sm p-3 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prescription</label>
                    <textarea
                        rows={2}
                        placeholder="List medications and dosages..."
                        className="w-full rounded-lg border-slate-200 text-sm p-3 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                        value={formData.prescription}
                        onChange={e => setFormData({ ...formData, prescription: e.target.value })}
                    />
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Complete Consultation'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

// Check-in Modal Component
function CheckInModal({ isOpen, onClose, onSuccess, token }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; token: string }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [patients, setPatients] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        departmentId: '',
        reason: ''
    });

    useEffect(() => {
        if (isOpen && token) {
            fetchDepartments();
        }
    }, [isOpen, token]);

    useEffect(() => {
        if (searchQuery.length >= 2) {
            searchPatients();
        } else {
            setPatients([]);
            setShowPatientDropdown(false);
        }
    }, [searchQuery]);

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

    const searchPatients = async () => {
        try {
            const response = await fetch('http://localhost:3000/patients', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const filtered = data.filter((p: any) => {
                    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
                    return fullName.includes(searchQuery.toLowerCase()) ||
                        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.phone.includes(searchQuery);
                });
                setPatients(filtered);
                setShowPatientDropdown(true);
            }
        } catch (error) {
            console.error('Error searching patients:', error);
        }
    };

    const selectPatient = (patient: any) => {
        setFormData({
            ...formData,
            patientId: patient.id,
            patientName: `${patient.firstName} ${patient.lastName}`
        });
        setSearchQuery(`${patient.firstName} ${patient.lastName}`);
        setShowPatientDropdown(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.patientId || !formData.departmentId) {
            setError('Please select a patient and department');
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
                    patientId: formData.patientId,
                    departmentId: formData.departmentId,
                    reason: formData.reason || 'General consultation'
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to check in patient');
            }

            onSuccess();
            onClose();
            // Reset form
            setFormData({ patientId: '', patientName: '', departmentId: '', reason: '' });
            setSearchQuery('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Check-in Patient">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Patient Search */}
                <div className="relative">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Patient <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="w-full pl-10 rounded-lg border-slate-200 text-sm p-3 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowPatientDropdown(true)}
                        />
                    </div>

                    {/* Patient Dropdown */}
                    {showPatientDropdown && patients.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {patients.map((patient) => (
                                <button
                                    key={patient.id}
                                    type="button"
                                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0"
                                    onClick={() => selectPatient(patient)}
                                >
                                    <div className="font-medium text-slate-900">
                                        {patient.firstName} {patient.lastName}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {patient.email} • {patient.phone}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {formData.patientId && (
                        <div className="mt-2 text-sm text-emerald-600 flex items-center">
                            <Activity className="h-4 w-4 mr-1" />
                            Selected: {formData.patientName}
                        </div>
                    )}
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
                        {loading ? 'Checking in...' : 'Check-in Patient'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
