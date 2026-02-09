import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const startDateTime = new Date(`${formData.date}T${formData.startTime}`).toISOString();
        const endDateTime = new Date(`${formData.date}T${formData.endTime}`).toISOString();

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
                            <Select
                                value={formData.patientId}
                                onValueChange={(val: string) => setFormData({ ...formData, patientId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select patient" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div>
                        <Label>Doctor</Label>
                        <Select
                            value={formData.doctorId}
                            onValueChange={(val: string) => setFormData({ ...formData, doctorId: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Assign doctor (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map(d => (
                                    <SelectItem key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                            <Button type="button" variant="danger" onClick={handleDelete} disabled={loading}>
                                Cancel Appointment
                            </Button>
                        )}
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Appointment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
