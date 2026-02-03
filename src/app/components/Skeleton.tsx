// Simple cn utility
function cn(...classes: (string | undefined | boolean)[]) {
    return classes.filter(Boolean).join(" ");
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export default function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-muted/60 dark:bg-muted/20",
                className
            )}
            {...props}
        />
    );
}

// Reusable preset: Card Skeleton
export function CardSkeleton() {
    return (
        <div className="flex flex-col rounded-3xl border border-border overflow-hidden bg-card transition-all">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="p-6 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="pt-4">
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    );
}

