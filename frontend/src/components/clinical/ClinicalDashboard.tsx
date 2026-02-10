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
    TrendingUp
} from 'lucide-react';
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

    useEffect(() => {
        if (isOpen && visitId) {
            fetchVisitDetails();
        }
    }, [isOpen, visitId]);

    const fetchVisitDetails = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/visits/${visitId}`, {
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
            const res = await fetch(`http://localhost:3000/visits/patient/${patientId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setHistory(await res.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveVitals = async (autoMove: boolean = false) => {
        setSaving(true);
        try {
            const res = await fetch(`http://localhost:3000/visits/${visitId}/triage`, {
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
            const res = await fetch(`http://localhost:3000/visits/${visitId}/consultation`, {
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
                                    <Button size="sm" onClick={() => handleSaveVitals(false)} disabled={saving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Vitals
                                    </Button>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-xs">Temp (°C)</Label>
                                        <Input
                                            type="number" step="0.1"
                                            value={vitalsData.temperature}
                                            onChange={e => setVitalsData({ ...vitalsData, temperature: parseFloat(e.target.value) })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">BP (Systolic)</Label>
                                        <Input
                                            type="number"
                                            value={vitalsData.bpSystolic}
                                            onChange={e => setVitalsData({ ...vitalsData, bpSystolic: parseInt(e.target.value) })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">BP (Diastolic)</Label>
                                        <Input
                                            type="number"
                                            value={vitalsData.bpDiastolic}
                                            onChange={e => setVitalsData({ ...vitalsData, bpDiastolic: parseInt(e.target.value) })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Pulse (bpm)</Label>
                                        <Input
                                            type="number"
                                            value={vitalsData.heartRate}
                                            onChange={e => setVitalsData({ ...vitalsData, heartRate: parseInt(e.target.value) })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Weight (kg)</Label>
                                        <Input
                                            type="number"
                                            value={vitalsData.weight}
                                            onChange={e => setVitalsData({ ...vitalsData, weight: parseFloat(e.target.value) })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Height (cm)</Label>
                                        <Input
                                            type="number"
                                            value={vitalsData.height}
                                            onChange={e => setVitalsData({ ...vitalsData, height: parseFloat(e.target.value) })}
                                            className="mt-1"
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
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label>Clinical Notes</Label>
                                        <textarea
                                            className="w-full mt-2 rounded-xl border-slate-200 text-sm p-4 h-32 focus:ring-indigo-500 focus:border-indigo-500 transition-all border"
                                            placeholder="Differential diagnosis, history of illness, etc."
                                            value={consultationData.notes}
                                            onChange={e => setConsultationData({ ...consultationData, notes: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label>Prescription & Treatment Plan</Label>
                                        <textarea
                                            className="w-full mt-2 rounded-xl border-slate-200 text-sm p-4 h-24 focus:ring-indigo-500 focus:border-indigo-500 transition-all border font-mono text-indigo-600"
                                            placeholder="Rx: Amoxicillin 500mg tid..."
                                            value={consultationData.prescription}
                                            onChange={e => setConsultationData({ ...consultationData, prescription: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Visit History */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-slate-900 font-bold">
                                    <History className="h-5 w-5 text-slate-400" />
                                    <h3>Recent Visit History</h3>
                                </div>
                                <div className="space-y-2">
                                    {history.slice(0, 3).map((prev, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-default">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">{format(new Date(prev.createdAt), 'MMM dd, yyyy')}</p>
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
