'use client';

interface Props {
  score: number;
  label: string;
}

export default function ScoreGauge({ score, label }: Props) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colorClass =
    score >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
    score >= 50 ? 'text-amber-600 dark:text-amber-400' :
    'text-red-600 dark:text-red-400';

  const strokeClass =
    score >= 90 ? 'stroke-emerald-500 dark:stroke-emerald-400' :
    score >= 50 ? 'stroke-amber-500 dark:stroke-amber-400' :
    'stroke-red-500 dark:stroke-red-400';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r={radius}
            className="fill-none stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="6"
          />
          <circle
            cx="32" cy="32" r={radius}
            className={`fill-none ${strokeClass}`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-lg font-medium tabular-nums ${colorClass}`}>
          {score}
        </span>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
    </div>
  );
}