'use client';

import { useState, useEffect } from 'react';
import { departmentService, Department } from '@/services/departmentService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, Building2, Plus, Edit2, ShieldCheck, XCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

export function DepartmentsManagement() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true,
    });

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const data = await departmentService.getDepartments();
            setDepartments(data.data || data);
        } catch (error) {
            toast.error('Failed to fetch departments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingDept) {
                await departmentService.updateDepartment(editingDept.id, formData);
                toast.success('Department updated successfully');
            } else {
                await departmentService.createDepartment(formData);
                toast.success('Department created successfully');
            }
            setIsModalOpen(false);
            setEditingDept(null);
            fetchDepartments();
            setFormData({ name: '', description: '', isActive: true });
        } catch (error: any) {
            toast.error(error.message || 'Failed to save department');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (dept: Department) => {
        setEditingDept(dept);
        setFormData({
            name: dept.name,
            description: dept.description || '',
            isActive: dept.isActive,
        });
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (dept: Department) => {
        try {
            await departmentService.updateDepartment(dept.id, { isActive: !dept.isActive });
            toast.success(`Department ${dept.isActive ? 'deactivated' : 'activated'}`);
            fetchDepartments();
        } catch (error) {
            toast.error('Failed to update department status');
        }
    };

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search departments..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={() => {
                    setEditingDept(null);
                    setFormData({ name: '', description: '', isActive: true });
                    setIsModalOpen(true);
                }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Department Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Description</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><Skeleton className="h-6 w-40" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-6 w-64" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-8 w-8 ml-auto" /></td>
                                </tr>
                            ))
                        ) : filteredDepartments.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                                    No departments found.
                                </td>
                            </tr>
                        ) : (
                            filteredDepartments.map((dept) => (
                                <tr key={dept.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-slate-400" />
                                            {dept.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-xs">
                                        {dept.description || '--'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {dept.isActive ? (
                                            <Badge variant="success" className="flex items-center w-fit gap-1">
                                                <ShieldCheck className="h-3 w-3" /> Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="default" className="flex items-center w-fit gap-1">
                                                <XCircle className="h-3 w-3" /> Inactive
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-slate-400 hover:text-indigo-600"
                                                onClick={() => handleEdit(dept)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={dept.isActive ? "text-slate-400 hover:text-rose-600" : "text-slate-400 hover:text-emerald-600"}
                                                onClick={() => handleToggleStatus(dept)}
                                            >
                                                {dept.isActive ? 'Deactivate' : 'Activate'}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDept ? "Edit Department" : "Add New Department"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Department Name</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Cardiology, Pediatrics"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Briefly describe the department's focus..."
                            className="h-24"
                        />
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label htmlFor="isActive" className="cursor-pointer">This department is currently active</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save Department'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
