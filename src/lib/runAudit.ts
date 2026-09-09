import { AuditResult } from './types';

export async function runAudit(url: string): Promise<AuditResult> {
  const res = await fetch('/api/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Audit failed');
  return data as AuditResult;
}
