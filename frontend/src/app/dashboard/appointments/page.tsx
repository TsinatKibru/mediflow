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
import { Combobox } from '@/components/ui/Combobox';

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
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<any>('week');
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [availabilities, setAvailabilities] = useState<any[]>([]);

    const fetchAppointments = async () => {
        try {
            const res = await fetch('http://localhost:3000/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const mappedEvents = data.map((apt: any) => ({
                    title: `${apt.patient.firstName} ${apt.patient.lastName} ${apt.doctor ? `(Dr. ${apt.doctor.lastName})` : ''}`,
                    start: new Date(apt.startTime),
                    end: new Date(apt.endTime),
                    resourceId: apt.doctorId,
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

    const fetchDoctors = async () => {
        try {
            const res = await fetch('http://localhost:3000/appointments/doctors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDoctors(data.map((d: any) => ({
                    id: d.id,
                    title: `Dr. ${d.firstName} ${d.lastName}`
                })));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAllAvailabilities = async () => {
        try {
            // Optimization: Fetch all availabilities for the tenant if possible, 
            // but our current endpoint is per-doctor. 
            // For now, let's fetch for each doctor in the list.
            const allAvails: any[] = [];
            for (const doc of doctors) {
                const res = await fetch(`http://localhost:3000/schedule/${doc.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    allAvails.push(...data);
                }
            }
            setAvailabilities(allAvails);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAppointments();
            fetchDoctors();
        }
    }, [token]);

    useEffect(() => {
        if (token && doctors.length > 0) {
            fetchAllAvailabilities();
        }
    }, [token, doctors]);

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

    const slotPropGetter = (date: Date, resourceId?: any) => {
        // Only grey out if a specific doctor is selected OR in resource view
        const targetDoctorId = resourceId || (selectedDoctorId !== 'all' ? selectedDoctorId : null);
        if (!targetDoctorId) return {};

        const dayOfWeek = getDay(date);
        const schedule = availabilities.find(a => a.doctorId === targetDoctorId && a.dayOfWeek === dayOfWeek);

        // If no schedule found or inactive, grey it out
        if (!schedule || !schedule.isActive) {
            return {
                style: {
                    backgroundColor: '#f8fafc', // slate-50
                    opacity: 0.6,
                }
            };
        }

        const timeStr = format(date, 'HH:mm');
        const isOutside = timeStr < schedule.startTime || timeStr >= schedule.endTime;

        if (isOutside) {
            return {
                style: {
                    backgroundColor: '#f8fafc',
                    opacity: 0.6,
                }
            };
        }

        return {};
    };

    const filteredEvents = selectedDoctorId === 'all'
        ? events
        : events.filter((e: any) => e.resourceId === selectedDoctorId);

    // Show resource columns in 'day' view, or 'week' view if there aren't too many doctors.
    // This provides a good balance between detail and horizontal space.
    const calendarResources = (currentView === 'day' || (currentView === 'week' && doctors.length <= 5)) && selectedDoctorId === 'all'
        ? doctors
        : undefined;

    const comboboxItems = [
        { value: 'all', label: 'All Doctors' },
        ...doctors.map(d => ({ value: d.id, label: d.title }))
    ];

    return (
        <DashboardLayout>
            <div className="h-full flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                        <p className="text-slate-500 text-sm">Manage clinic schedule</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-64">
                            <Combobox
                                items={comboboxItems}
                                value={selectedDoctorId}
                                onChange={(val) => setSelectedDoctorId(val || 'all')}
                                placeholder="Select Doctor..."
                                searchPlaceholder="Search doctors..."
                            />
                        </div>
                        <Button onClick={() => { setSelectedSlot(new Date()); setSelectedAppointment(null); setIsModalOpen(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Appointment
                        </Button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 min-h-[600px]">
                    <Calendar
                        localizer={localizer}
                        events={filteredEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        selectable
                        views={['month', 'week', 'day']}
                        view={currentView}
                        date={currentDate}
                        onView={(view) => setCurrentView(view)}
                        onNavigate={(date) => setCurrentDate(date)}
                        resources={calendarResources}
                        resourceIdAccessor="id"
                        resourceTitleAccessor="title"
                        slotPropGetter={slotPropGetter}
                        defaultView="week"
                        min={new Date(0, 0, 0, 7, 0, 0)}
                        max={new Date(0, 0, 0, 20, 0, 0)}
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
