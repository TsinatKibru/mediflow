import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';
import { Patient, InsurancePolicy } from '@/types/billing';

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    token: string;
    patient: { id: string; firstName: string; lastName: string };
    editingPolicy: InsurancePolicy | null;
    onResetEditing: () => void;
}

export function PolicyModal({ isOpen, onClose, onSuccess, token, patient, editingPolicy, onResetEditing }: PolicyModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        type: 'GOVERNMENT_BOOK' as 'SELF' | 'GOVERNMENT_BOOK' | 'NGO' | 'OTHER',
        policyNumber: '',
        issuedToName: `${patient.firstName} ${patient.lastName}`,
        issueYear: new Date().getFullYear().toString(),
        expiryYear: (new Date().getFullYear() + 1).toString(),
        providerName: '',
        notes: ''
    });

    useEffect(() => {
        if (editingPolicy) {
            setFormData({
                type: editingPolicy.type,
                policyNumber: editingPolicy.policyNumber,
                issuedToName: editingPolicy.issuedToName || '',
                issueYear: (editingPolicy.issueYear || '').toString(),
                expiryYear: (editingPolicy.expiryYear || '').toString(),
                providerName: editingPolicy.providerName || '',
                notes: editingPolicy.notes || ''
            });
        } else {
            setFormData({
                type: 'GOVERNMENT_BOOK',
                policyNumber: '',
                issuedToName: `${patient.firstName} ${patient.lastName}`,
                issueYear: new Date().getFullYear().toString(),
                expiryYear: (new Date().getFullYear() + 1).toString(),
                providerName: '',
                notes: ''
            });
        }
    }, [editingPolicy, patient]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = editingPolicy
                ? `http://localhost:3000/insurance-policies/${editingPolicy.id}`
                : 'http://localhost:3000/insurance-policies';
            const method = editingPolicy ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    patientId: patient.id,
                    issueYear: parseInt(formData.issueYear),
                    expiryYear: parseInt(formData.expiryYear)
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `Failed to ${editingPolicy ? 'update' : 'add'} policy`);
            }

            onSuccess();
            onResetEditing();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onResetEditing();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={editingPolicy ? "Edit Insurance Policy" : "Add Insurance Policy"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" /> {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Policy Type</label>
                        <select
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                            required
                        >
                            <option value="GOVERNMENT_BOOK">Government Book (CBHI)</option>
                            <option value="NGO">NGO Sponsorship</option>
                            <option value="OTHER">Private Insurance / Other</option>
                        </select>
                    </div>
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Policy/Book No.</label>
                        <input
                            type="text"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                            placeholder="e.g. CBHI-123456"
                            value={formData.policyNumber}
                            onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Issued To Name</label>
                    <input
                        type="text"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={formData.issuedToName}
                        onChange={(e) => setFormData({ ...formData, issuedToName: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Provider/Sponsor Name</label>
                    <input
                        type="text"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. Ministry of Health, Red Cross"
                        value={formData.providerName}
                        onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Issue Year</label>
                        <input
                            type="number"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                            value={formData.issueYear}
                            onChange={(e) => setFormData({ ...formData, issueYear: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Expiry Year</label>
                        <input
                            type="number"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                            value={formData.expiryYear}
                            onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                    <Button variant="outline" onClick={handleClose} type="button">Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? (editingPolicy ? 'Updating...' : 'Adding...') : (editingPolicy ? 'Update Policy' : 'Add Policy')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
