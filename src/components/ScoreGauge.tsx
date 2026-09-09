'use client';

interface Props {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreGauge({ score, label, size = 'md' }: Props) {
  const dimensions = { sm: 56, md: 72, lg: 96 };
  const dim = dimensions[size];
  const radius = (dim / 2) - 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = dim / 2;

  const colorClass =
    score >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
    score >= 50 ? 'text-amber-600 dark:text-amber-400' :
    'text-red-600 dark:text-red-400';

  const strokeClass =
    score >= 90 ? 'stroke-emerald-500 dark:stroke-emerald-400' :
    score >= 50 ? 'stroke-amber-500 dark:stroke-amber-400' :
    'stroke-red-500 dark:stroke-red-400';

  const textSize = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm';

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${dim} ${dim}`}>
          <circle
            cx={center} cy={center} r={radius}
            className="fill-none stroke-zinc-200 dark:stroke-zinc-700"
            strokeWidth="5"
          />
          <circle
            cx={center} cy={center} r={radius}
            className={`fill-none ${strokeClass}`}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center font-semibold tabular-nums ${textSize} ${colorClass}`}>
          {score}
        </span>
      </div>
      {label && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">{label}</span>
      )}
    </div>
  );
}