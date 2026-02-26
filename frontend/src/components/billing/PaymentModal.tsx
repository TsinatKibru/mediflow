import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
    AlertCircle,
    Printer,
    DollarSign,
    Edit3,
    Power,
    Edit2,
    Trash2,
    Activity,
    UserPlus,
    Receipt,
    ShieldCheck,
    Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    Patient,
    InsurancePolicy,
    Payment,
    Coverage,
    Visit
} from '@/types/billing';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    token: string;
    patient: { id: string; firstName: string; lastName: string; phone?: string; gender?: string };
    visit: Visit;
    policies?: InsurancePolicy[];
    setActiveTab?: (tab: 'medical' | 'billing' | 'insurance') => void;
    setIsPolicyModalOpen?: (open: boolean) => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess, token, patient, visit, policies = [], setActiveTab, setIsPolicyModalOpen }: PaymentModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAddingTransaction, setIsAddingTransaction] = useState(false);
    const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
    const [printMode, setPrintMode] = useState<'ledger' | 'receipt'>('ledger');
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [hasCoverage, setHasCoverage] = useState(false);
    const [selectedPolicyId, setSelectedPolicyId] = useState<string>(visit.coverage?.insurancePolicyId || '');
    const [catalogItems, setCatalogItems] = useState<{ id: string; category: string; name: string; price: number; code?: string; description?: string }[]>([]);
    const [selectedCatalogItem, setSelectedCatalogItem] = useState<string>(''); // catalog item name

    const activePayments = visit.payments?.filter(p => !p.isVoided) || [];
    const totalBilled = activePayments.reduce((acc, p) => acc + Number(p.amountCharged), 0);
    const totalPaid = activePayments.reduce((acc, p) => acc + Number(p.amountPaid), 0);
    const balance = totalBilled - totalPaid;

    const [formData, setFormData] = useState({
        amountCharged: '',
        amountPaid: '',
        method: 'CASH' as 'CASH' | 'WAIVED' | 'PARTIAL' | 'OTHER',
        serviceType: 'CONSULTATION' as 'REGISTRATION' | 'CONSULTATION' | 'LABORATORY' | 'PHARMACY' | 'PROCEDURE' | 'RADIOLOGY' | 'OTHER',
        reason: '',
    });

    // Catalog items for the currently selected service type
    const catalogMatch = catalogItems
        .filter(c => c.category === formData.serviceType)
        .sort((a, b) => a.name.localeCompare(b.name));

    // The currently selected catalog item object
    const activeCatalogEntry = catalogMatch.find(c => c.name === selectedCatalogItem) ?? null;
    const standardPrice = activeCatalogEntry ? activeCatalogEntry.price : (catalogMatch.length === 1 ? catalogMatch[0].price : null);

    useEffect(() => {
        if (isOpen) {
            fetch('http://localhost:3000/service-catalog', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(r => r.ok ? r.json() : [])
                .then(data => setCatalogItems(data.filter((c: any) => c.isActive)))
                .catch(() => { });
        }
    }, [isOpen, token]);

    useEffect(() => {
        if (hasCoverage && policies.length > 0 && !selectedPolicyId) {
            const activePolicy = policies.find(p => p.isActive);
            if (activePolicy) setSelectedPolicyId(activePolicy.id);
        }
    }, [hasCoverage, policies, selectedPolicyId]);

    // When service type changes: reset item picker and auto-fill if only 1 catalog entry
    const handleServiceTypeChange = (newType: string) => {
        const matches = catalogItems
            .filter(c => c.category === newType)
            .sort((a, b) => a.name.localeCompare(b.name));

        if (matches.length === 1) {
            // Only one option — auto-select and fill everything
            setSelectedCatalogItem(matches[0].name);
            setFormData(prev => ({
                ...prev,
                serviceType: newType as any,
                amountCharged: String(matches[0].price),
                reason: matches[0].name,
            }));
        } else {
            // Multiple or none — reset and let user pick
            setSelectedCatalogItem('');
            setFormData(prev => ({ ...prev, serviceType: newType as any, amountCharged: '', reason: '' }));
        }
    };

    // When a specific catalog item is selected from the sub-dropdown
    const handleCatalogItemChange = (itemName: string) => {
        const item = catalogMatch.find(c => c.name === itemName);
        setSelectedCatalogItem(itemName);
        if (item) {
            setFormData(prev => ({
                ...prev,
                amountCharged: String(item.price),
                reason: item.name,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = editingPaymentId
                ? `http://localhost:3000/payments/${editingPaymentId}`
                : 'http://localhost:3000/payments';
            const method = editingPaymentId ? 'PATCH' : 'POST';

            const charged = parseFloat(formData.amountCharged);
            const paid = parseFloat(formData.amountPaid);

            if (isNaN(charged)) {
                setError('Please enter a valid amount for "Billed"');
                setLoading(false);
                return;
            }

            if (isNaN(paid)) {
                setError('Please enter a valid amount for "Paid" (Enter 0 if unpaid)');
                setLoading(false);
                return;
            }

            const body: any = {
                visitId: visit.id,
                amountCharged: charged,
                amountPaid: paid,
                method: formData.method,
                serviceType: formData.serviceType,
                reason: formData.reason,
            };

            if (hasCoverage && selectedPolicyId) {
                const policy = policies.find(p => p.id === selectedPolicyId);
                if (policy) {
                    body.insurancePolicyId = selectedPolicyId;
                    body.coverage = {
                        type: policy.type,
                        referenceNumber: policy.policyNumber,
                        issuedToName: policy.issuedToName,
                        issueYear: policy.issueYear,
                        expiryYear: policy.expiryYear,
                        insurancePolicyId: policy.id
                    };
                    if (!body.reason) body.reason = `Covered by ${policy.type.split('_').join(' ')} (#${policy.policyNumber})`;
                }
            } else if (hasCoverage && !selectedPolicyId) {
                setError('Please select an insurance policy or uncheck "Apply Coverage".');
                setLoading(false);
                return;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to process payment');
            }

            onSuccess();
            setIsAddingTransaction(false);
            setEditingPaymentId(null);
            setFormData({ ...formData, amountCharged: '', amountPaid: '', reason: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (payment: any) => {
        setEditingPaymentId(payment.id);
        setFormData({
            amountCharged: payment.amountCharged.toString(),
            amountPaid: payment.amountPaid.toString(),
            method: payment.method,
            serviceType: payment.serviceType,
            reason: payment.reason || ''
        });
        setIsAddingTransaction(true);
    };

    const handleDelete = async (paymentId: string) => {
        const reason = prompt('Please enter a reason for voiding this transaction:');
        if (!reason) return;

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/payments/${paymentId}/void`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason })
            });
            if (res.ok) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error voiding transaction:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPayment = async (paymentId: string, amount: number) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/payments/${paymentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'COMPLETED',
                    amountPaid: amount,
                    method: 'CASH' // Default to CASH for quick confirm
                })
            });
            if (res.ok) {
                onSuccess();
                toast.success('Payment confirmed');
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
            toast.error('Failed to confirm payment');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClaimStatus = async (status: string) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/payments/coverage/${visit.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error updating claim status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkCharges = async () => {
        if (!confirm('Add standard Inpatient Bulk Charges? (Bed, Nursing, Ward Consult)')) return;

        const bulkCharges = [
            { serviceType: 'PROCEDURE', amountCharged: 500, amountPaid: 0, method: 'CASH', reason: 'Daily Bed Charge' },
            { serviceType: 'PROCEDURE', amountCharged: 150, amountPaid: 0, method: 'CASH', reason: 'Nursing Services' },
            { serviceType: 'CONSULTATION', amountCharged: 300, amountPaid: 0, method: 'CASH', reason: 'Daily Ward Rounds' }
        ];

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/payments/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    visitId: visit.id,
                    payments: bulkCharges
                })
            });
            if (res.ok) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error posting bulk charges:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintLedger = () => {
        setPrintMode('ledger');
        setTimeout(() => window.print(), 50);
    };

    const handlePrintReceipt = (paymentId?: string) => {
        const p = paymentId
            ? visit.payments?.find(pay => pay.id === paymentId)
            : visit.payments?.[visit.payments.length - 1];

        if (!p) return;

        setSelectedPayment(p as any);
        setPrintMode('receipt');
        setTimeout(() => window.print(), 50);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Visit Billing Ledger" size="xl">
            {/* Print-only Ledger Template */}
            <div id="ledger-print-area" className={cn(
                "hidden p-10 space-y-8 text-slate-900 border-[10px] border-slate-100",
                printMode === 'ledger' ? 'print:block' : 'print:hidden'
            )}>
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">MediFlow Medical Center</h1>
                        <p className="text-sm font-bold text-slate-600">Patient Billing & Visit Ledger</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold">Ledger ID: {visit.id.toUpperCase()}</p>
                        <p className="text-sm">Date Generated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 py-6">
                    <div>
                        <h2 className="text-xs font-bold text-slate-500 uppercase mb-2">Patient Information</h2>
                        <p className="text-lg font-bold">{patient.firstName} {patient.lastName}</p>
                        <p className="text-sm text-slate-600">Phone: {patient.phone}</p>
                        <p className="text-sm text-slate-600">Gender: {patient.gender}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xs font-bold text-slate-500 uppercase mb-2">Visit Details</h2>
                        <p className="text-lg font-bold">{visit.department.name}</p>
                        <p className="text-sm text-slate-600">Admission: {new Date(visit.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-slate-600">Status: {visit.status}</p>
                    </div>
                </div>

                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="border-b-2 border-slate-900">
                            <th className="py-3 text-left font-bold uppercase text-xs">Date</th>
                            <th className="py-3 text-left font-bold uppercase text-xs">Description</th>
                            <th className="py-3 text-right font-bold uppercase text-xs">Billed (ETB)</th>
                            <th className="py-3 text-right font-bold uppercase text-xs">Paid (ETB)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {(visit.payments?.filter(p => !p.isVoided) || []).map(p => (
                            <tr key={p.id}>
                                <td className="py-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 font-medium">{p.serviceType.split('_').join(' ')} - {p.reason || 'Service Charge'}</td>
                                <td className="py-3 text-right font-bold">{Number(p.amountCharged).toFixed(2)}</td>
                                <td className="py-3 text-right font-bold text-emerald-700">{Number(p.amountPaid).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-slate-900">
                            <td colSpan={2} className="py-4 text-right font-bold uppercase text-xs">Cumulative Totals:</td>
                            <td className="py-4 text-right font-bold text-lg">{totalBilled.toFixed(2)}</td>
                            <td className="py-4 text-right font-bold text-lg text-emerald-700">{totalPaid.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan={3} className="py-4 text-right font-black uppercase text-sm">Outstanding Balance:</td>
                            <td className="py-4 text-right font-black text-xl border-double border-b-4 border-slate-900">
                                {balance.toFixed(2)} ETB
                            </td>
                        </tr>
                    </tfoot>
                </table>

                <div className="pt-20 text-center text-[10px] text-slate-400">
                    <p>This is a computer-generated document. No signature required.</p>
                    <p className="mt-2 font-bold text-slate-600">Thank you for choosing MediFlow Medical Center.</p>
                </div>
            </div>

            {/* Print-only Receipt Template */}
            <div id="receipt-print-area" className={cn(
                "hidden p-8 space-y-6 text-slate-900 border-2 border-dashed border-slate-300 max-w-sm mx-auto",
                printMode === 'receipt' ? 'print:block' : 'print:hidden'
            )}>
                <div className="text-center space-y-1">
                    <h1 className="text-xl font-black uppercase">MediFlow</h1>
                    <p className="text-xs font-bold text-slate-500 uppercase">Official Payment Receipt</p>
                </div>

                <div className="border-y border-slate-200 py-3 text-xs space-y-1">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Receipt No:</span>
                        <span className="font-bold">{selectedPayment?.id.slice(0, 8).toUpperCase() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Date:</span>
                        <span>{selectedPayment ? new Date(selectedPayment.createdAt).toLocaleString() : ''}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Patient</p>
                        <p className="text-sm font-bold">{patient.firstName} {patient.lastName}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Service</p>
                        <p className="text-sm font-bold">{selectedPayment?.serviceType.split('_').join(' ')}</p>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-xs">
                        <span>Amount Charged:</span>
                        <span>{Number(selectedPayment?.amountCharged || 0).toFixed(2)} ETB</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-2 border-t border-slate-200">
                        <span>Amount Paid:</span>
                        <span className="text-indigo-600">{Number(selectedPayment?.amountPaid || 0).toFixed(2)} ETB</span>
                    </div>
                </div>

                <div className="text-center pt-6 space-y-2">
                    <div className="inline-block px-4 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-full uppercase">
                        {selectedPayment?.method} Payment
                    </div>
                    <p className="text-[10px] text-slate-400 italic">Thank you for your visit!</p>
                </div>
            </div>

            <div className="space-y-6 print:hidden">
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Billed</p>
                        <p className="text-xl font-bold text-slate-900">{totalBilled.toFixed(2)} <span className="text-xs font-normal text-slate-500">ETB</span></p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-emerald-700 uppercase mb-1">Total Paid</p>
                        <p className="text-xl font-bold text-emerald-600">{totalPaid.toFixed(2)} <span className="text-xs font-normal text-emerald-500">ETB</span></p>
                    </div>
                    <div className={`${balance > 0 ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-200'} border rounded-xl p-4`}>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Balance Due</p>
                        <p className={`text-xl font-bold ${balance > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{balance.toFixed(2)} <span className="text-xs font-normal text-slate-500">ETB</span></p>
                    </div>
                </div>

                {visit.payments?.some(p => p.status === 'PENDING' && !p.isVoided) && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Pending Clinical Charges
                            </h3>
                            <Badge variant="warning" className="animate-pulse">Action Required</Badge>
                        </div>
                        <div className="space-y-2">
                            {visit.payments?.filter(p => p.status === 'PENDING' && !p.isVoided).map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-amber-100 shadow-sm">
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{p.reason || p.serviceType}</p>
                                        <p className="text-[10px] text-slate-500">{new Date(p.createdAt).toLocaleDateString()} • {p.serviceType}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm font-bold text-slate-900">{Number(p.amountCharged).toFixed(2)} ETB</p>
                                        <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs"
                                            onClick={() => handleConfirmPayment(p.id, Number(p.amountCharged))}
                                            disabled={loading}
                                        >
                                            <DollarSign className="h-3.5 w-3.5 mr-1" />
                                            Confirm & Pay
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {visit.coverage && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg text-white" style={{ backgroundColor: 'var(--brand-color, #4f46e5)' }}>
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-indigo-700 uppercase">Insurance Claim Tracking</p>
                                <p className="text-sm font-medium text-indigo-900">
                                    {visit.coverage.type.replace('_', ' ')} - #{visit.coverage.referenceNumber}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-600 uppercase">Status:</span>
                            <select
                                className="text-sm rounded-lg border-indigo-200 bg-white p-1.5 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700"
                                value={visit.coverage.claimStatus || 'SUBMITTED'}
                                onChange={(e) => handleUpdateClaimStatus(e.target.value)}
                            >
                                <option value="SUBMITTED">Submitted</option>
                                <option value="UNDER_REVIEW">Under Review</option>
                                <option value="APPROVED">Approved</option>
                                <option value="DENIED">Denied</option>
                                <option value="REIMBURSED">Reimbursed</option>
                            </select>
                        </div>
                    </div>
                )}

                {!isAddingTransaction && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Transaction History</h3>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={handleBulkCharges} className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                    <Layers className="h-3.5 w-3.5 mr-1" />
                                    Bulk Inpatient
                                </Button>
                                <Button size="sm" onClick={() => setIsAddingTransaction(true)}>
                                    <UserPlus className="h-3.5 w-3.5 mr-1" />
                                    Add Transaction
                                </Button>
                            </div>
                        </div>
                        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Service Category</th>
                                        <th className="px-4 py-3 text-right">Billed</th>
                                        <th className="px-4 py-3 text-right">Paid</th>
                                        <th className="px-4 py-3">Cashier</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {visit.payments && visit.payments.length > 0 ? (
                                        visit.payments.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3 text-slate-500 text-xs">
                                                    {new Date(p.createdAt).toLocaleDateString()}
                                                    {p.isVoided && (
                                                        <div className="mt-1">
                                                            <Badge variant="outline" className="bg-rose-50 text-rose-600 border-none text-[8px] py-0 px-1 font-black">VOIDED</Badge>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" size="sm" className={cn(
                                                        "bg-slate-100 text-slate-600 border-none font-bold text-[10px]",
                                                        p.isVoided && "opacity-40 grayscale",
                                                        p.status === 'PENDING' && "bg-amber-100 text-amber-700"
                                                    )}>
                                                        {p.serviceType.split('_').join(' ')}
                                                        {p.status === 'PENDING' && ' (PENDING)'}
                                                    </Badge>
                                                </td>
                                                <td className={cn("px-4 py-3 text-right font-medium", p.isVoided && "line-through text-slate-300 decoration-rose-400 decoration-2")}>{Number(p.amountCharged).toFixed(2)}</td>
                                                <td className={cn("px-4 py-3 text-right font-medium text-emerald-600", p.isVoided && "line-through text-slate-300 decoration-rose-400 decoration-2")}>{Number(p.amountPaid).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-slate-500 text-[10px]">
                                                    {p.verifiedBy ? `${p.verifiedBy.firstName} ${p.verifiedBy.lastName}` : 'System'}
                                                    {p.isVoided && p.voidReason && (
                                                        <div className="text-[8px] text-rose-400 italic mt-1 max-w-[100px] truncate" title={p.voidReason}>
                                                            {p.voidReason}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button onClick={() => handlePrintReceipt(p.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Print Receipt"><Printer className="h-3.5 w-3.5" /></button>
                                                        {!p.isVoided && (
                                                            <>
                                                                <button onClick={() => handleEdit(p)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Edit"><Edit2 className="h-3.5 w-3.5" /></button>
                                                                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" title="Void"><Trash2 className="h-3.5 w-3.5" /></button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">No transactions recorded yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {isAddingTransaction && (
                    <div className="bg-slate-50 border border-indigo-100 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-800 flex items-center">
                                <Activity className="h-4 w-4 mr-2 text-indigo-500" />
                                {editingPaymentId ? 'Update Transaction' : 'Record New Charge or Payment'}
                            </h4>
                            <Button variant="ghost" size="sm" onClick={() => {
                                setIsAddingTransaction(false);
                                setEditingPaymentId(null);
                            }}>Cancel</Button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Service Category</label>
                                    <select
                                        className="w-full rounded-lg border-slate-200 text-sm p-2"
                                        value={formData.serviceType}
                                        onChange={(e) => handleServiceTypeChange(e.target.value)}
                                    >
                                        <option value="REGISTRATION">Registration (Check-in)</option>
                                        <option value="CONSULTATION">Consultation</option>
                                        <option value="LABORATORY">Laboratory</option>
                                        <option value="PHARMACY">Pharmacy (Medicine)</option>
                                        <option value="PROCEDURE">Procedure</option>
                                        <option value="RADIOLOGY">Radiology</option>
                                        <option value="OTHER">Other Service</option>
                                    </select>
                                    {catalogMatch.length > 1 && (
                                        <div className="mt-2">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Specific Service</label>
                                            <select
                                                className="w-full rounded-lg border-slate-200 text-sm p-2 border"
                                                value={selectedCatalogItem}
                                                onChange={e => handleCatalogItemChange(e.target.value)}
                                            >
                                                <option value="">-- Select a specific service --</option>
                                                {catalogMatch.map(item => (
                                                    <option key={item.name} value={item.name}>
                                                        {item.name} — {Number(item.price).toLocaleString()} ETB
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    {catalogMatch.length === 0 && (
                                        <p className="text-[10px] text-slate-400 mt-1 italic">Not in price list — prices must be entered manually</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Method</label>
                                    <select className="w-full rounded-lg border-slate-200 text-sm p-2" value={formData.method} onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}>
                                        <option value="CASH">Cash</option>
                                        <option value="WAIVED">Waived</option>
                                        <option value="PARTIAL">Partial</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Billed</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full rounded-lg border-slate-200 text-sm p-2"
                                        value={formData.amountCharged}
                                        onChange={(e) => setFormData({ ...formData, amountCharged: e.target.value })}
                                    />
                                    {activeCatalogEntry ? (
                                        <p className="text-[10px] font-bold text-emerald-600 mt-1">
                                            ✓ Catalog price: {Number(activeCatalogEntry.price).toLocaleString()} ETB
                                        </p>
                                    ) : catalogMatch.length === 0 ? (
                                        <p className="text-[10px] text-slate-400 mt-1 italic">No catalog price — enter manually</p>
                                    ) : null}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">Paid</label>
                                    <input type="number" step="0.01" className="w-full rounded-lg border-slate-200 text-sm p-2" value={formData.amountPaid} onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className={cn(
                                    "flex items-center gap-2 mb-2",
                                    policies.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                                )}>
                                    <input
                                        type="checkbox"
                                        checked={hasCoverage}
                                        disabled={policies.length === 0}
                                        onChange={(e) => setHasCoverage(e.target.checked)}
                                    />
                                    <span className="text-sm font-bold">Apply Coverage</span>
                                    {policies.length === 0 && (
                                        <span className="text-[10px] text-amber-600 font-medium">(No active policies found)</span>
                                    )}
                                </label>
                                {hasCoverage && policies.length > 0 && (
                                    <select className="w-full rounded-lg border-slate-200 text-sm p-2" value={selectedPolicyId} onChange={(e) => setSelectedPolicyId(e.target.value)}>
                                        <option value="">Select Policy</option>
                                        {policies.map(p => <option key={p.id} value={p.id}>{p.type} - #{p.policyNumber}</option>)}
                                    </select>
                                )}
                            </div>
                            {error && (
                                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-600 font-medium flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </div>
                            )}
                            <Button type="submit" disabled={loading} className="w-full">
                                {editingPaymentId ? 'Update Transaction' : 'Post Transaction'}
                            </Button>
                        </form>
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handlePrintLedger}><Printer className="h-4 w-4 mr-2" /> Ledger</Button>
                        <Button variant="ghost" size="sm" onClick={() => handlePrintReceipt()}><Receipt className="h-4 w-4 mr-2" /> Receipt</Button>
                    </div>
                    <Button variant="primary" onClick={onClose}>Close</Button>
                </div>
            </div>
        </Modal>
    );
}
