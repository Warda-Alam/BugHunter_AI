'use client';

import { useState } from 'react';
import { CompareResult } from '@/src/lib/types';
import { buildCompareSummary, hostnameFromUrl } from '@/src/lib/compare';
import { getGradeColor } from '@/src/lib/scores';
import { Smartphone, Monitor, Lightbulb } from 'lucide-react';

interface Props {
  data: CompareResult;
}

function DiffCell({ diff }: { diff: number }) {
  if (diff > 0) {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
        🟢 +{diff}
      </span>
    );
  }
  if (diff < 0) {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">
        🔴 {diff}
      </span>
    );
  }
  return <span className="text-zinc-400 font-medium">— 0</span>;
}

export default function CompareDashboard({ data }: Props) {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const summary = buildCompareSummary(data.yours, data.competitor, device);

  return (
    <div className="mt-12 space-y-6 opacity-0 animate-slide-up">
      {/* Device toggle */}
      <div className="flex justify-end">
        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              device === 'mobile'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              device === 'desktop'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop
          </button>
        </div>
      </div>

      {/* Side-by-side overall grades */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass-card p-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Your Site
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 truncate mb-4">
            {hostnameFromUrl(data.yours.url)}
          </p>
          <p className={`text-5xl font-bold tabular-nums ${getGradeColor(summary.yoursGrade)}`}>
            {summary.yoursGrade}
            <span className="text-2xl font-semibold text-zinc-400 ml-2">
              ({summary.yoursOverall})
            </span>
          </p>
        </div>

        <div className="glass-card p-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Competitor
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 truncate mb-4">
            {hostnameFromUrl(data.competitor.url)}
          </p>
          <p className={`text-5xl font-bold tabular-nums ${getGradeColor(summary.theirsGrade)}`}>
            {summary.theirsGrade}
            <span className="text-2xl font-semibold text-zinc-400 ml-2">
              ({summary.theirsOverall})
            </span>
          </p>
        </div>
      </div>

      {/* Score grid */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgb(var(--card-border))] bg-zinc-50/80 dark:bg-zinc-900/50">
                <th className="text-left py-3 px-4 font-semibold text-zinc-500 dark:text-zinc-400">
                  Category
                </th>
                <th className="text-center py-3 px-4 font-semibold text-zinc-500 dark:text-zinc-400">
                  You
                </th>
                <th className="text-center py-3 px-4 font-semibold text-zinc-500 dark:text-zinc-400">
                  Them
                </th>
                <th className="text-center py-3 px-4 font-semibold text-zinc-500 dark:text-zinc-400">
                  Diff
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.metrics.map((metric) => (
                <tr
                  key={metric.key}
                  className="border-b border-[rgb(var(--card-border))] last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-3.5 px-4 font-medium">{metric.label}</td>
                  <td className="py-3.5 px-4 text-center tabular-nums">{metric.yours}</td>
                  <td className="py-3.5 px-4 text-center tabular-nums text-zinc-500 dark:text-zinc-400">
                    {metric.theirs}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <DiffCell diff={metric.diff} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto-generated insight */}
      <div className="glass-card p-5 border-l-4 border-l-brand-500">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-400 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-brand-500" />
          Insight
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {summary.insight}
        </p>
      </div>
    </div>
  );
}
