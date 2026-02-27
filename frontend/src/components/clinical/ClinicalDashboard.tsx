'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { VitalsChart } from './VitalsChart';
import {
    Activity,
    Stethoscope,
    History,
    ChevronRight,
    Save,
    CheckCircle2,
    ArrowRightCircle,
    X,
    ClipboardList,
    TrendingUp,
    Beaker,
    Plus,
    Trash2,
    Pill,
    Heart, Thermometer, Wind, Droplets, Scale, Microscope, AlertCircle, ExternalLink, RefreshCw
} from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api.config';
import { pharmacyService, Medication, PharmacyOrder } from '@/services/pharmacyService';
import { Combobox } from '@/components/ui/Combobox';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface ClinicalDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    visitId: string;
    onSuccess: () => void;
}

export function ClinicalDashboard({ isOpen, onClose, visitId, onSuccess }: ClinicalDashboardProps) {
    const { token, user } = useAuthStore();
    const [visit, setVisit] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [vitalsData, setVitalsData] = useState({
        temperature: 0,
        heartRate: 0,
        bpSystolic: 0,
        bpDiastolic: 0,
        weight: 0,
        height: 0
    });
    const [consultationData, setConsultationData] = useState({
        notes: '',
        prescription: ''
    });
    const [viewingVisitId, setViewingVisitId] = useState(visitId);

    // Lab state
    const [labOrders, setLabOrders] = useState<any[]>([]);
    const [newLabTest, setNewLabTest] = useState('');
    const [labInstructions, setLabInstructions] = useState('');
    const [catalogTests, setCatalogTests] = useState<{ id: string; name: string; price: number; code?: string }[]>([]);

    // Pharmacy state
    const [medications, setMedications] = useState<Medication[]>([]);
    const [pharmacyOrders, setPharmacyOrders] = useState<PharmacyOrder[]>([]);
    const [selectedMedicationId, setSelectedMedicationId] = useState('');
    const [prescriptionQuantity, setPrescriptionQuantity] = useState(1);
    const [prescriptionInstructions, setPrescriptionInstructions] = useState('');

    const isHistorical = viewingVisitId !== visitId;

    useEffect(() => {
        if (isOpen && viewingVisitId) {
            fetchVisitDetails();
            fetchLabOrders();
            fetchPharmacyOrders();
            fetchMedications();
            fetchCatalogTests();
        }
    }, [isOpen, viewingVisitId]);

    const fetchCatalogTests = async () => {
        try {
            const res = await fetch(`${API_ENDPOINTS.BILLING.SERVICE_CATALOG}?category=LABORATORY`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCatalogTests(data.filter((s: any) => s.isActive));
            }
        } catch (err) {
            console.error('Failed to load lab test catalog:', err);
        }
    };

    const fetchVisitDetails = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.VISITS.BY_ID(viewingVisitId), {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setVisit(data);
                if (data.vitals) {
                    setVitalsData({
                        temperature: data.vitals.temperature || 0,
                        heartRate: data.vitals.pulse || 0,
                        bpSystolic: data.vitals.bpSystolic || 0,
                        bpDiastolic: data.vitals.bpDiastolic || 0,
                        weight: data.vitals.weight || 0,
                        height: data.vitals.height || 0
                    });
                }
                if (data.consultation) {
                    setConsultationData({
                        notes: data.consultation.notes || '',
                        prescription: data.consultation.prescription || ''
                    });
                }
                fetchHistory(data.patientId);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (patientId: string) => {
        try {
            const res = await fetch(API_ENDPOINTS.VISITS.PATIENT(patientId), {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setHistory(await res.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchLabOrders = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.LAB.BY_VISIT(viewingVisitId), {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setLabOrders(await res.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPharmacyOrders = async () => {
        if (!token) return;
        try {
            const res = await pharmacyService.getOrdersByVisit(token, viewingVisitId);
            setPharmacyOrders(res);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMedications = async () => {
        if (!token) return;
        try {
            const res = await pharmacyService.getMedications(token);
            setMedications(res);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddLabOrder = async () => {
        if (!newLabTest.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(API_ENDPOINTS.LAB.BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    visitId: viewingVisitId,
                    testName: newLabTest,
                    instructions: labInstructions
                })
            });
            if (res.ok) {
                toast.success('Lab order added');
                setNewLabTest('');
                setLabInstructions('');
                fetchLabOrders();
            }
        } catch (err) {
            toast.error('Failed to add lab order');
        } finally {
            setSaving(false);
        }
    };

    const handleAddPharmacyOrder = async () => {
        if (!token || !selectedMedicationId || prescriptionQuantity <= 0) return;
        setSaving(true);
        try {
            await pharmacyService.createOrder(token, {
                visitId: viewingVisitId,
                medicationId: selectedMedicationId,
                quantity: prescriptionQuantity,
                instructions: prescriptionInstructions
            });
            toast.success('Medication prescribed');
            setSelectedMedicationId('');
            setPrescriptionQuantity(1);
            setPrescriptionInstructions('');
            fetchPharmacyOrders();
        } catch (err: any) {
            toast.error(err.message || 'Failed to prescribe medication');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteLabOrder = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this lab order?')) return;
        try {
            const res = await fetch(API_ENDPOINTS.LAB.BY_ID(id), {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Lab order cancelled');
                fetchLabOrders();
            }
        } catch (err) {
            toast.error('Failed to cancel lab order');
        }
    };

    const handleSaveVitals = async (autoMove: boolean = false) => {
        setSaving(true);
        try {
            const res = await fetch(API_ENDPOINTS.VISITS.TRIAGE(visitId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(vitalsData)
            });
            if (res.ok) {
                toast.success('Vitals captured successfully');
                if (!autoMove) fetchVisitDetails();
                onSuccess();
            }
        } catch (err) {
            toast.error('Failed to save vitals');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveConsultation = async (finalize: boolean = false) => {
        setSaving(true);
        try {
            const res = await fetch(API_ENDPOINTS.VISITS.CONSULTATION(visitId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(consultationData)
            });
            if (res.ok) {
                toast.success(finalize ? 'Visit completed' : 'Consultation saved');
                if (finalize) {
                    onClose();
                } else {
                    fetchVisitDetails();
                }
                onSuccess();
            }
        } catch (err) {
            toast.error('Failed to save consultation');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-900">
                                {loading ? 'Loading Visit...' : `${visit?.patient.firstName} ${visit?.patient.lastName}`}
                            </h2>
                            {visit && (
                                <Badge variant={visit.status === 'COMPLETED' ? 'success' : 'warning'}>
                                    {visit.status.replace('_', ' ')}
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <ClipboardList className="h-4 w-4" />
                            Reason: <span className="text-slate-700 font-medium">{visit?.reason || 'General Checkup'}</span>
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-10 w-10 p-0 text-slate-400 hover:text-slate-600">
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                {isHistorical && (
                    <div className="bg-amber-50 border-b border-amber-100 px-6 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-700">
                            <History className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Viewing Historical Record</span>
                        </div>
                        <button
                            onClick={() => setViewingVisitId(visitId)}
                            className="text-xs font-bold text-amber-800 hover:underline"
                        >
                            Back to current
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
                            <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
                        </div>
                    ) : (
                        <>
                            {/* Patient Snapshot */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
                                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Patient ID</p>
                                    <p className="text-sm font-semibold text-slate-900 mt-1">{visit?.patient.id.slice(0, 8)}</p>
                                </div>
                                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Visit Time</p>
                                    <p className="text-sm font-semibold text-slate-900 mt-1">{format(new Date(visit?.createdAt), 'MMM dd, HH:mm')}</p>
                                </div>
                                <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
                                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Department</p>
                                    <p className="text-sm font-semibold text-slate-900 mt-1">{visit?.department.name}</p>
                                </div>
                            </div>

                            {/* Section: Vitals */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                                        <Activity className="h-5 w-5 text-indigo-600" />
                                        <h3>Clinical Vitals (Triage)</h3>
                                    </div>
                                    {!isHistorical && (
                                        <Button size="sm" onClick={() => handleSaveVitals(false)} disabled={saving}>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Vitals
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-xs">Temp (°C)</Label>
                                        <Input
                                            type="number" step="0.1"
                                            value={vitalsData.temperature}
                                            onChange={e => setVitalsData({ ...vitalsData, temperature: parseFloat(e.target.value) })}
                                            className="mt-1"
                                            disabled={isHistorical}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">BP (Systolic)</Label>
                                        <Input
                                            type="number"
                                            value={vitalsData.bpSystolic}
                                            onChange={e => setVitalsData({ ...vitalsData, bpSystolic: parseInt(e.target.value) })}
                                            className="mt-1"
                                            disabled={isHistorical}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">BP (Diastolic)</Label>
                                        <Input
                                            type="number"
                                            value={vitalsData.bpDiastolic}
                                            onChange={e => setVitalsData({ ...vitalsData, bpDiastolic: parseInt(e.target.value) })}
                                            className="mt-1"
                                            disabled={isHistorical}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Pulse (bpm)</Label>
                                        <Input
                                            type="number"
                                            value={vitalsData.heartRate}
                                            onChange={e => setVitalsData({ ...vitalsData, heartRate: parseInt(e.target.value) })}
                                            className="mt-1"
                                            disabled={isHistorical}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Weight (kg)</Label>
                                        <Input
                                            type="number"
                                            value={vitalsData.weight}
                                            onChange={e => setVitalsData({ ...vitalsData, weight: parseFloat(e.target.value) })}
                                            className="mt-1"
                                            disabled={isHistorical}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Height (cm)</Label>
                                        <Input
                                            type="number"
                                            value={vitalsData.height}
                                            onChange={e => setVitalsData({ ...vitalsData, height: parseFloat(e.target.value) })}
                                            className="mt-1"
                                            disabled={isHistorical}
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
                                    <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <TrendingUp className="h-4 w-4" />
                                        Vitals History Trend
                                    </div>
                                    <VitalsChart data={history} />
                                </div>
                            </div>

                            {/* Section: Consultation */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                                        <Stethoscope className="h-5 w-5 text-indigo-600" />
                                        <h3>Physician Consultation</h3>
                                    </div>
                                    {!isHistorical && (
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleSaveConsultation(false)} disabled={saving}>
                                                <Save className="h-4 w-4 mr-2" />
                                                Draft
                                            </Button>
                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleSaveConsultation(true)} disabled={saving}>
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Finalize Visit
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label>Clinical Notes</Label>
                                        <textarea
                                            className="w-full mt-2 rounded-xl border-slate-200 text-sm p-4 h-32 focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                                            placeholder="Differential diagnosis, history of illness, etc."
                                            value={consultationData.notes}
                                            onChange={e => setConsultationData({ ...consultationData, notes: e.target.value })}
                                            disabled={isHistorical}
                                        />
                                    </div>
                                    <div>
                                        <Label>Prescription & Treatment Plan</Label>
                                        <textarea
                                            className="w-full mt-2 rounded-xl border-slate-200 text-sm p-4 h-24 focus:ring-indigo-500 focus:border-indigo-500 transition-all border font-mono text-indigo-600"
                                            placeholder="Rx: Amoxicillin 500mg tid..."
                                            value={consultationData.prescription}
                                            onChange={e => setConsultationData({ ...consultationData, prescription: e.target.value })}
                                            disabled={isHistorical}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Laboratory */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                                        <Beaker className="h-5 w-5 text-indigo-600" />
                                        <h3>Laboratory Prescriptions</h3>
                                    </div>
                                </div>

                                {!isHistorical && visit?.status !== 'COMPLETED' && (
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-[10px] uppercase font-bold text-slate-500">Select Lab Test</Label>
                                                {catalogTests.length > 0 ? (
                                                    <>
                                                        <Combobox
                                                            items={catalogTests.map(t => ({ value: t.name, label: `${t.name}${t.code ? ` (${t.code})` : ''}` }))}
                                                            value={newLabTest}
                                                            onChange={setNewLabTest}
                                                            placeholder="Search catalog tests..."
                                                        />
                                                        {newLabTest && (() => {
                                                            const selected = catalogTests.find(t => t.name === newLabTest);
                                                            return selected ? (
                                                                <p className="text-[10px] font-bold text-emerald-600 mt-1">✓ Price: {Number(selected.price).toLocaleString()} ETB</p>
                                                            ) : (
                                                                <p className="text-[10px] text-amber-600 font-bold mt-1">⚠ Test not in catalog — charge will be 0</p>
                                                            );
                                                        })()}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Input
                                                            placeholder="e.g. CBC, Lipid Profile"
                                                            value={newLabTest}
                                                            onChange={e => setNewLabTest(e.target.value)}
                                                            className="bg-white mt-1 h-9 text-sm"
                                                        />
                                                        <p className="text-[10px] text-amber-600 font-bold mt-1">⚠ No lab tests in price list. Go to Settings → Price List to add.</p>
                                                    </>
                                                )}
                                            </div>
                                            <div>
                                                <Label className="text-[10px] uppercase font-bold text-slate-500">Special Instructions</Label>
                                                <Input
                                                    placeholder="e.g. Fasting required"
                                                    value={labInstructions}
                                                    onChange={e => setLabInstructions(e.target.value)}
                                                    className="bg-white mt-1 h-9 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 h-9"
                                            onClick={handleAddLabOrder}
                                            disabled={saving || !newLabTest}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Order Lab Test
                                        </Button>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {labOrders.length === 0 ? (
                                        <p className="text-center py-4 text-sm text-slate-400 italic">No lab tests ordered for this visit.</p>
                                    ) : (
                                        labOrders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg group hover:border-indigo-100 transition-all shadow-sm">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-sm text-slate-900">{order.testName}</span>
                                                        <Badge variant={order.status === 'COMPLETED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'info'} className="text-[10px] py-0 px-1.5">
                                                            {order.status}
                                                        </Badge>
                                                    </div>
                                                    {order.instructions && (
                                                        <p className="text-xs text-slate-500 mt-1">{order.instructions}</p>
                                                    )}
                                                    {order.result && (
                                                        <div className="mt-2 p-2 bg-emerald-50 rounded border border-emerald-100">
                                                            <p className="text-[10px] font-bold text-emerald-600 uppercase">Results</p>
                                                            <p className="text-xs text-slate-700 mt-0.5 whitespace-pre-wrap">{order.result}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {!isHistorical && order.status === 'ORDERED' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all h-8 w-8 p-0"
                                                        onClick={() => handleDeleteLabOrder(order.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Section: Pharmacy */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                                        <Pill className="h-5 w-5 text-indigo-600" />
                                        <h3>Pharmacy Prescriptions</h3>
                                    </div>
                                </div>

                                {!isHistorical && visit?.status !== 'COMPLETED' && (
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-[10px] uppercase font-bold text-slate-500">Select Medication</Label>
                                                <div className="mt-1">
                                                    <Combobox
                                                        items={medications.map(m => ({ value: m.id, label: `${m.name} (${m.strength})` }))}
                                                        value={selectedMedicationId}
                                                        onChange={setSelectedMedicationId}
                                                        placeholder="Search medications..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-[10px] uppercase font-bold text-slate-500">Quantity</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={prescriptionQuantity}
                                                        onChange={e => setPrescriptionQuantity(parseInt(e.target.value))}
                                                        className="bg-white mt-1 h-9 text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-[10px] uppercase font-bold text-slate-500">Instructions</Label>
                                                    <Input
                                                        placeholder="e.g. 1 tab thrice daily"
                                                        value={prescriptionInstructions}
                                                        onChange={e => setPrescriptionInstructions(e.target.value)}
                                                        className="bg-white mt-1 h-9 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 h-9"
                                            onClick={handleAddPharmacyOrder}
                                            disabled={saving || !selectedMedicationId}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Prescribe Medication
                                        </Button>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {pharmacyOrders.length === 0 ? (
                                        <p className="text-center py-4 text-sm text-slate-400 italic">No medications prescribed for this visit.</p>
                                    ) : (
                                        pharmacyOrders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg group hover:border-indigo-100 transition-all shadow-sm">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-sm text-slate-900">{order.medication.name}</span>
                                                        <Badge variant={order.status === 'DISPENSED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'} className="text-[10px] py-0 px-1.5">
                                                            {order.status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                                        {order.medication.strength} • Qty: {order.quantity}
                                                    </p>
                                                    {order.instructions && (
                                                        <p className="text-xs text-slate-500 italic mt-1 font-medium">"{order.instructions}"</p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    {order.status === 'DISPENSED' && (
                                                        <p className="text-[10px] text-emerald-600 font-bold uppercase">Dispensed</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Section: Visit History */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-slate-900 font-bold">
                                    <History className="h-5 w-5 text-slate-400" />
                                    <h3>Recent Visit History</h3>
                                </div>
                                <div className="space-y-2">
                                    {history.slice(0, 5).map((prev, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${viewingVisitId === prev.id
                                                ? 'border-indigo-200 bg-indigo-50/50 ring-1 ring-indigo-100'
                                                : 'border-slate-100 hover:bg-slate-50'
                                                }`}
                                            onClick={() => setViewingVisitId(prev.id)}
                                        >
                                            <div>
                                                <p className={`text-sm font-semibold ${viewingVisitId === prev.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                    {format(new Date(prev.createdAt), 'MMM dd, yyyy')}
                                                </p>
                                                <p className="text-xs text-slate-500">{prev.reason || 'General Checkup'}</p>
                                            </div>
                                            <Badge variant={prev.status === 'COMPLETED' ? 'success' : 'default'}>{prev.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
