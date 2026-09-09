import { PageSpeedScores } from './types';

export function getOverallScore(scores: PageSpeedScores): number {
  return Math.round(
    (scores.performance + scores.accessibility + scores.bestPractices + scores.seo) / 4
  );
}

export function scoreToGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export function getScoreLabel(score: number): { text: string; class: string } {
  if (score >= 90) return { text: 'Excellent', class: 'text-emerald-600 dark:text-emerald-400' };
  if (score >= 50) return { text: 'Needs work', class: 'text-amber-600 dark:text-amber-400' };
  return { text: 'Poor', class: 'text-red-600 dark:text-red-400' };
}

export function getGradeColor(grade: string): string {
  if (grade === 'A') return 'text-emerald-600 dark:text-emerald-400';
  if (grade === 'B') return 'text-brand-600 dark:text-brand-400';
  if (grade === 'C') return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}
