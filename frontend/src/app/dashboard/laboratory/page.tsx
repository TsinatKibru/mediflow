'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { laboratoryService, LabOrder } from '@/services/laboratoryService';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Beaker, User, History, Search, RefreshCw, FlaskConical, Send, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api.config';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export default function LaboratoryPage() {
    const { token } = useAuthStore();
    const [orders, setOrders] = useState<LabOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ORDERED');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingResults, setEditingResults] = useState<{ [key: string]: string }>({});

    const fetchOrders = async () => {
        if (!token) return;
        setLoading(true);
        try {
            let url = API_ENDPOINTS.LAB.BASE;
            if (statusFilter !== 'all') {
                url += `?status=${statusFilter}`;
            }
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching lab orders:', error);
            toast.error('Failed to load lab orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token, statusFilter]);

    const handleUpdateStatus = async (orderId: string, status: string) => {
        if (!token) return;
        try {
            await laboratoryService.updateOrder(token, orderId, { status });
            toast.success(`Status updated to ${status}`);
            fetchOrders();
        } catch (error: any) {
            toast.error('Failed to update status');
        }
    };

    const handleSubmitResult = async (orderId: string) => {
        if (!token || !editingResults[orderId]?.trim()) return;
        try {
            await laboratoryService.updateOrder(token, orderId, {
                status: 'COMPLETED',
                result: editingResults[orderId]
            });
            toast.success('Results recorded successfully');
            setEditingResults(prev => {
                const next = { ...prev };
                delete next[orderId];
                return next;
            });
            fetchOrders();
        } catch (error: any) {
            toast.error('Failed to record results');
        }
    };

    const filteredOrders = orders?.filter(order =>
        order.testName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.visit?.patient?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.visit?.patient?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const getPaymentStatus = (order: LabOrder) => {
        if (!order.payments || order.payments.length === 0) return 'UNPAID';
        const totalCharged = order.payments.reduce((acc, p) => acc + Number(p.amountCharged), 0);
        const totalPaid = order.payments.reduce((acc, p) => acc + Number(p.amountPaid), 0);

        if (totalPaid >= totalCharged && totalCharged > 0) return 'PAID';
        if (totalPaid > 0) return 'PARTIAL';
        return 'UNPAID';
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            {['ORDERED', 'COLLECTED', 'PROCESSING', 'COMPLETED', 'all'].map((status) => (
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
                            placeholder="Search test or patient..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-9 text-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-72 bg-slate-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                            <Beaker className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No lab orders found</h3>
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
                                                    order.status === 'ORDERED' ? 'info' :
                                                        order.status === 'COLLECTED' ? 'warning' :
                                                            order.status === 'PROCESSING' ? 'warning' :
                                                                order.status === 'COMPLETED' ? 'success' : 'danger'
                                                }>
                                                    {order.status}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                    <History className="h-3 w-3" />
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
                                            <FlaskConical className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{order.testName}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">ID: {order.id.slice(0, 8)}</p>
                                        </div>
                                    </div>

                                    {order.instructions && (
                                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Doctor Instructions</p>
                                            <p className="text-xs text-slate-600 italic">"{order.instructions}"</p>
                                        </div>
                                    )}

                                    {order.status === 'ORDERED' && (
                                        <div className="space-y-2">
                                            {getPaymentStatus(order) !== 'PAID' && (
                                                <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-100 rounded-lg text-[10px] text-amber-700 font-medium">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    Patient has not completed payment for this test.
                                                </div>
                                            )}
                                            <Button
                                                className="w-full bg-indigo-600 hover:bg-indigo-700"
                                                size="sm"
                                                onClick={() => handleUpdateStatus(order.id, 'COLLECTED')}
                                            >
                                                Mark Sample Collected
                                            </Button>
                                        </div>
                                    )}

                                    {order.status === 'COLLECTED' && (
                                        <Button className="w-full bg-amber-600 hover:bg-amber-700" size="sm" onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}>
                                            Move to Processing
                                        </Button>
                                    )}

                                    {(order.status === 'PROCESSING' || order.status === 'COLLECTED') && (
                                        <div className="space-y-3 pt-2">
                                            <div>
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type Test Results</Label>
                                                <Textarea
                                                    placeholder="Enter findings, values, etc..."
                                                    className="mt-1.5 h-24 text-sm"
                                                    value={editingResults[order.id] || ''}
                                                    onChange={e => setEditingResults({ ...editingResults, [order.id]: e.target.value })}
                                                />
                                            </div>
                                            <Button
                                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                                size="sm"
                                                disabled={!editingResults[order.id]?.trim()}
                                                onClick={() => handleSubmitResult(order.id)}
                                            >
                                                <Send className="h-4 w-4 mr-2" />
                                                Complete & Send Results
                                            </Button>
                                        </div>
                                    )}

                                    {order.status === 'COMPLETED' && (
                                        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-3 mt-auto">
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Verified Results</p>
                                            <p className="text-xs text-slate-700 whitespace-pre-wrap">{order.result}</p>
                                            <div className="mt-2 text-[10px] text-emerald-600 flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Finalized on {format(new Date(order.updatedAt), 'MMM dd, HH:mm')}
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
