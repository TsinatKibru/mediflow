'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Tag,
    Layers,
    Sliders,
    Info,
    RefreshCw,
    X,
    Save,
    Activity,
    DollarSign,
    Filter
} from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api.config';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { Modal } from '@/components/ui/Modal';
import { CurrencyDisplay } from '@/components/common/CurrencyDisplay';
import toast from 'react-hot-toast';

interface ServiceItem {
    id: string;
    category: string;
    name: string;
    code?: string;
    description?: string;
    price: number;
    isActive: boolean;
}

export function ServiceCatalogSettings() {
    const { token, tenant } = useAuthStore();
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<ServiceItem> | null>(null);

    const categories = ['REGISTRATION', 'CONSULTATION', 'LABORATORY', 'PHARMACY', 'PROCEDURE', 'RADIOLOGY', 'OTHER'];

    useEffect(() => {
        fetchServices();
    }, [categoryFilter]);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const url = `${API_ENDPOINTS.BILLING.SERVICE_CATALOG}${categoryFilter !== 'ALL' ? `?category=${categoryFilter}` : ''}`;
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
            toast.error('Failed to load price list');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem?.name || !editingItem?.price || !editingItem?.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const url = editingItem.id
                ? API_ENDPOINTS.BILLING.SERVICE_CATALOG + '/' + editingItem.id
                : API_ENDPOINTS.BILLING.SERVICE_CATALOG;
            const method = editingItem.id ? 'PATCH' : 'POST';

            // Strictly sanitize the body to match backend DTO and avoid "forbidNonWhitelisted" errors
            const sanitizedItem = {
                category: editingItem.category,
                name: editingItem.name,
                code: editingItem.code,
                description: editingItem.description,
                price: editingItem.price,
                isActive: editingItem.isActive
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sanitizedItem)
            });

            if (res.ok) {
                toast.success(editingItem.id ? 'Service updated' : 'Service added');
                fetchServices();
                setIsEditing(false);
                setEditingItem(null);
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to save service');
            }
        } catch (error) {
            console.error('Error saving service:', error);
            toast.error('Connection error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const res = await fetch(`${API_ENDPOINTS.BILLING.SERVICE_CATALOG}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success('Service deleted');
                fetchServices();
            }
        } catch (error) {
            toast.error('Failed to delete service');
        }
    };

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search services by name or code..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all bg-white border outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <select
                        className="rounded-xl border-slate-200 text-sm p-2 bg-white border outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-600"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="ALL">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Button
                        onClick={() => {
                            setEditingItem({ category: 'LABORATORY', isActive: true });
                            setIsEditing(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Service
                    </Button>
                </div>
            </div>

            {/* Editing Modal */}
            <Modal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                title={editingItem?.id ? 'Edit Service' : 'Add New Service'}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Category</label>
                            <select
                                className="w-full h-10 rounded-xl border-slate-200 text-sm px-3 bg-white border"
                                value={editingItem?.category}
                                onChange={(e) => setEditingItem({ ...editingItem!, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Standard Price ({tenant?.currency || 'ETB'})</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 font-bold text-xs flex items-center justify-center">
                                    {tenant?.currencySymbol || 'ETB'}
                                </span>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full h-10 pl-10 pr-4 rounded-xl border-slate-200 text-sm bg-white border"
                                    placeholder="0.00"
                                    value={editingItem?.price || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem!, price: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Name</label>
                        <input
                            type="text"
                            className="w-full h-10 rounded-xl border-slate-200 text-sm px-3 bg-white border"
                            placeholder="e.g. CBC / Full Blood Count"
                            value={editingItem?.name || ''}
                            onChange={(e) => setEditingItem({ ...editingItem!, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Item Code / SKU</label>
                        <input
                            type="text"
                            className="w-full h-10 rounded-xl border-slate-200 text-sm px-3 bg-white border"
                            placeholder="e.g. LAB-001"
                            value={editingItem?.code || ''}
                            onChange={(e) => setEditingItem({ ...editingItem!, code: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description</label>
                        <textarea
                            className="w-full rounded-xl border-slate-200 text-sm p-3 bg-white border"
                            placeholder="Optional details about this service..."
                            rows={3}
                            value={editingItem?.description || ''}
                            onChange={(e) => setEditingItem({ ...editingItem!, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button type="submit" className="bg-slate-900 text-white shadow-lg">
                            <Save className="h-4 w-4 mr-2" />
                            Save Service
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Loading Price List...</div>
                ) : filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                        <Card key={service.id} className="p-5 hover:shadow-md transition-all border-none shadow-sm group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                <Activity className="h-16 w-16" />
                            </div>

                            <div className="flex flex-col h-full justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="text-[9px] font-black border-slate-200 text-slate-500 uppercase">
                                            {service.category}
                                        </Badge>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingItem(service);
                                                    setIsEditing(true);
                                                }}
                                                className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 line-clamp-1">{service.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{service.code || 'NO CODE'}</p>
                                    </div>
                                    {service.description && (
                                        <p className="text-xs text-slate-500 line-clamp-2 italic italic">{service.description}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-1">
                                        <span className="text-lg font-black text-indigo-600">
                                            <CurrencyDisplay amount={service.price} />
                                        </span>
                                    </div>
                                    <Badge className={service.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}>
                                        {service.isActive ? 'Active' : 'Disabled'}
                                    </Badge>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <Tag className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest">No services found</p>
                        <Button variant="ghost" className="text-indigo-600 mt-2 hover:bg-indigo-50" onClick={() => { setSearchTerm(''); setCategoryFilter('ALL'); }}>Clear Filters</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
