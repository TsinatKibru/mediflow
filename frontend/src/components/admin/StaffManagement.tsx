'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { departmentService } from '@/services/departmentService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, UserPlus, Mail, Shield, Building2, MoreVertical, ShieldCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = [
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'NURSE', label: 'Nurse' },
    { value: 'RECEPTIONIST', label: 'Receptionist' },
    { value: 'PHARMACIST', label: 'Pharmacist' },
    { value: 'LAB_TECHNICIAN', label: 'Lab Technician' },
    { value: 'ACCOUNTANT', label: 'Accountant' },
    { value: 'HOSPITAL_ADMIN', label: 'Hospital Admin' },
];

export function StaffManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: 'Password123!', // Default password
        role: 'DOCTOR',
        departmentId: '',
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch staff list');
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const data = await departmentService.getDepartments();
            setDepartments(data.data || data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                departmentId: formData.departmentId === '' ? null : formData.departmentId
            };
            await userService.createUser(payload);
            toast.success('Staff member added successfully');
            setIsModalOpen(false);
            fetchUsers();
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                password: 'Password123!',
                role: 'DOCTOR',
                departmentId: '',
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeactivate = async (id: string) => {
        if (!confirm('Are you sure you want to deactivate this user?')) return;
        try {
            await userService.removeUser(id);
            toast.success('User deactivated');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to deactivate user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'HOSPITAL_ADMIN': return 'danger';
            case 'DOCTOR': return 'info';
            case 'NURSE': return 'info';
            case 'PHARMACIST': return 'warning';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Staff Member
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Staff Member</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Department</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><Skeleton className="h-10 w-40" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-6 w-24" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-8 w-8 ml-auto" /></td>
                                </tr>
                            ))
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                    No staff members found.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                                <span className="text-sm font-bold text-slate-600">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={getRoleBadge(user.role)}>
                                            {user.role.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {user.department?.name || '--'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isActive ? (
                                            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
                                                <ShieldCheck className="h-3 w-3 mr-1" /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center text-xs font-bold text-slate-400">
                                                <UserX className="h-3 w-3 mr-1" /> Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {user.isActive && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-400 hover:text-rose-600"
                                                    onClick={() => handleDeactivate(user.id)}
                                                >
                                                    Deactivate
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Staff Member">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                type="email"
                                className="pl-10"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Role</Label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <select
                                className="w-full pl-10 rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                required
                            >
                                {ROLES.map(role => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Department (Optional)</Label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <select
                                className="w-full pl-10 rounded-lg border-slate-200 text-sm p-2 bg-slate-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                                value={formData.departmentId}
                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                            >
                                <option value="">No Department Assigned</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500">
                            <strong>Note:</strong> A temporary password <code>Password123!</code> will be set for the new user. They should be advised to change it upon first login.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Staff User'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
