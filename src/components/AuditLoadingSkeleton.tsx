import { Loader2 } from 'lucide-react';

export default function AuditLoadingSkeleton() {
  return (
    <div className="mt-12 space-y-6 opacity-0 animate-fade-in">
      <div className="glass-card p-6 flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        <div className="text-center">
          <p className="font-medium text-zinc-700 dark:text-zinc-300">
            Running Lighthouse audit…
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 animate-pulse-soft">
            Fetching page metadata and generating report — up to 30 seconds
          </p>
        </div>
        <div className="w-full max-w-md h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-2">
          <div className="h-full w-1/3 bg-brand-500 rounded-full animate-shimmer" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-6 flex flex-col items-center gap-3">
            <div className="skeleton w-16 h-16 rounded-full" />
            <div className="skeleton w-20 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
