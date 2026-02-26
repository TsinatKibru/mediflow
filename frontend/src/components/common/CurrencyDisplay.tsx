'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';

interface CurrencyDisplayProps {
    amount: number | string;
    className?: string;
    showCode?: boolean;
    showSymbol?: boolean;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
    amount,
    className = "",
    showCode = false,
    showSymbol = true
}) => {
    const { tenant } = useAuthStore();
    const currency = tenant?.currency || 'ETB';
    const symbol = tenant?.currencySymbol || 'ETB';

    const formattedAmount = Number(amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <span className={className}>
            {showSymbol && <span className="mr-1">{symbol}</span>}
            {formattedAmount}
            {showCode && <span className="ml-1 text-[0.8em] opacity-70 uppercase">{currency}</span>}
        </span>
    );
};
