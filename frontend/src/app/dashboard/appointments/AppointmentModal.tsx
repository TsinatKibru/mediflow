import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Combobox } from '@/components/ui/Combobox';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
}

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
}

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    selectedDate?: Date;
    existingAppointment?: any;
}

export function AppointmentModal({ isOpen, onClose, onSuccess, selectedDate, existingAppointment }: AppointmentModalProps) {
    const { token } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchPatient, setSearchPatient] = useState('');
    const [doctorAvailability, setDoctorAvailability] = useState<any[]>([]);
    const [isTimeValid, setIsTimeValid] = useState(true);
    const [departments, setDepartments] = useState<any[]>([]);
    const [checkingIn, setCheckingIn] = useState(false);
    const [selectedDeptId, setSelectedDeptId] = useState('');

    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        date: '',
        startTime: '',
        endTime: '',
        reason: '',
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchDoctors();
            fetchPatients();
            fetchDepartments();

            if (existingAppointment) {
                const start = new Date(existingAppointment.start);
                const end = new Date(existingAppointment.end);
                setFormData({
                    patientId: existingAppointment.resource.patientId,
                    doctorId: existingAppointment.resource.doctorId || '',
                    date: start.toISOString().split('T')[0],
                    startTime: start.toTimeString().slice(0, 5),
                    endTime: end.toTimeString().slice(0, 5),
                    reason: existingAppointment.resource.reason || '',
                    notes: existingAppointment.resource.notes || ''
                });
            } else if (selectedDate) {
                setFormData(prev => ({
                    ...prev,
                    date: selectedDate.toISOString().split('T')[0],
                    startTime: '09:00',
                    endTime: '09:30'
                }));
            }
        }
    }, [isOpen, selectedDate, existingAppointment]);

    useEffect(() => {
        if (formData.doctorId) {
            fetchDoctorAvailability(formData.doctorId);
        } else {
            setDoctorAvailability([]);
        }
    }, [formData.doctorId]);

    useEffect(() => {
        validateTime();
    }, [formData.startTime, formData.endTime, formData.date, doctorAvailability]);

    const fetchDoctorAvailability = async (doctorId: string) => {
        try {
            const res = await fetch(`http://localhost:3000/schedule/${doctorId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setDoctorAvailability(await res.json());
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
                if (data.length > 0) setSelectedDeptId(data[0].id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const validateTime = () => {
        if (!formData.doctorId || doctorAvailability.length === 0) {
            setIsTimeValid(true);
            return;
        }

        const date = new Date(formData.date);
        const dayOfWeek = date.getDay();
        const schedule = doctorAvailability.find(a => a.dayOfWeek === dayOfWeek);

        if (!schedule || !schedule.isActive) {
            setIsTimeValid(false);
            return;
        }

        const isValid = formData.startTime >= schedule.startTime && formData.endTime <= schedule.endTime;
        setIsTimeValid(isValid);
    };

    const fetchDoctors = async () => {
        try {
            const res = await fetch('http://localhost:3000/appointments/doctors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setDoctors(await res.json());
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPatients = async () => {
        try {
            const res = await fetch('http://localhost:3000/patients', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setPatients(await res.json());
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckIn = async () => {
        if (!selectedDeptId) {
            toast.error('Please select a department');
            return;
        }

        setCheckingIn(true);
        try {
            const res = await fetch(`http://localhost:3000/appointments/${existingAppointment.resource.id}/check-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ departmentId: selectedDeptId })
            });

            if (res.ok) {
                toast.success('Patient checked in successfully');
                onSuccess();
                onClose();
            } else {
                throw new Error('Check-in failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to check-in patient');
        } finally {
            setCheckingIn(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const start = new Date(`${formData.date}T${formData.startTime}`);
        const end = new Date(`${formData.date}T${formData.endTime}`);

        if (end <= start) {
            toast.error('End time must be after start time');
            setLoading(false);
            return;
        }

        const startDateTime = start.toISOString();
        const endDateTime = end.toISOString();

        if (formData.doctorId && !isTimeValid) {
            toast.error('Selected time is outside the doctor\'s working hours');
            setLoading(false);
            return;
        }

        const payload = {
            patientId: formData.patientId,
            doctorId: formData.doctorId || undefined,
            startTime: startDateTime,
            endTime: endDateTime,
            reason: formData.reason,
            notes: formData.notes
        };

        try {
            const url = existingAppointment
                ? `http://localhost:3000/appointments/${existingAppointment.resource.id}`
                : 'http://localhost:3000/appointments';

            const method = existingAppointment ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error(await res.text());

            toast.success(existingAppointment ? 'Appointment updated' : 'Appointment created');
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to save appointment: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!existingAppointment || !confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            setLoading(true);
            const res = await fetch(`http://localhost:3000/appointments/${existingAppointment.resource.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to delete');
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{existingAppointment ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!existingAppointment && (
                        <div>
                            <Label>Patient</Label>
                            <Combobox
                                items={patients.map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }))}
                                value={formData.patientId}
                                onChange={(val: string) => setFormData({ ...formData, patientId: val })}
                                placeholder="Select patient"
                                searchPlaceholder="Search patients..."
                                emptyText="No patient found."
                            />
                        </div>
                    )}

                    <div>
                        <Label>Doctor</Label>
                        <Combobox
                            items={doctors.map(d => ({ value: d.id, label: `Dr. ${d.firstName} ${d.lastName}` }))}
                            value={formData.doctorId}
                            onChange={(val: string) => setFormData({ ...formData, doctorId: val })}
                            placeholder="Assign doctor (optional)"
                            searchPlaceholder="Search doctors..."
                            emptyText="No doctor found."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Start Time</Label>
                            <Input
                                type="time"
                                value={formData.startTime}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, startTime: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label>End Time</Label>
                            <Input
                                type="time"
                                value={formData.endTime}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, endTime: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {!isTimeValid && formData.doctorId && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                            Warning: Selected time is outside the doctor's working hours for this day.
                        </div>
                    )}

                    <div>
                        <Label>Reason</Label>
                        <Input
                            value={formData.reason}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, reason: e.target.value })}
                            placeholder="Checkup, follow-up, etc."
                        />
                    </div>

                    <div>
                        <Label>Notes</Label>
                        <Textarea
                            value={formData.notes}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Internal notes..."
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        {existingAppointment && (
                            <div className="flex gap-2 items-center mr-auto border-r pr-4 border-slate-200">
                                <select
                                    className="text-sm border-slate-200 rounded-md py-1.5 focus:ring-indigo-500"
                                    value={selectedDeptId}
                                    onChange={(e) => setSelectedDeptId(e.target.value)}
                                    disabled={checkingIn || (existingAppointment.resource.status === 'COMPLETED')}
                                >
                                    <option value="">Select Dept...</option>
                                    {departments.map((dept: any) => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                                <Button
                                    type="button"
                                    onClick={handleCheckIn}
                                    disabled={checkingIn || loading || !selectedDeptId || (existingAppointment.resource.status === 'COMPLETED')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    {checkingIn ? '...' : 'Check-in'}
                                </Button>
                            </div>
                        )}
                        {existingAppointment && (
                            <Button type="button" variant="danger" onClick={handleDelete} disabled={loading || checkingIn}>
                                Cancel Appointment
                            </Button>
                        )}
                        <Button type="submit" disabled={loading || checkingIn || (existingAppointment?.resource.status === 'COMPLETED')}>
                            {loading ? 'Saving...' : 'Save Appointment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
