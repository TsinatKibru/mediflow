'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
    Users as UsersIcon,
    UserPlus,
    Search,
    RefreshCw,
    User,
    Calendar,
    Phone,
    Mail
} from 'lucide-react';
import { useBrandColor } from '@/hooks/useBrandColor';
import { Pagination } from '@/components/ui/Pagination';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string;
    email: string;
    createdAt: string;
}

export default function PatientsPage() {
    const router = useRouter();
    const { token, tenant } = useAuthStore();
    const { brandColor, brandAlpha } = useBrandColor();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [total, setTotal] = useState(0);
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(20);
    const [loading, setLoading] = useState(true);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [genderFilter, setGenderFilter] = useState<string>('ALL');
    const [ageFilter, setAgeFilter] = useState<string>('ALL');

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                skip: skip.toString(),
                take: take.toString(),
            });
            if (searchQuery) params.append('search', searchQuery);

            const response = await fetch(`http://localhost:3000/patients?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch patients');
            const result = await response.json();
            setPatients(result.data);
            setTotal(result.total);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchPatients();
    }, [token, skip, take]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (token) {
                setSkip(0);
                fetchPatients();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

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

    const filteredPatients = patients.filter(patient => {
        // Gender Filter
        if (genderFilter !== 'ALL' && patient.gender !== genderFilter) return false;

        // Age Filter
        if (ageFilter !== 'ALL') {
            const age = calculateAge(patient.dateOfBirth);
            if (ageFilter === 'CHILD' && age >= 18) return false;
            if (ageFilter === 'ADULT' && (age < 18 || age > 60)) return false;
            if (ageFilter === 'SENIOR' && age <= 60) return false;
        }

        return true;
    });


    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
                        <p className="text-slate-500 text-sm">Manage patient records at {tenant?.name}.</p>
                    </div>
                    <div className="flex space-x-3">
                        <Button variant="outline" size="sm" onClick={fetchPatients}>
                            <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                            Refresh
                        </Button>
                        <Button size="sm" onClick={() => setIsRegisterModalOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Register Patient
                        </Button>
                    </div>
                </div>

                {/* Search and Filters Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="bg-white p-2 rounded-lg border shadow-sm flex items-center px-4 flex-1">
                        <Search className="h-5 w-5 text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="flex-1 border-none focus:ring-0 text-sm p-2 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-slate-600">Gender:</label>
                        <select
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm outline-none"
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                        >
                            <option value="ALL">All Genders</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-slate-600">Age:</label>
                        <select
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 shadow-sm outline-none"
                            value={ageFilter}
                            onChange={(e) => setAgeFilter(e.target.value)}
                        >
                            <option value="ALL">All Ages</option>
                            <option value="CHILD">Child (0-17)</option>
                            <option value="ADULT">Adult (18-60)</option>
                            <option value="SENIOR">Senior (60+)</option>
                        </select>
                    </div>
                    {(searchQuery || genderFilter !== 'ALL' || ageFilter !== 'ALL') && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearchQuery('');
                                setGenderFilter('ALL');
                                setAgeFilter('ALL');
                            }}
                            className="text-xs h-10"
                        >
                            Clear
                        </Button>
                    )}
                </div>

                {/* Patients Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Age/Gender</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Registered</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <RefreshCw className={cn("h-8 w-8 animate-spin mb-2", loading && "animate-spin")} style={{ color: brandColor }} />
                                            <p>Loading patients...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <UsersIcon className="h-12 w-12 text-slate-200 mb-2" />
                                            <p className="text-slate-900 font-medium">{searchQuery ? 'No patients match your search' : 'No patients registered yet'}</p>
                                            <p className="text-xs">{searchQuery ? 'Try adjusting your search terms' : 'Click "Register Patient" to add your first patient.'}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div
                                                    className="h-10 w-10 rounded-full flex items-center justify-center mr-3 border"
                                                    style={{ backgroundColor: brandAlpha(0.12), borderColor: brandAlpha(0.3) }}
                                                >
                                                    <User className="h-5 w-5" style={{ color: brandColor }} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {patient.firstName} {patient.lastName}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{patient.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-600">{calculateAge(patient.dateOfBirth)} years</p>
                                            <p className="text-xs text-slate-500 capitalize">{patient.gender.toLowerCase()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-xs text-slate-500 mb-1">
                                                <Phone className="h-3.5 w-3.5 mr-1" />
                                                {patient.phone}
                                            </div>
                                            <div className="flex items-center text-xs text-slate-500">
                                                <Mail className="h-3.5 w-3.5 mr-1" />
                                                {patient.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-xs text-slate-500">
                                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                                {new Date(patient.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/patients/${patient.id}`)}>
                                                View Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    total={total}
                    skip={skip}
                    take={take}
                    onPageChange={setSkip}
                    onPageSizeChange={(newTake) => {
                        setTake(newTake);
                        setSkip(0);
                    }}
                />
            </div>

            {/* Register Patient Modal */}
            <RegisterPatientModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                onSuccess={fetchPatients}
            />
        </DashboardLayout>
    );
}

function RegisterPatientModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
    const { token } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'MALE',
        phone: '',
        email: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:3000/patients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to register patient');
            }
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: 'MALE',
                phone: '',
                email: ''
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Register New Patient">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                        <input
                            type="text" required
                            className="w-full rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                            value={formData.firstName}
                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                        <input
                            type="text" required
                            className="w-full rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                            value={formData.lastName}
                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date of Birth</label>
                        <input
                            type="date" required
                            className="w-full rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                            value={formData.dateOfBirth}
                            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
                        <select
                            required
                            className="w-full rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                            value={formData.gender}
                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                    <input
                        type="tel" required
                        placeholder="e.g., 555-0123"
                        className="w-full rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                    <input
                        type="email" required
                        placeholder="patient@example.com"
                        className="w-full rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register Patient'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
