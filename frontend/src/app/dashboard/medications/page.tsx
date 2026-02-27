'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { pharmacyService, Medication } from '@/services/pharmacyService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Package, Plus, Search, RefreshCw, Pill, AlertTriangle, Edit2, Save, X } from 'lucide-react';
import { CurrencyDisplay } from '@/components/common/CurrencyDisplay';
import toast from 'react-hot-toast';

export default function MedicationsPage() {
    const { token } = useAuthStore();
    const [medications, setMedications] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMedication, setEditingMedication] = useState<Partial<Medication> | null>(null);

    const fetchMedications = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await pharmacyService.getMedications(token, searchQuery);
            setMedications(data);
        } catch (error) {
            console.error('Error fetching medications:', error);
            toast.error('Failed to load medications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchMedications();
        }, 300);
        return () => clearTimeout(timer);
    }, [token, searchQuery]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !editingMedication) return;

        try {
            if (editingMedication.id) {
                await pharmacyService.updateMedication(token, editingMedication.id, editingMedication);
                toast.success('Medication updated');
            } else {
                await pharmacyService.createMedication(token, editingMedication);
                toast.success('Medication added');
            }
            setIsModalOpen(false);
            setEditingMedication(null);
            fetchMedications();
        } catch (error) {
            toast.error('Failed to save medication');
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Package className="h-6 w-6 text-indigo-600" />
                            Medication Inventory
                        </h2>
                        <p className="text-sm text-slate-500">Manage drug stock, pricing, and generic names.</p>
                    </div>
                    <Button onClick={() => {
                        setEditingMedication({
                            name: '',
                            genericName: '',
                            dosageForm: 'TABLET',
                            strength: '',
                            stockBalance: 0,
                            unitPrice: 0
                        });
                        setIsModalOpen(true);
                    }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medication
                    </Button>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by name or generic name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10"
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={fetchMedications}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : medications.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                        <Package className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">No medications found</h3>
                        <p className="text-slate-500 mt-1">Try a different search term or add a new medication.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {medications.map((med) => (
                            <Card key={med.id} className="group hover:border-indigo-200 transition-all border-slate-100">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                            <Pill className="h-7 w-7" />
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={med.stockBalance <= 10 ? 'danger' : med.stockBalance <= 50 ? 'warning' : 'success'}>
                                                {med.stockBalance} in stock
                                            </Badge>
                                            <p className="text-xs font-bold text-slate-900 mt-1.5">
                                                <CurrencyDisplay amount={med.unitPrice || 0} /> / unit
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 truncate" title={med.name}>{med.name}</h3>
                                        <p className="text-xs text-slate-500 font-medium">{med.genericName || 'No generic name'}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-[10px] uppercase">{med.dosageForm}</Badge>
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50/50">{med.strength}</Badge>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
                                        <div className="flex items-center text-[10px] text-slate-400 gap-1">
                                            {med.stockBalance <= 10 && (
                                                <span className="flex items-center gap-1 text-red-500 font-bold">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    Low Stock
                                                </span>
                                            )}
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100" onClick={() => {
                                            setEditingMedication(med);
                                            setIsModalOpen(true);
                                        }}>
                                            <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                                            Update Inventory
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={editingMedication?.id ? 'Update Medication' : 'Add New Medication'}
                >
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label>Drug Name (Brand)</Label>
                                <Input
                                    required
                                    value={editingMedication?.name || ''}
                                    onChange={e => setEditingMedication({ ...editingMedication, name: e.target.value })}
                                    placeholder="e.g. Panadol"
                                />
                            </div>
                            <div className="col-span-2">
                                <Label>Generic Name</Label>
                                <Input
                                    value={editingMedication?.genericName || ''}
                                    onChange={e => setEditingMedication({ ...editingMedication, genericName: e.target.value })}
                                    placeholder="e.g. Paracetamol"
                                />
                            </div>
                            <div>
                                <Label>Dosage Form</Label>
                                <select
                                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    value={editingMedication?.dosageForm || 'TABLET'}
                                    onChange={e => setEditingMedication({ ...editingMedication, dosageForm: e.target.value })}
                                >
                                    <option value="TABLET">Tablet</option>
                                    <option value="SYRUP">Syrup</option>
                                    <option value="INJECTION">Injection</option>
                                    <option value="CAPSULE">Capsule</option>
                                    <option value="CREAM">Cream/Ointment</option>
                                    <option value="DROPS">Drops</option>
                                </select>
                            </div>
                            <div>
                                <Label>Strength</Label>
                                <Input
                                    required
                                    value={editingMedication?.strength || ''}
                                    onChange={e => setEditingMedication({ ...editingMedication, strength: e.target.value })}
                                    placeholder="e.g. 500mg"
                                />
                            </div>
                            <div>
                                <Label>Stock Level</Label>
                                <Input
                                    required
                                    type="number"
                                    value={editingMedication?.stockBalance || 0}
                                    onChange={e => setEditingMedication({ ...editingMedication, stockBalance: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <Label>Unit Price ({useAuthStore.getState().tenant?.currency || 'ETB'})</Label>
                                <Input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={editingMedication?.unitPrice || 0}
                                    onChange={e => setEditingMedication({ ...editingMedication, unitPrice: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="flex h-12 gap-3 pt-4 border-t border-slate-100 flex-row items-center justify-end">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit">
                                <Save className="h-4 w-4 mr-2" />
                                {editingMedication?.id ? 'Update Medication' : 'Add Medication'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </DashboardLayout>
    );
}
