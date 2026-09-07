'use client';

import { useState } from 'react';
import AuditForm from '@/src/components/AuditForm';
import ReportDashboard from '@/src/components/ReportDashboard';
import { AuditResult } from '@/src/lib/types';

export default function Home() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async (url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Audit failed');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Website QA Audit Tool
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Analyze performance, SEO, accessibility, and best practices in one click.
          </p>
        </div>

        <AuditForm onSubmit={handleAudit} loading={loading} />

        {loading && (
          <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Running Lighthouse audit and fetching page metadata...
            <br />
            <span className="text-xs text-gray-400">This may take up to 30 seconds</span>
          </div>
        )}

        {error && (
          <div className="mt-8 max-w-2xl mx-auto p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {result && <ReportDashboard data={result} />}
      </div>
    </main>
  );
}