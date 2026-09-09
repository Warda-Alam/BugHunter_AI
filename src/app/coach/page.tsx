'use client';

import { useEffect, useState } from 'react';
import AuditForm from '@/src/components/AuditForm';
import AuditLoadingSkeleton from '@/src/components/AuditLoadingSkeleton';
import CoachSuggestions from '@/src/components/CoachSuggestions';
import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import { loadAuditResult, saveAuditResult } from '@/src/lib/auditStorage';
import { runAudit } from '@/src/lib/runAudit';
import { generateSuggestions } from '@/src/lib/suggestions';
import { AuditResult } from '@/src/lib/types';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function CoachPage() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadAuditResult();
    if (saved) setResult(saved);
  }, []);

  const handleAudit = async (url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await runAudit(url);
      setResult(data);
      saveAuditResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const suggestions = result ? generateSuggestions(result) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <section className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 text-xs font-medium mb-5 border border-brand-200/60 dark:border-brand-800/60">
              <GraduationCap className="w-3 h-3" />
              Smart Audit Coach
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-balance">
              Plain-English fixes, prioritized for you
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto text-balance">
              Run an audit and get actionable recommendations — critical issues first, with code examples where it helps.
            </p>
          </section>

          <AuditForm onSubmit={handleAudit} loading={loading} />

          {!result && !loading && (
            <div className="mt-10 glass-card p-6 max-w-2xl mx-auto text-center opacity-0 animate-fade-in">
              <Sparkles className="w-6 h-6 text-brand-500 mx-auto mb-3" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Enter a URL above, or visit the{' '}
                <a href="/" className="text-brand-600 dark:text-brand-400 hover:underline">
                  Audit page
                </a>{' '}
                and click &ldquo;View Smart Coach&rdquo; to carry over your last result.
              </p>
            </div>
          )}

          {loading && <AuditLoadingSkeleton />}

          {error && (
            <div className="mt-8 max-w-2xl mx-auto p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm flex items-start gap-3 opacity-0 animate-fade-in">
              <span className="shrink-0 mt-0.5">⚠</span>
              <div>
                <p className="font-medium">Audit failed</p>
                <p className="mt-0.5 opacity-90">{error}</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="mt-12">
              <CoachSuggestions suggestions={suggestions} url={result.url} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
