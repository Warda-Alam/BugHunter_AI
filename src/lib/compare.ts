import { AuditResult, CompareSummary, MetricComparison, MetricKey } from './types';
import { getOverallScore, scoreToGrade } from './scores';

const METRIC_DEFS: { key: MetricKey; label: string }[] = [
  { key: 'performance', label: 'Performance' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'bestPractices', label: 'Best Practices' },
  { key: 'seo', label: 'SEO' },
];

const PERF_HINT =
  ' — likely due to faster load times and better image optimization.';
const SEO_HINT =
  ' — they may have stronger meta tags and page structure.';
const A11Y_HINT =
  ' — they may have better alt text and contrast compliance.';
const BP_HINT =
  ' — they may use more up-to-date libraries with fewer console errors.';

function metricHint(key: MetricKey): string {
  switch (key) {
    case 'performance':
      return PERF_HINT;
    case 'seo':
      return SEO_HINT;
    case 'accessibility':
      return A11Y_HINT;
    case 'bestPractices':
      return BP_HINT;
  }
}

function generateInsight(
  metrics: MetricComparison[],
  yoursOverall: number,
  theirsOverall: number
): string {
  const parts: string[] = [];

  if (theirsOverall > yoursOverall) {
    parts.push(
      `Your competitor outperforms you overall (${theirsOverall} vs ${yoursOverall}).`
    );
  } else if (yoursOverall > theirsOverall) {
    parts.push(
      `You outperform your competitor overall (${yoursOverall} vs ${theirsOverall}).`
    );
  } else {
    parts.push(`You and your competitor are tied overall (${yoursOverall}).`);
  }

  const theirWins = metrics.filter((m) => m.diff < 0).sort((a, b) => a.diff - b.diff);
  if (theirWins[0]) {
    const m = theirWins[0];
    parts.push(
      `They lead on ${m.label} by ${Math.abs(m.diff)} points${metricHint(m.key)}`
    );
  }

  const yourWins = metrics.filter((m) => m.diff > 0).sort((a, b) => b.diff - a.diff);
  if (yourWins[0]) {
    parts.push(
      `Your ${yourWins[0].label} score is ${yourWins[0].diff} points higher.`
    );
  }

  return parts.join(' ');
}

export function buildCompareSummary(
  yours: AuditResult,
  competitor: AuditResult,
  device: 'mobile' | 'desktop' = 'mobile'
): CompareSummary {
  const yourScores = yours.pagespeed[device];
  const theirScores = competitor.pagespeed[device];

  const metrics: MetricComparison[] = METRIC_DEFS.map(({ key, label }) => ({
    key,
    label,
    yours: yourScores[key],
    theirs: theirScores[key],
    diff: yourScores[key] - theirScores[key],
  }));

  const yoursOverall = getOverallScore(yourScores);
  const theirsOverall = getOverallScore(theirScores);

  return {
    yoursOverall,
    theirsOverall,
    yoursGrade: scoreToGrade(yoursOverall),
    theirsGrade: scoreToGrade(theirsOverall),
    metrics,
    insight: generateInsight(metrics, yoursOverall, theirsOverall),
  };
}

export function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
