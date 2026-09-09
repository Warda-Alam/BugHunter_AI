export interface PageSpeedScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  screenshot: string | null;
}

export type SuggestionSeverity = 'critical' | 'warning' | 'info';

export interface Suggestion {
  id: string;
  severity: SuggestionSeverity;
  title: string;
  problem: string;
  fix: string;
  codeExample?: string;
}

export interface AuditResult {
  url: string;
  pagespeed: {
    mobile: PageSpeedScores;
    desktop: PageSpeedScores;
  };
  seo: {
    title: string | null;
    metaDescription: string | null;
    h1: string | null;
    h1Count: number;
    hasViewport: boolean;
    hasCharset: boolean;
  };
  https: boolean;
  mobileFriendly: boolean;
}

export interface CompareResult {
  yours: AuditResult;
  competitor: AuditResult;
}

export type MetricKey = 'performance' | 'accessibility' | 'bestPractices' | 'seo';

export interface MetricComparison {
  key: MetricKey;
  label: string;
  yours: number;
  theirs: number;
  diff: number;
}

export interface CompareSummary {
  yoursOverall: number;
  theirsOverall: number;
  yoursGrade: string;
  theirsGrade: string;
  metrics: MetricComparison[];
  insight: string;
}