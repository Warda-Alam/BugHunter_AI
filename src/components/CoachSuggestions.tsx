'use client';

import { useState } from 'react';
import { Suggestion, SuggestionSeverity } from '@/src/lib/types';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Copy,
  Check,
  Lightbulb,
  Wrench,
} from 'lucide-react';

interface Props {
  suggestions: Suggestion[];
  url?: string;
}

const SEVERITY_CONFIG: Record<
  SuggestionSeverity,
  { icon: typeof AlertCircle; badge: string; border: string; label: string }
> = {
  critical: {
    icon: AlertCircle,
    badge: 'badge-error',
    border: 'border-l-red-500',
    label: 'Critical',
  },
  warning: {
    icon: AlertTriangle,
    badge: 'badge-warning',
    border: 'border-l-amber-500',
    label: 'Warning',
  },
  info: {
    icon: Info,
    badge: 'badge-success',
    border: 'border-l-brand-500',
    label: 'Info',
  },
};

function SeveritySummary({ suggestions }: { suggestions: Suggestion[] }) {
  const counts = suggestions.reduce(
    (acc, s) => {
      acc[s.severity] += 1;
      return acc;
    },
    { critical: 0, warning: 0, info: 0 }
  );

  const parts: string[] = [];
  if (counts.critical) parts.push(`${counts.critical} critical`);
  if (counts.warning) parts.push(`${counts.warning} warning${counts.warning !== 1 ? 's' : ''}`);
  if (counts.info) parts.push(`${counts.info} info`);

  if (parts.length === 0) return null;

  return (
    <p className="text-sm text-zinc-500 dark:text-zinc-400">
      {parts.join(' · ')}
    </p>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-3">
      <pre className="text-xs bg-zinc-100 dark:bg-zinc-900 border border-[rgb(var(--card-border))] rounded-lg p-3 overflow-x-auto font-mono text-zinc-800 dark:text-zinc-200">
        {code}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-[rgb(var(--card-border))] text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        title="Copy code"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

export default function CoachSuggestions({ suggestions, url }: Props) {
  const isAllClear = suggestions.length === 1 && suggestions[0].id === 'all-clear';

  return (
    <div className="space-y-4 opacity-0 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">
            {isAllClear ? 'All clear' : 'Action items'}
          </h2>
          {url && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 truncate max-w-md">
              {url}
            </p>
          )}
        </div>
        {!isAllClear && <SeveritySummary suggestions={suggestions} />}
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const config = SEVERITY_CONFIG[suggestion.severity];
          const Icon = config.icon;

          return (
            <article
              key={suggestion.id}
              className={`glass-card p-5 border-l-4 ${config.border} opacity-0 animate-fade-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`w-5 h-5 shrink-0 mt-0.5 ${
                    suggestion.severity === 'critical'
                      ? 'text-red-500'
                      : suggestion.severity === 'warning'
                        ? 'text-amber-500'
                        : 'text-brand-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold">{suggestion.title}</h3>
                    <span className={config.badge}>{config.label}</span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400 mb-1">
                        <Lightbulb className="w-3 h-3" /> Problem
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {suggestion.problem}
                      </p>
                    </div>

                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400 mb-1">
                        <Wrench className="w-3 h-3" /> Fix
                      </p>
                      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {suggestion.fix}
                      </p>
                    </div>

                    {suggestion.codeExample && (
                      <CodeBlock code={suggestion.codeExample} />
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
