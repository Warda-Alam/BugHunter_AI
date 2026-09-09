'use client';

import { useState, FormEvent } from 'react';
import { Loader2, GitCompareArrows } from 'lucide-react';

interface Props {
  onSubmit: (yourUrl: string, competitorUrl: string) => void;
  loading: boolean;
}

export default function CompareForm({ onSubmit, loading }: Props) {
  const [yourUrl, setYourUrl] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!yourUrl.trim() || !competitorUrl.trim()) return;
    onSubmit(yourUrl.trim(), competitorUrl.trim());
  };

  const canSubmit = yourUrl.trim() && competitorUrl.trim();

  return (
    <div className="glass-card p-4 sm:p-5 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="your-url" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
            Your site
          </label>
          <input
            id="your-url"
            type="text"
            value={yourUrl}
            onChange={(e) => setYourUrl(e.target.value)}
            placeholder="https://yoursite.com"
            className="input-field !pl-4"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="competitor-url" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
            Competitor
          </label>
          <input
            id="competitor-url"
            type="text"
            value={competitorUrl}
            onChange={(e) => setCompetitorUrl(e.target.value)}
            placeholder="https://competitor.com"
            className="input-field !pl-4"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="btn-primary w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Comparing both sites…
            </>
          ) : (
            <>
              <GitCompareArrows className="w-4 h-4" />
              Compare Sites
            </>
          )}
        </button>
      </form>
    </div>
  );
}
