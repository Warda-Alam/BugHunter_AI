'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuditResult } from '@/src/lib/types';
import { saveAuditResult } from '@/src/lib/auditStorage';
import { getOverallScore, getScoreLabel } from '@/src/lib/scores';
import ScoreGauge from './ScoreGauge';
import {
  Smartphone,
  Monitor,
  Shield,
  Globe,
  Download,
  CheckCircle,
  XCircle,
  Zap,
  Eye,
  Wrench,
  Search,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';

interface Props {
  data: AuditResult;
}

const METRIC_ICONS = {
  performance: Zap,
  accessibility: Eye,
  bestPractices: Wrench,
  seo: Search,
} as const;

export default function ReportDashboard({ data }: Props) {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const scores = data.pagespeed[device];
  const overall = getOverallScore(scores);
  const overallLabel = getScoreLabel(overall);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-${new URL(data.url).hostname}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const metrics = [
    { key: 'performance' as const, label: 'Performance', score: scores.performance },
    { key: 'accessibility' as const, label: 'Accessibility', score: scores.accessibility },
    { key: 'bestPractices' as const, label: 'Best Practices', score: scores.bestPractices },
    { key: 'seo' as const, label: 'SEO', score: scores.seo },
  ];

  return (
    <div className="mt-12 space-y-6 opacity-0 animate-slide-up">
      {/* Header */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
              Audit complete
            </p>
            <h2 className="text-lg font-semibold truncate">
              {data.url}
            </h2>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-1 text-sm text-brand-600 dark:text-brand-400 hover:underline"
            >
              Visit site <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
            <button
              onClick={downloadJson}
              className="p-2.5 rounded-xl border border-[rgb(var(--card-border))] text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              title="Download JSON report"
            >
              <Download className="w-4 h-4" />
            </button>
            <Link
              href="/coach"
              onClick={() => saveAuditResult(data)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition-colors shadow-sm"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Smart Coach
            </Link>
          </div>
        </div>
      </div>

      {/* Overall + Score Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="glass-card p-6 flex flex-col items-center justify-center lg:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
            Overall
          </p>
          <ScoreGauge score={overall} label="" size="lg" />
          <p className={`mt-2 text-sm font-semibold ${overallLabel.class}`}>
            {overallLabel.text}
          </p>
        </div>

        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(({ key, label, score }, i) => {
            const Icon = METRIC_ICONS[key];
            const staggerClass = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4'][i];
            return (
              <div
                key={key}
                className={`glass-card p-5 flex flex-col items-center opacity-0 animate-fade-in ${staggerClass}`}
              >
                <Icon className="w-4 h-4 text-zinc-400 mb-3" />
                <ScoreGauge score={score} label={label} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Lower Panels */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* SEO & Security */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              SEO & Security
            </h3>
          </div>

          <div className="space-y-4">
            <DetailRow label="Title" value={data.seo.title} missing />
            <Divider />
            <DetailRow label="Meta description" value={data.seo.metaDescription} missing />
            <Divider />
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">H1 tags</span>
              <span className="text-sm font-medium">
                {data.seo.h1Count} found
                {data.seo.h1Count !== 1 && (
                  <span className="text-amber-600 dark:text-amber-400 text-xs ml-1.5">(ideal: 1)</span>
                )}
              </span>
            </div>
            <Divider />
            <StatusRow
              icon={<Shield className="w-3.5 h-3.5" />}
              label="HTTPS"
              ok={data.https}
              okText="Secure"
              failText="Not secure"
            />
            <Divider />
            <StatusRow
              icon={<Globe className="w-3.5 h-3.5" />}
              label="Mobile-friendly"
              ok={data.mobileFriendly}
              okText="Yes"
              failText="No viewport"
              warnOnFail
            />
          </div>
        </div>

        {/* Screenshot */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            {device === 'mobile' ? (
              <Smartphone className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            ) : (
              <Monitor className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            )}
            <h3 className="text-sm font-semibold uppercase tracking-wide">
              {device === 'mobile' ? 'Mobile' : 'Desktop'} Preview
            </h3>
          </div>
          {scores.screenshot ? (
            <div className="relative group">
              <img
                src={scores.screenshot}
                alt={`${device} screenshot of ${data.url}`}
                className="w-full rounded-xl border border-[rgb(var(--card-border))] transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </div>
          ) : (
            <div className="w-full h-52 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl flex flex-col items-center justify-center gap-2 text-sm text-zinc-400">
              <Monitor className="w-8 h-8 opacity-40" />
              No screenshot available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-zinc-100 dark:bg-zinc-800" />;
}

function DetailRow({ label, value, missing }: { label: string; value: string | null; missing?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-zinc-500 dark:text-zinc-400 shrink-0">{label}</span>
      <span className="text-sm font-medium text-right truncate max-w-[60%]">
        {value || (missing ? <span className="text-red-500 dark:text-red-400">Missing</span> : '—')}
      </span>
    </div>
  );
}

function StatusRow({
  icon,
  label,
  ok,
  okText,
  failText,
  warnOnFail,
}: {
  icon: React.ReactNode;
  label: string;
  ok: boolean;
  okText: string;
  failText: string;
  warnOnFail?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
        {icon} {label}
      </span>
      {ok ? (
        <span className="badge-success">
          <CheckCircle className="w-3 h-3" /> {okText}
        </span>
      ) : (
        <span className={warnOnFail ? 'badge-warning' : 'badge-error'}>
          <XCircle className="w-3 h-3" /> {failText}
        </span>
      )}
    </div>
  );
}
