'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { AppointmentModal } from './AppointmentModal';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default function AppointmentsPage() {
    const { token } = useAuthStore();
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    const fetchAppointments = async () => {
        try {
            const res = await fetch('http://localhost:3000/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const mappedEvents = data.map((apt: any) => ({
                    title: `${apt.patient.firstName} ${apt.patient.lastName} ${apt.doctor ? `(w/ Dr. ${apt.doctor.lastName})` : ''}`,
                    start: new Date(apt.startTime),
                    end: new Date(apt.endTime),
                    resource: apt,
                }));
                setEvents(mappedEvents);
            } else {
                toast.error('Failed to fetch appointments');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred while fetching appointments');
        }
    };

    useEffect(() => {
        if (token) fetchAppointments();
    }, [token]);

    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        setSelectedSlot(slotInfo.start);
        setSelectedAppointment(null);
        setIsModalOpen(true);
    };

    const handleSelectEvent = (event: any) => {
        setSelectedAppointment(event);
        setSelectedSlot(null);
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="h-full flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                        <p className="text-slate-500 text-sm">Manage clinic schedule</p>
                    </div>
                    <Button onClick={() => { setSelectedSlot(new Date()); setSelectedAppointment(null); setIsModalOpen(true); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Appointment
                    </Button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 min-h-[600px]">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        selectable
                        views={['month', 'week', 'day']}
                        defaultView="week"
                        min={new Date(0, 0, 0, 8, 0, 0)}
                        max={new Date(0, 0, 0, 18, 0, 0)}
                    />
                </div>

                <AppointmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchAppointments}
                    selectedDate={selectedSlot || undefined}
                    existingAppointment={selectedAppointment}
                />
            </div>
        </DashboardLayout>
    );
}
