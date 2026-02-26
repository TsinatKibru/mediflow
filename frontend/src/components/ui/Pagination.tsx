import React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
    total: number;
    skip: number;
    take: number;
    onPageChange: (skip: number) => void;
    onPageSizeChange?: (take: number) => void;
    className?: string;
}

export function Pagination({
    total,
    skip,
    take,
    onPageChange,
    onPageSizeChange,
    className
}: PaginationProps) {
    const currentPage = Math.floor(skip / take) + 1;
    const totalPages = Math.ceil(total / take);

    if (total === 0) return null;

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(Math.max(0, skip - take));
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(skip + take);
        }
    };

    const handleFirst = () => onPageChange(0);
    const handleLast = () => onPageChange(Math.max(0, (totalPages - 1) * take));

    return (
        <div className={cn("flex items-center justify-between px-2 py-4 border-t border-slate-100", className)}>
            <div className="text-sm text-slate-500">
                Showing <span className="font-medium">{skip + 1}</span> to{' '}
                <span className="font-medium">{Math.min(skip + take, total)}</span> of{' '}
                <span className="font-medium">{total}</span> results
            </div>

            <div className="flex items-center gap-6">
                {onPageSizeChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Rows per page:</span>
                        <select
                            className="text-sm border-none bg-transparent font-medium focus:ring-0 cursor-pointer"
                            value={take}
                            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                        >
                            {[10, 20, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleFirst}
                        disabled={currentPage === 1}
                        className="h-8 w-8"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="h-8 w-8"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="text-sm font-medium px-2">
                        Page {currentPage} of {totalPages}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLast}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
