'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { pharmacyService, PharmacyOrder } from '@/services/pharmacyService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Pill, Check, Search, Filter, History, Package, Clock, RefreshCw, AlertCircle, User, CheckCircle2, XCircle, DollarSign } from 'lucide-react';
import { CurrencyDisplay } from '@/components/common/CurrencyDisplay';
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';

export default function PharmacyPage() {
    const { token, tenant } = useAuthStore();
    const [orders, setOrders] = useState<PharmacyOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchOrders = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await pharmacyService.getOrders(token, statusFilter === 'all' ? undefined : statusFilter);
            setOrders(data);
        } catch (error) {
            console.error('Error fetching pharmacy orders:', error);
            toast.error('Failed to load pharmacy orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token, statusFilter]);

    const handleDispense = async (orderId: string) => {
        if (!token) return;
        try {
            await pharmacyService.updateOrderStatus(token, orderId, 'DISPENSED');
            toast.success('Medication dispensed successfully');
            fetchOrders();
        } catch (error: any) {
            toast.error(error.message || 'Failed to dispense medication');
        }
    };

    const handleCancel = async (orderId: string) => {
        if (!token || !confirm('Are you sure you want to cancel this prescription?')) return;
        try {
            await pharmacyService.updateOrderStatus(token, orderId, 'CANCELLED');
            toast.success('Prescription cancelled');
            fetchOrders();
        } catch (error: any) {
            toast.error(error.message || 'Failed to cancel prescription');
        }
    };

    const getPaymentStatus = (order: PharmacyOrder) => {
        if (!order.payments || order.payments.length === 0) return 'UNPAID';
        const totalCharged = order.payments.reduce((acc, p) => acc + Number(p.amountCharged), 0);
        const totalPaid = order.payments.reduce((acc, p) => acc + Number(p.amountPaid), 0);

        if (totalPaid >= totalCharged && totalCharged > 0) return 'PAID';
        if (totalPaid > 0) return 'PARTIAL';
        return 'UNPAID';
    };

    const filteredOrders = orders.filter(order =>
        order.medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.visit?.patient?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.visit?.patient?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Stats & Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            {['PENDING', 'DISPENSED', 'CANCELLED', 'all'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${statusFilter === status
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {status.charAt(0) + status.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                        <Button variant="ghost" size="sm" onClick={fetchOrders} className="h-9 w-9 p-0">
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search patient or drug..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-9 text-sm"
                        />
                    </div>
                </div>

                {/* Orders Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                            <Pill className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No prescriptions found</h3>
                        <p className="text-slate-500 mt-1">There are no orders matching your current filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrders.map((order) => (
                            <Card key={order.id} className="overflow-hidden border-slate-100 hover:shadow-md transition-all flex flex-col">
                                <CardHeader className="bg-slate-50/50 pb-3 border-b border-slate-100">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-3">
                                                <Badge variant={
                                                    order.status === 'PENDING' ? 'warning' :
                                                        order.status === 'DISPENSED' ? 'success' : 'danger'
                                                }>
                                                    {order.status}
                                                </Badge>
                                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 px-3 py-1 bg-slate-50 rounded-lg">Unit Price ({useAuthStore.getState().tenant?.currency || 'ETB'})</div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {format(new Date(order.createdAt), 'MMM dd, HH:mm')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                    <User className="h-5 w-5 text-indigo-500" />
                                                    {order.visit?.patient?.firstName} {order.visit?.patient?.lastName}
                                                </CardTitle>
                                                <Badge
                                                    variant={getPaymentStatus(order) === 'PAID' ? 'success' : getPaymentStatus(order) === 'PARTIAL' ? 'warning' : 'danger'}
                                                    className="h-5 text-[9px] px-1.5"
                                                >
                                                    <DollarSign className="h-2.5 w-2.5 mr-0.5" />
                                                    {getPaymentStatus(order)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 pt-4 space-y-4">
                                    <div className="bg-white border border-slate-100 p-3 rounded-xl flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                            <Pill className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{order.medication.name}</p>
                                            <p className="text-xs text-slate-500">{order.medication.strength} • {order.medication.dosageForm}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-xs px-1">
                                        <span className="text-slate-500">Quantity prescribed:</span>
                                        <span className="font-bold text-slate-900">{order.quantity} {order.medication.dosageForm === 'Syrup' ? 'ml' : 'units'}</span>
                                    </div>

                                    {order.instructions && (
                                        <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100/50">
                                            <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Dosage Instructions</p>
                                            <p className="text-xs text-slate-700 italic">"{order.instructions}"</p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 pt-2">
                                        <p className="text-[10px] text-slate-400 font-medium">Prescribed by:</p>
                                        <p className="text-[10px] text-slate-600 font-bold underline decoration-slate-200">
                                            Dr. {order.prescribedBy?.lastName || 'Anonymous'}
                                        </p>
                                    </div>

                                    {order.status === 'PENDING' && (
                                        <div className="space-y-3 mt-auto pt-2">
                                            {getPaymentStatus(order) !== 'PAID' && (
                                                <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-100 rounded-lg text-[10px] text-amber-700 font-medium">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    Patient has not completed payment for this medication.
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-100"
                                                    onClick={() => handleCancel(order.id)}
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                                    disabled={getPaymentStatus(order) !== 'PAID'}
                                                    onClick={() => handleDispense(order.id)}
                                                >
                                                    {getPaymentStatus(order) !== 'PAID' ? 'Awaiting Payment' : 'Dispense'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {order.status === 'DISPENSED' && (
                                        <div className="mt-auto pt-2">
                                            <div className="flex items-center justify-center gap-2 p-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Order Dispensed
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
