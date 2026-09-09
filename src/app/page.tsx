'use client';

import { useState } from 'react';
import AuditForm from '@/src/components/AuditForm';
import AuditLoadingSkeleton from '@/src/components/AuditLoadingSkeleton';
import Footer from '@/src/components/Footer';
import Header from '@/src/components/Header';
import ReportDashboard from '@/src/components/ReportDashboard';
import { saveAuditResult } from '@/src/lib/auditStorage';
import { runAudit } from '@/src/lib/runAudit';
import { AuditResult } from '@/src/lib/types';
import { Zap, Eye, Shield, Search } from 'lucide-react';

const FEATURES = [
  { icon: Zap, label: 'Performance', desc: 'Core Web Vitals & speed' },
  { icon: Eye, label: 'Accessibility', desc: 'WCAG compliance checks' },
  { icon: Shield, label: 'Security', desc: 'HTTPS & best practices' },
  { icon: Search, label: 'SEO', desc: 'Meta tags & structure' },
];

export default function Home() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20">
          <section className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 text-xs font-medium mb-6 border border-brand-200/60 dark:border-brand-800/60">
              <Zap className="w-3 h-3" />
              Powered by Google PageSpeed Insights
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-balance">
              Find bugs before your users do
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto text-balance">
              Run a full QA audit on any website — performance, SEO, accessibility, and security in one click.
            </p>
          </section>

          <AuditForm onSubmit={handleAudit} loading={loading} />

          {!result && !loading && (
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto opacity-0 animate-fade-in">
              {FEATURES.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="text-center p-3 rounded-xl border border-transparent hover:border-[rgb(var(--card-border))] hover:bg-[rgb(var(--card))] transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-brand-600 dark:text-brand-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 hidden sm:block">{desc}</p>
                </div>
              ))}
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

          {result && <ReportDashboard data={result} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
