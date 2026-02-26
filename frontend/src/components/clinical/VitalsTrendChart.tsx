'use client';

import { useState, useMemo } from 'react';
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
import { format } from 'date-fns';
import { Activity, Thermometer, Weight, Heart } from 'lucide-react';

interface VitalsData {
    id: string;
    createdAt: string;
    vitals?: {
        systolicBP?: number;
        diastolicBP?: number;
        weight?: number;
        temperature?: number;
        pulse?: number;
        respiratoryRate?: number;
        oxygenSaturation?: number;
    } | null;
}

interface VitalsTrendChartProps {
    visits: VitalsData[];
}

export function VitalsTrendChart({ visits }: VitalsTrendChartProps) {
    const [activeVital, setActiveVital] = useState<'bp' | 'weight' | 'pulse' | 'temp'>('bp');

    const chartData = useMemo(() => {
        return visits
            .filter(v => v.vitals)
            .map(v => ({
                date: format(new Date(v.createdAt), 'MMM dd'),
                fullDate: format(new Date(v.createdAt), 'MMM dd, yyyy'),
                systolic: v.vitals?.systolicBP,
                diastolic: v.vitals?.diastolicBP,
                weight: v.vitals?.weight,
                pulse: v.vitals?.pulse,
                temp: v.vitals?.temperature,
            }))
            .reverse(); // Chronological order
    }, [visits]);

    if (chartData.length < 2) {
        return (
            <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100 italic text-slate-400 text-sm">
                Not enough data points to show trends. Minimum 2 recorded visits with vitals required.
            </div>
        );
    }

    const brandColor = 'var(--brand-color, #4f46e5)';

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-indigo-500" />
                    <h3 className="font-bold text-slate-800 text-sm italic py-1">Clinical Trend Lines</h3>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveVital('bp')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeVital === 'bp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        BP
                    </button>
                    <button
                        onClick={() => setActiveVital('weight')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeVital === 'weight' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Weight
                    </button>
                    <button
                        onClick={() => setActiveVital('pulse')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeVital === 'pulse' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Pulse
                    </button>
                    <button
                        onClick={() => setActiveVital('temp')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeVital === 'temp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Temp
                    </button>
                </div>
            </div>

            <div className="h-64 w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            width={30}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            labelStyle={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />

                        {activeVital === 'bp' && (
                            <>
                                <Line
                                    name="Systolic"
                                    type="monotone"
                                    dataKey="systolic"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    name="Diastolic"
                                    type="monotone"
                                    dataKey="diastolic"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </>
                        )}

                        {activeVital === 'weight' && (
                            <Line
                                name="Weight (kg)"
                                type="monotone"
                                dataKey="weight"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                        )}

                        {activeVital === 'pulse' && (
                            <Line
                                name="Pulse (bpm)"
                                type="monotone"
                                dataKey="pulse"
                                stroke="#f59e0b"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                        )}

                        {activeVital === 'temp' && (
                            <Line
                                name="Temp (°C)"
                                type="monotone"
                                dataKey="temp"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
