export interface PageSpeedScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  screenshot: string | null;
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