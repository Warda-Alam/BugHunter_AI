'use client';

import { useState } from 'react';
import { AuditResult } from '@/src/lib/types';
import ScoreGauge from './ScoreGauge';
import { Smartphone, Monitor, Shield, Globe, Download, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  data: AuditResult;
}

export default function ReportDashboard({ data }: Props) {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const scores = data.pagespeed[device];

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-${new URL(data.url).hostname}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Results for <span className="text-gray-600 dark:text-gray-400 font-normal">{data.url}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                device === 'mobile'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                device === 'desktop'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
          </div>
          <button
            onClick={downloadJson}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Download JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col items-center">
          <ScoreGauge score={scores.performance} label="Performance" />
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col items-center">
          <ScoreGauge score={scores.accessibility} label="Accessibility" />
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col items-center">
          <ScoreGauge score={scores.bestPractices} label="Best Practices" />
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 flex flex-col items-center">
          <ScoreGauge score={scores.seo} label="SEO" />
        </div>
      </div>

      {/* Lower Panels */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* SEO & Security */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
            SEO & Security
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Title</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right truncate max-w-[60%]">
                {data.seo.title || <span className="text-red-500">Missing</span>}
              </span>
            </div>
            <div className="h-px bg-gray-100 dark:bg-gray-800" />
            <div className="flex justify-between items-start gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Meta description</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right truncate max-w-[60%]">
                {data.seo.metaDescription || <span className="text-red-500">Missing</span>}
              </span>
            </div>
            <div className="h-px bg-gray-100 dark:bg-gray-800" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">H1 tags</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {data.seo.h1Count} {data.seo.h1Count === 1 ? 'found' : 'found'}
                {data.seo.h1Count !== 1 && <span className="text-amber-500 text-xs ml-1">(ideal: 1)</span>}
              </span>
            </div>
            <div className="h-px bg-gray-100 dark:bg-gray-800" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> HTTPS
              </span>
              {data.https ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="w-3 h-3" /> Secure
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400">
                  <XCircle className="w-3 h-3" /> Not secure
                </span>
              )}
            </div>
            <div className="h-px bg-gray-100 dark:bg-gray-800" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Mobile-friendly
              </span>
              {data.mobileFriendly ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="w-3 h-3" /> Yes
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
                  <XCircle className="w-3 h-3" /> No viewport
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Screenshot */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-4">
            Screenshot ({device})
          </h3>
          {scores.screenshot ? (
            <img
              src={scores.screenshot}
              alt={`${device} screenshot`}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800"
            />
          ) : (
            <div className="w-full h-48 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-sm text-gray-400">
              No screenshot available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}