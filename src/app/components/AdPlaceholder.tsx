"use client";

interface AdProps {
    type?: "banner" | "sidebar" | "in-article";
    label?: string;
}

export default function AdPlaceholder({ type = "banner", label = "Advertisement" }: AdProps) {
    const styles = {
        banner: "w-full min-h-[120px] my-12",
        sidebar: "w-full min-h-[300px] mb-8",
        "in-article": "w-full min-h-[180px] my-10",
    };

    return (
        <div className={`relative overflow-hidden group ${styles[type]}`}>
            <div className="absolute inset-0 bg-stone-100 dark:bg-stone-900 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl flex flex-col items-center justify-center transition-all group-hover:bg-stone-200 dark:group-hover:bg-stone-800">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 dark:text-stone-600 mb-2">
                    {label}
                </span>
                <div className="flex items-center gap-2 text-stone-300 dark:text-stone-700">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 opacity-40"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.546 1.16 4.455 1.16 6.002 0a.75.75 0 0 0-.925-1.242c-1.008.756-3.143.756-4.152 0l-.879-.659V16.5h.001ZM11 7.182v-.382m4.121 2.502.879-.659c1.546-1.16 1.546-3.04 0-4.2a.75.75 0 0 0-.926 1.242c.504.378.504 1.34 0 1.718l-.879.659V16.5h.001ZM11 7.182c-1.546 1.16-4.455 1.16-6.002 0a.75.75 0 1 0 .925 1.242c1.008-.756 3.143-.756 4.152 0l.879.659V16.5h.001Z" /></svg>
                    <span className="text-xs font-bold tracking-widest opacity-30">Ad Space Available</span>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
}
