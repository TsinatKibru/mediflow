'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useBrandColor } from '@/hooks/useBrandColor';
import { Building2, Save, Link as LinkIcon, Palette } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';

export function ClinicSettings() {
    const { tenant, token, setTenant } = useAuthStore();
    const { brandColor, brandAlpha } = useBrandColor();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: tenant?.name || '',
        primaryColor: tenant?.primaryColor || '#3b82f6',
    });

    useEffect(() => {
        if (tenant) {
            setFormData({
                name: tenant.name,
                primaryColor: tenant.primaryColor || '#3b82f6'
            });
        }
    }, [tenant]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const updatedTenant = await apiClient.patch(API_ENDPOINTS.TENANTS.CURRENT, formData);
            setTenant(updatedTenant);
            setMessage('Clinic settings updated successfully!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!tenant) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: brandAlpha(0.1), color: brandColor }}
                >
                    <Building2 className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Clinic Configuration</h3>
                    <p className="text-sm text-slate-500">Manage hospital branding and core details</p>
                </div>
            </div>

            {message && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-lg border border-emerald-100">{message}</div>}
            {error && <div className="mb-6 p-4 bg-rose-50 text-rose-700 text-sm font-bold rounded-lg border border-rose-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        Hospital / Clinic Name
                    </Label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <p className="text-xs text-slate-500 mt-1.5">This name will appear on receipts, prescriptions, and standard reports.</p>
                </div>

                <div className="space-y-2 pt-4">
                    <Label className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-slate-400" />
                        Primary Brand Color
                    </Label>
                    <div className="flex items-center gap-4">
                        <input
                            type="color"
                            className="h-10 w-20 cursor-pointer rounded-lg border-2 border-slate-200"
                            value={formData.primaryColor}
                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        />
                        <Input
                            value={formData.primaryColor}
                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                            className="w-32 uppercase mono text-sm"
                            placeholder="#HEXCODE"
                        />
                    </div>
                </div>

                <div className="space-y-2 pt-4 opacity-50">
                    <Label className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-slate-400" />
                        Subdomain
                    </Label>
                    <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-slate-200">
                        <div className="bg-slate-100 px-3 py-2 text-sm text-slate-500 border-r border-slate-200 font-medium">
                            https://
                        </div>
                        <Input
                            value={tenant.subdomain}
                            disabled
                            className="border-none rounded-none w-full bg-slate-50 text-slate-600 font-medium"
                        />
                        <div className="bg-slate-100 px-3 py-2 text-sm text-slate-500 border-l border-slate-200 font-medium">
                            .mediflow.net
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">Subdomain changes require contacting support to ensure DNS propagation.</p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-4 py-2 text-sm font-bold text-white rounded-lg transition-opacity disabled:opacity-60 hover:opacity-90"
                        style={{ backgroundColor: brandColor }}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Saving updates...' : 'Save Clinic Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}
