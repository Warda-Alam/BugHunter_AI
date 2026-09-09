'use client';

import { useState } from 'react';
import CompareForm from '@/src/components/CompareForm';
import CompareDashboard from '@/src/components/CompareDashboard';
import AuditLoadingSkeleton from '@/src/components/AuditLoadingSkeleton';
import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import { runAudit } from '@/src/lib/runAudit';
import { CompareResult } from '@/src/lib/types';
import { GitCompareArrows } from 'lucide-react';

export default function ComparePage() {
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (yourUrl: string, competitorUrl: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const [yours, competitor] = await Promise.all([
        runAudit(yourUrl),
        runAudit(competitorUrl),
      ]);
      setResult({ yours, competitor });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <section className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 text-xs font-medium mb-5 border border-brand-200/60 dark:border-brand-800/60">
              <GitCompareArrows className="w-3 h-3" />
              Competitor Comparison
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-balance">
              See how you stack up
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto text-balance">
              Run two audits in parallel and get a side-by-side breakdown with auto-generated insights.
            </p>
          </section>

          <CompareForm onSubmit={handleCompare} loading={loading} />

          {!result && !loading && (
            <p className="mt-8 text-center text-sm text-zinc-400 opacity-0 animate-fade-in">
              Both sites are audited simultaneously — this may take up to 30 seconds.
            </p>
          )}

          {loading && <AuditLoadingSkeleton />}

          {error && (
            <div className="mt-8 max-w-2xl mx-auto p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm flex items-start gap-3 opacity-0 animate-fade-in">
              <span className="shrink-0 mt-0.5">⚠</span>
              <div>
                <p className="font-medium">Comparison failed</p>
                <p className="mt-0.5 opacity-90">{error}</p>
              </div>
            </div>
          )}

          {result && !loading && <CompareDashboard data={result} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
