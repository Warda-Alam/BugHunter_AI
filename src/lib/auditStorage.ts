import { AuditResult } from './types';

const STORAGE_KEY = 'bughunter-audit';

export function saveAuditResult(data: AuditResult): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadAuditResult(): AuditResult | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuditResult;
  } catch {
    return null;
  }
}

export function clearAuditResult(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
