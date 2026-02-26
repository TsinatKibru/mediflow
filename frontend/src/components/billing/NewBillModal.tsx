'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Combobox } from '@/components/ui/Combobox';
import { useAuthStore } from '@/store/authStore';
import { Activity, User } from 'lucide-react';

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
}

interface Department {
    id: string;
    name: string;
}

interface NewBillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (visit: any) => void;
}

export function NewBillModal({ isOpen, onClose, onSuccess }: NewBillModalProps) {
    const { token } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    const [formData, setFormData] = useState({
        patientId: '',
        departmentId: '',
        reason: 'Service Billing'
    });

    useEffect(() => {
        if (isOpen && token) {
            fetchPatients();
            fetchDepartments();
        }
    }, [isOpen, token]);

    const fetchPatients = async () => {
        try {
            const res = await fetch('http://localhost:3000/patients', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const result = await res.json();
                setPatients(result.data || result);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await fetch('http://localhost:3000/departments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDepartments(data);
                if (data.length > 0 && !formData.departmentId) {
                    setFormData(prev => ({ ...prev, departmentId: data[0].id }));
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.patientId || !formData.departmentId) return;

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/visits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const visit = await res.json();
                onSuccess(visit);
                onClose();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-indigo-600" />
                        Create New Billing Record
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-slate-500">Select Patient</Label>
                            <Combobox
                                items={patients.map(p => ({
                                    value: p.id,
                                    label: `${p.firstName} ${p.lastName}`
                                }))}
                                value={formData.patientId}
                                onChange={(val: string) => setFormData({ ...formData, patientId: val })}
                                placeholder="Search patient..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-slate-500">Service Department</Label>
                            <select
                                className="w-full rounded-lg border-slate-200 text-sm p-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border"
                                value={formData.departmentId}
                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                            >
                                <option value="" disabled>Choose Department</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-slate-500">Billing Reason (Optional)</Label>
                            <input
                                className="w-full rounded-lg border-slate-200 text-sm p-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all border"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="e.g. Pharmacy, Outside Lab..."
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || !formData.patientId || !formData.departmentId}>
                            {loading ? 'Creating...' : 'Initialize Billing'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
