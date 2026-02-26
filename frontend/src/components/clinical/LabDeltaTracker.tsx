'use client';

import { useMemo } from 'react';
import { LabOrder } from '@/types/billing';
import { Badge } from '@/components/ui/Badge';
import { ArrowUp, ArrowDown, Minus, FlaskConical } from 'lucide-react';
import { format } from 'date-fns';

interface LabDeltaTrackerProps {
    currentOrder: LabOrder;
    previousOrders: LabOrder[];
}

export function LabDeltaTracker({ currentOrder, previousOrders }: LabDeltaTrackerProps) {
    const delta = useMemo(() => {
        // Find previous result for the SAME test name
        const previous = previousOrders.find(
            o => o.testName === currentOrder.testName && o.status === 'COMPLETED' && o.result
        );

        if (!previous || !previous.result || !currentOrder.result) return null;

        // Try to parse numerical values
        const currentVal = parseFloat(currentOrder.result.replace(/[^0-9.]/g, ''));
        const previousVal = parseFloat(previous.result.replace(/[^0-9.]/g, ''));

        if (isNaN(currentVal) || isNaN(previousVal)) {
            return {
                type: 'text',
                previousResult: previous.result,
                previousDate: previous.createdAt
            };
        }

        const diff = currentVal - previousVal;
        const percentChange = ((diff / previousVal) * 100).toFixed(1);

        return {
            type: 'numeric',
            diff,
            percentChange,
            previousResult: previous.result,
            previousDate: previous.createdAt
        };
    }, [currentOrder, previousOrders]);

    if (!delta) return null;

    return (
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 mt-2">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <FlaskConical className="h-3 w-3" />
                    Longitudinal Delta
                </span>
                <span className="text-[10px] text-slate-400">
                    Vs. {format(new Date(delta.previousDate), 'MMM dd, yyyy')}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <p className="text-[10px] text-slate-500 mb-0.5">Previous Result</p>
                    <p className="text-xs font-bold text-slate-700">{delta.previousResult}</p>
                </div>

                <div className="flex flex-col items-end">
                    {delta.type === 'numeric' ? (
                        <div className={`flex items-center gap-1 text-xs font-bold ${Number(delta.diff) > 0 ? 'text-amber-600' :
                            Number(delta.diff) < 0 ? 'text-emerald-600' : 'text-slate-500'
                            }`}>
                            {Number(delta.diff) > 0 ? <ArrowUp className="h-3 w-3" /> :
                                Number(delta.diff) < 0 ? <ArrowDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                            {Math.abs(Number(delta.diff)).toFixed(2)} ({delta.percentChange}%)
                        </div>
                    ) : (
                        <Badge variant="outline" className="text-[10px] py-0 border-slate-200 text-slate-400 bg-white">
                            Changed
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}
