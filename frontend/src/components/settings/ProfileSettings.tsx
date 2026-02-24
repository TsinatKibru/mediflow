'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useBrandColor } from '@/hooks/useBrandColor';
import { User, Lock, Save } from 'lucide-react';

export function ProfileSettings() {
    const { user, token, setUser } = useAuthStore();
    const { brandColor, brandAlpha } = useBrandColor();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        password: '',
        confirmPassword: ''
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
            };
            if (formData.password) {
                body.password = formData.password;
            }

            const res = await fetch('http://localhost:3000/auth/profile', {
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
