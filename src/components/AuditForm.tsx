'use client';

import { useState, FormEvent } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';

interface Props {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export default function AuditForm({ onSubmit, loading }: Props) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit(url.trim());
  };

  return (
    <div className="glass-card p-2 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter a URL — e.g. https://example.com"
              className="input-field"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="btn-primary shrink-0 sm:min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Auditing…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run Audit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
