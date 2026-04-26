import { Video as LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  subtitle?: string;
  icon: LucideIcon;
  color: 'amber' | 'cyan' | 'green' | 'orange' | 'red';
  trend?: number;
  min?: string;
  max?: string;
}

const colorMap = {
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    icon: 'text-amber-400',
    iconBg: 'bg-amber-500/15',
    value: 'text-amber-300',
    glow: 'shadow-amber-500/10',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/25',
    icon: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15',
    value: 'text-cyan-300',
    glow: 'shadow-cyan-500/10',
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/25',
    icon: 'text-green-400',
    iconBg: 'bg-green-500/15',
    value: 'text-green-300',
    glow: 'shadow-green-500/10',
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/25',
    icon: 'text-orange-400',
    iconBg: 'bg-orange-500/15',
    value: 'text-orange-300',
    glow: 'shadow-orange-500/10',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    icon: 'text-red-400',
    iconBg: 'bg-red-500/15',
    value: 'text-red-300',
    glow: 'shadow-red-500/10',
  },
};

export default function MetricCard({ title, value, unit, subtitle, icon: Icon, color, trend, min, max }: MetricCardProps) {
  const c = colorMap[color];
  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;

  return (
    <div className={`relative rounded-xl border ${c.border} ${c.bg} p-5 shadow-lg ${c.glow} overflow-hidden`}>
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-white to-transparent pointer-events-none" />

      <div className="flex items-start justify-between mb-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${c.iconBg} border ${c.border}`}>
          <Icon className={`w-5 h-5 ${c.icon}`} strokeWidth={1.75} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
            trendPositive ? 'bg-green-500/15 text-green-400' :
            trendNegative ? 'bg-red-500/15 text-red-400' :
            'bg-slate-700 text-slate-400'
          }`}>
            {trendPositive ? <TrendingUp className="w-3 h-3" /> :
             trendNegative ? <TrendingDown className="w-3 h-3" /> :
             <Minus className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>

      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className={`text-3xl font-bold tabular-nums ${c.value}`}>{value}</span>
        <span className="text-sm font-medium text-slate-400">{unit}</span>
      </div>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}

      {(min !== undefined || max !== undefined) && (
        <div className="flex gap-3 mt-3 pt-3 border-t border-slate-700/60">
          {min !== undefined && (
            <div>
              <p className="text-xs text-slate-500">Min</p>
              <p className="text-xs font-semibold text-slate-300">{min} {unit}</p>
            </div>
          )}
          {max !== undefined && (
            <div>
              <p className="text-xs text-slate-500">Max</p>
              <p className="text-xs font-semibold text-slate-300">{max} {unit}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
