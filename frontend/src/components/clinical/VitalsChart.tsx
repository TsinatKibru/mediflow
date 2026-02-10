'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import format from 'date-fns/format';

interface VitalsChartProps {
    data: any[];
}

export function VitalsChart({ data }: VitalsChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-400 text-sm">No historical vitals data available</p>
            </div>
        );
    }

    const chartData = [...data].reverse().map(visit => ({
        date: format(new Date(visit.createdAt), 'MMM dd'),
        temp: visit.vitals?.temperature,
        bpSystolic: visit.vitals?.bpSystolic,
        bpDiastolic: visit.vitals?.bpDiastolic,
        pulse: visit.vitals?.pulse,
    })).filter(d => d.temp || d.bpSystolic);

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="temp"
                        name="Temp (°C)"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#ef4444' }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="bpSystolic"
                        name="BP Systolic"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#6366f1' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="bpDiastolic"
                        name="BP Diastolic"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#8b5cf6' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
