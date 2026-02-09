'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Combobox } from '@/components/ui/Combobox';
import toast from 'react-hot-toast';
import { Save, Clock } from 'lucide-react';

const DAYS = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function SchedulePage() {
    const { token, user } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
    const [availability, setAvailability] = useState<any[]>(
        DAYS.map((day, index) => ({
            dayOfWeek: index,
            startTime: '09:00',
            endTime: '17:00',
            isActive: true
        }))
    );

    const isAdmin = user?.role === 'HOSPITAL_ADMIN' || user?.role === 'SUPER_ADMIN';

    useEffect(() => {
        if (token && user) {
            if (isAdmin) {
                fetchDoctors();
            } else {
                setSelectedDoctorId(user.id);
            }
        }
    }, [token, user]);

    useEffect(() => {
        if (selectedDoctorId) {
            fetchAvailability(selectedDoctorId);
        }
    }, [selectedDoctorId]);

    const fetchDoctors = async () => {
        try {
            const res = await fetch('http://localhost:3000/appointments/doctors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const mapped = data.map((d: any) => ({
                    id: d.id,
                    title: `Dr. ${d.firstName} ${d.lastName}`
                }));
                setDoctors(mapped);
                // Default to first doctor if none selected
                if (!selectedDoctorId && mapped.length > 0) {
                    setSelectedDoctorId(mapped[0].id);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAvailability = async (doctorId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/schedule/${doctorId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Merge with default DAYS to ensure all 7 days are present
                const merged = DAYS.map((day, index) => {
                    const existing = data.find((d: any) => d.dayOfWeek === index);
                    return existing || {
                        dayOfWeek: index,
                        startTime: '09:00',
                        endTime: '17:00',
                        isActive: false
                    };
                });
                setAvailability(merged);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch schedule');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (index: number, field: string, value: any) => {
        const newAvail = [...availability];
        newAvail[index] = { ...newAvail[index], [field]: value };
        setAvailability(newAvail);
    };

    const handleSave = async () => {
        if (!selectedDoctorId) return;
        setSaving(true);
        try {
            const res = await fetch(`http://localhost:3000/schedule/${selectedDoctorId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(availability)
            });

            if (res.ok) {
                toast.success('Schedule updated successfully');
            } else {
                throw new Error('Failed to save');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to save schedule');
        } finally {
            setSaving(false);
        }
    };

    const selectedDoctor = isAdmin
        ? doctors.find(d => d.id === selectedDoctorId)
        : { title: `Dr. ${user?.firstName} ${user?.lastName}` };

    const comboboxItems = doctors.map(d => ({ value: d.id, label: d.title }));

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {isAdmin ? 'Doctor Schedule' : 'My Weekly Schedule'}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Current: <span className="font-semibold text-indigo-600">{selectedDoctor?.title || 'Loading...'}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {isAdmin && (
                            <div className="w-64">
                                <Combobox
                                    items={comboboxItems}
                                    value={selectedDoctorId}
                                    onChange={(val) => setSelectedDoctorId(val)}
                                    placeholder="Select Doctor..."
                                    searchPlaceholder="Search doctors..."
                                />
                            </div>
                        )}
                        <Button onClick={handleSave} disabled={saving || !selectedDoctorId}>
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-slate-500 animate-pulse">Loading availability data...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <div className="grid grid-cols-4 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <div className="col-span-1">Day</div>
                                <div>Status</div>
                                <div>Start Time</div>
                                <div>End Time</div>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {availability.map((day, index) => (
                                <div key={index} className="px-6 py-4 grid grid-cols-4 gap-4 items-center hover:bg-slate-50/30 transition-colors">
                                    <div className="font-medium text-slate-900">{DAYS[index]}</div>
                                    <div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={day.isActive}
                                                onChange={(e) => handleUpdate(index, 'isActive', e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                            <span className="ml-3 text-sm font-medium text-slate-600">
                                                {day.isActive ? 'Active' : 'Off'}
                                            </span>
                                        </label>
                                    </div>
                                    <div>
                                        <Input
                                            type="time"
                                            disabled={!day.isActive}
                                            value={day.startTime}
                                            onChange={(e) => handleUpdate(index, 'startTime', e.target.value)}
                                            className="w-32"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="time"
                                            disabled={!day.isActive}
                                            value={day.endTime}
                                            onChange={(e) => handleUpdate(index, 'endTime', e.target.value)}
                                            className="w-32"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
                    <Clock className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-semibold">Note on Availability</p>
                        <p className="mt-1">
                            Appointments can only be booked during your active working hours.
                            Users will see these slots as available on the booking calendar.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
