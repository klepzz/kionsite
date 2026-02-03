import Skeleton from "../../components/Skeleton";
import Navbar from "../../components/Navbar";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />

            <main className="pb-24 pt-32 relative">
                <div className="mx-auto max-w-3xl px-6">

                    {/* Header Skeleton */}
                    <div className="mb-12 text-center flex flex-col items-center space-y-6">
                        {/* Category Tag */}
                        <Skeleton className="h-6 w-24 rounded-full" />

                        {/* Title - Multi line */}
                        <div className="space-y-3 w-full flex flex-col items-center">
                            <Skeleton className="h-10 w-3/4 sm:h-12 lg:h-14" />
                            <Skeleton className="h-10 w-2/3 sm:h-12 lg:h-14" />
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 mt-4">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-1 w-1 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    {/* Hero Image Skeleton */}
                    <div className="relative mb-12 overflow-hidden rounded-2xl border border-border">
                        <Skeleton className="aspect-video w-full" />
                    </div>

                    {/* Content Skeleton */}
                    <div className="space-y-6 max-w-none">
                        {/* Intro Paragraph */}
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>

                        {/* Subheading */}
                        <Skeleton className="h-8 w-1/2 mt-8 mb-4" />

                        {/* Paragraph 2 */}
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-11/12" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>

                        {/* Grid / Image inside content */}
                        <Skeleton className="h-64 w-full rounded-xl my-8" />

                        {/* Paragraph 3 */}
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-10/12" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
