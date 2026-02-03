import Skeleton, { CardSkeleton } from "./components/Skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-12 px-6">
            <div className="mx-auto max-w-7xl">
                {/* Hero Skeleton */}
                <div className="mx-auto max-w-3xl text-center mb-24 space-y-8">
                    <Skeleton className="h-6 w-32 rounded-full mx-auto" />
                    <Skeleton className="h-16 w-3/4 rounded-xl mx-auto" />
                    <Skeleton className="h-4 w-1/2 rounded-md mx-auto" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
