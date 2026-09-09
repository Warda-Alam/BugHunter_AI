'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bug } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Audit' },
  { href: '/coach', label: 'Smart Coach' },
  { href: '/compare', label: 'Compare' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[rgb(var(--card-border))] bg-[rgb(var(--card))]/80 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-600 text-white shadow-glow">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">BugHunter</span>
            <span className="text-brand-600 dark:text-brand-400 font-bold text-lg"> AI</span>
          </div>
        </Link>

        <nav className="ml-auto flex items-center gap-1">
          {NAV.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
