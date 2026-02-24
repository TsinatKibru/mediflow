'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useBrandColor } from '@/hooks/useBrandColor';
import {
    X, Stethoscope, Activity, FileText, Pill, Thermometer,
    Heart, Wind, Droplets, Scale, Clock, Building2, CheckCircle2, AlertCircle
} from 'lucide-react';

interface VisitDetail {
    id: string;
    status: string;
    reason: string;
    createdAt: string;
    department: { name: string };
    doctor?: { firstName: string; lastName: string };
    vitals?: {
        temperature?: number;
        bpSystolic?: number;
        bpDiastolic?: number;
        pulse?: number;
        respiratoryRate?: number;
        oxygenSaturation?: number;
        weight?: number;
        height?: number;
        notes?: string;
    };
    consultation?: {
        notes?: string;
        prescription?: string;
        followUpDate?: string;
        status?: string;
        diagnoses?: Array<{ name: string; code?: string; type?: string }>;
        createdAt?: string;
    };
    payments?: Array<{
        id: string;
        serviceType: string;
        amountCharged: number;
        amountPaid: number;
        status: string;
    }>;
}

interface ClinicalHistorySlideOverProps {
    visitId: string | null;
    patientName: string;
    onClose: () => void;
}

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
    COMPLETED: { color: '#15803d', bg: '#dcfce7' },
    IN_CONSULTATION: { color: '#1d4ed8', bg: '#dbeafe' },
    WAITING: { color: '#b45309', bg: '#fef3c7' },
    CANCELLED: { color: '#b91c1c', bg: '#fee2e2' },
    REGISTERED: { color: '#7c3aed', bg: '#ede9fe' },
};

function VitalChip({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1 bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-400">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">{label}</span>
            </div>
            <span className="text-sm font-bold text-slate-800">{value}</span>
        </div>
    );
}

export function ClinicalHistorySlideOver({ visitId, patientName, onClose }: ClinicalHistorySlideOverProps) {
    const { token } = useAuthStore();
    const { brandColor, brandAlpha } = useBrandColor();
    const [visit, setVisit] = useState<VisitDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!visitId) return;
        setVisit(null);
        setError('');
        setLoading(true);
        fetch(`http://localhost:3000/visits/${visitId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.ok ? r.json() : Promise.reject('Failed to load visit'))
            .then(data => setVisit(data))
            .catch(e => setError(String(e)))
            .finally(() => setLoading(false));
    }, [visitId, token]);

    if (!visitId) return null;

    const st = visit ? (STATUS_COLORS[visit.status] || { color: '#64748b', bg: '#f1f5f9' }) : null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: brandAlpha(0.1) }}>
                            <Stethoscope className="h-4 w-4" style={{ color: brandColor }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">Clinical Record</h2>
                            <p className="text-xs text-slate-400">{patientName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin h-8 w-8 rounded-full border-2 border-slate-200" style={{ borderTopColor: brandColor }} />
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {visit && (
                        <>
                            {/* Visit Summary */}
                            <div className="rounded-xl border border-slate-100 p-4" style={{ backgroundColor: brandAlpha(0.04) }}>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-slate-400" />
                                        <span className="font-bold text-slate-800 text-sm">{visit.department.name}</span>
                                    </div>
                                    {st && (
                                        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ color: st.color, backgroundColor: st.bg }}>
                                            {visit.status.replace(/_/g, ' ')}
                                        </span>
                                    )}
                                </div>
                                {visit.reason && (
                                    <p className="text-sm text-slate-600 mb-2">
                                        <span className="font-semibold text-slate-700">Chief Complaint: </span>
                                        {visit.reason}
                                    </p>
                                )}
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Clock className="h-3 w-3" />
                                    {new Date(visit.createdAt).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                                </div>
                                {visit.doctor && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                        <Stethoscope className="h-3 w-3" />
                                        Dr. {visit.doctor.firstName} {visit.doctor.lastName}
                                    </div>
                                )}
                            </div>

                            {/* Vitals */}
                            {visit.vitals && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Activity className="h-3.5 w-3.5" />
                                        Vitals
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {visit.vitals.temperature != null && (
                                            <VitalChip icon={Thermometer} label="Temperature" value={`${visit.vitals.temperature} °C`} />
                                        )}
                                        {visit.vitals.bpSystolic != null && (
                                            <VitalChip icon={Heart} label="Blood Pressure" value={`${visit.vitals.bpSystolic}/${visit.vitals.bpDiastolic} mmHg`} />
                                        )}
                                        {visit.vitals.pulse != null && (
                                            <VitalChip icon={Heart} label="Pulse" value={`${visit.vitals.pulse} bpm`} />
                                        )}
                                        {visit.vitals.respiratoryRate != null && (
                                            <VitalChip icon={Wind} label="Resp. Rate" value={`${visit.vitals.respiratoryRate}/min`} />
                                        )}
                                        {visit.vitals.oxygenSaturation != null && (
                                            <VitalChip icon={Droplets} label="SpO₂" value={`${visit.vitals.oxygenSaturation}%`} />
                                        )}
                                        {visit.vitals.weight != null && (
                                            <VitalChip icon={Scale} label="Weight" value={`${visit.vitals.weight} kg`} />
                                        )}
                                    </div>
                                    {visit.vitals.notes && (
                                        <p className="mt-2 text-xs text-slate-500 italic px-1">{visit.vitals.notes}</p>
                                    )}
                                </div>
                            )}

                            {/* Consultation Notes */}
                            {visit.consultation && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <FileText className="h-3.5 w-3.5" />
                                        Consultation Notes
                                    </h3>
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                                        {visit.consultation.notes ? (
                                            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{visit.consultation.notes}</p>
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">No consultation notes recorded.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Diagnoses */}
                            {visit.consultation?.diagnoses && visit.consultation.diagnoses.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Diagnoses
                                    </h3>
                                    <div className="space-y-2">
                                        {visit.consultation.diagnoses.map((dx, i) => (
                                            <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-100">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{dx.name}</p>
                                                    {dx.code && <p className="text-xs text-slate-400">ICD: {dx.code}</p>}
                                                </div>
                                                {dx.type && (
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
                                                        {dx.type}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Prescription */}
                            {visit.consultation?.prescription && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Pill className="h-3.5 w-3.5" />
                                        Prescription
                                    </h3>
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-mono text-xs">
                                            {visit.consultation.prescription}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Follow-up */}
                            {visit.consultation?.followUpDate && (
                                <div className="flex items-center gap-3 p-4 rounded-xl border border-sky-100 bg-sky-50">
                                    <Clock className="h-4 w-4 text-sky-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-sky-700 uppercase">Follow-up Scheduled</p>
                                        <p className="text-sm font-semibold text-sky-900">
                                            {new Date(visit.consultation.followUpDate).toLocaleDateString('en-US', { dateStyle: 'long' })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* No clinical data */}
                            {!visit.vitals && !visit.consultation && (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-slate-600">No clinical data recorded</p>
                                    <p className="text-xs text-slate-400 mt-1">This visit has no vitals or consultation notes yet.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
