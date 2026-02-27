'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DollarSign, Save, Globe } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api.config';
import toast from 'react-hot-toast';

export function FinancialSettings() {
    const { tenant, token, setTenant } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currency: tenant?.currency || 'ETB',
        currencySymbol: tenant?.currencySymbol || 'ETB',
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(API_ENDPOINTS.TENANTS.CURRENT, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const updatedTenant = await res.json();
                setTenant(updatedTenant);
                toast.success('Financial settings updated');
            } else {
                toast.error('Failed to update settings');
            }
        } catch (error) {
            toast.error('Connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-8 border-none shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <DollarSign className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Financial Configuration</h3>
                    <p className="text-sm text-slate-500 font-medium">Standardize currency and price displays across your clinic.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="max-w-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            Global Currency Code
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. ETB, USD, EUR"
                            className="w-full rounded-xl border-slate-200 text-sm p-3 bg-slate-50 border focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                            maxLength={3}
                        />
                        <p className="text-[10px] text-slate-400 font-medium italic">3-letter ISO code used for reporting.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <DollarSign className="h-3 w-3" />
                            Display Symbol
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. ETB, $, €"
                            className="w-full rounded-xl border-slate-200 text-sm p-3 bg-slate-50 border focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                            value={formData.currencySymbol}
                            onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                            maxLength={5}
                        />
                        <p className="text-[10px] text-slate-400 font-medium italic">Symbol displayed next to prices (e.g. $ 100.00).</p>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all font-bold px-8"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
