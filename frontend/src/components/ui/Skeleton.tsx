import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-slate-200/60", className)}
            {...props}
        />
    );
}

export function SkeletonCircle({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded-full bg-slate-200/60", className)}
            {...props}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="p-5 border border-slate-100 rounded-2xl bg-white space-y-4">
            <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-12" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="pt-4 border-t border-slate-50 flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-16" />
            </div>
        </div>
    );
}
