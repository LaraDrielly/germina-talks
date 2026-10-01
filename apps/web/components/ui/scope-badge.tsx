import { ScopeType } from '@prisma/client';

interface ScopeBadgeProps {
  scopeType: ScopeType;
  label: string;
  track?: string;
}

const trackColors: Record<string, string> = {
  business: 'bg-[#27AAE1] text-white',
  tech: 'bg-[#3A255B] text-white',
  factory: 'bg-[#F26522] text-white',
  global: 'bg-slate-200 text-slate-700',
};

export function ScopeBadge({ scopeType, label, track }: ScopeBadgeProps) {
  const colorClass = scopeType === 'global' 
    ? trackColors.global 
    : (track ? trackColors[track] || 'bg-slate-200 text-slate-700' : 'bg-slate-200 text-slate-700');

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}
