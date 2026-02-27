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
import { Plus, Calendar as CalendarIcon, Check } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api.config';
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
    const [events, setEvents] = useState<any[]>([]);
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
            const res = await fetch(API_ENDPOINTS.APPOINTMENTS.BASE, {
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
            const res = await fetch(API_ENDPOINTS.APPOINTMENTS.DOCTORS, {
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
                const res = await fetch(API_ENDPOINTS.SCHEDULE.BY_DOCTOR(doc.id), {
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

                <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                    {/* Calendar Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-[3] flex flex-col">
                        <Calendar
                            localizer={localizer}
                            events={filteredEvents}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '600px' }}
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

                    {/* Today's Agenda Sidebar */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col">
                            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                                <CalendarIcon className="h-4 w-4 text-indigo-500" />
                                Today's Agenda
                            </h2>
                            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                                {events.filter(e => format(e.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
                                    .length === 0 ? (
                                    <div className="py-12 text-center">
                                        <p className="text-xs text-slate-400 italic">No appointments for today</p>
                                    </div>
                                ) : (
                                    events
                                        .filter(e => format(e.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
                                        .sort((a, b) => a.start.getTime() - b.start.getTime())
                                        .map((event: any, i) => (
                                            <div key={i} className="group p-3 rounded-lg border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                                                        {format(event.start, 'HH:mm')}
                                                    </span>
                                                    {event.resource.status === 'COMPLETED' ? (
                                                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                                            <Check className="h-3 w-3" /> Checked-in
                                                        </span>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 px-2 text-[10px] hover:bg-emerald-50 hover:text-emerald-700"
                                                            onClick={() => handleSelectEvent(event)}
                                                        >
                                                            Check-in Patient
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 mb-1">{event.resource.patient.firstName} {event.resource.patient.lastName}</p>
                                                <p className="text-[10px] text-slate-500 line-clamp-1">{event.resource.reason}</p>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    </div>
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
