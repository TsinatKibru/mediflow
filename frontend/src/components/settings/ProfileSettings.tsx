'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useBrandColor } from '@/hooks/useBrandColor';
import { User, Mail, Shield, Building2, Save, BadgeCheck, Phone, Check, AlertCircle, Lock } from 'lucide-react';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api.config';

export function ProfileSettings() {
    const { user, token, setUser } = useAuthStore();
    const { brandColor, brandAlpha } = useBrandColor();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        departmentId: user?.departmentId || '',
        password: '',
        confirmPassword: ''
    });

    useState(() => {
        const fetchDepartments = async () => {
            try {
                const res = await fetch(API_ENDPOINTS.DEPARTMENTS.BASE, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setDepartments(await res.json());
                }
            } catch (err) {
                console.error('Error fetching departments:', err);
            }
        };
        if (token) fetchDepartments();
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password && formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        try {
            const body: any = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                departmentId: formData.departmentId || null,
            };
            if (formData.password) {
                body.password = formData.password;
            }

            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update profile');
            }

            const updatedUser = await res.json();
            setUser(updatedUser);
            setMessage('Profile updated successfully!');
            setFormData({ ...formData, password: '', confirmPassword: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: brandAlpha(0.1), color: brandColor }}
                >
                    <User className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Personal Profile</h3>
                    <p className="text-sm text-slate-500">Update your name and password</p>
                </div>
            </div>

            {message && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-lg border border-emerald-100">{message}</div>}
            {error && <div className="mb-6 p-4 bg-rose-50 text-rose-700 text-sm font-bold rounded-lg border border-rose-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-2 gap-6">
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

                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="space-y-1">
                        <Label className="flex items-center gap-2 text-slate-900 font-bold">
                            <Building2 className="h-4 w-4 text-indigo-500" />
                            Primary Workstation / Department
                        </Label>
                        <p className="text-xs text-slate-500 pb-1">Set your default department view for patient queues.</p>
                    </div>
                    <select
                        className="w-full rounded-xl border-slate-200 text-sm p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all border outline-none font-medium text-slate-700"
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    >
                        <option value="">No Default Assignment (Global View)</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                            <span className="font-bold text-indigo-600 uppercase mr-1">Note:</span>
                            For <span className="font-semibold text-slate-800">Hospital Admins</span>, this is a preference. You can still switch between all departments.
                            For <span className="font-semibold text-slate-800">Doctors</span> and <span className="font-semibold text-slate-800">Nurses</span>, this defines your primary filtered queue.
                        </p>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                        <Lock className="h-4 w-4 text-slate-400" />
                        Change Password
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">Leave blank if you don't want to change your password.</p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Min 8 characters"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Saving updates...' : 'Save Profile Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
