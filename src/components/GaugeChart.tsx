interface GaugeChartProps {
  value: number;
  max: number;
  label: string;
  unit: string;
  color: string;
  size?: number;
}

export default function GaugeChart({ value, max, label, unit, color, size = 140 }: GaugeChartProps) {
  const radius = (size - 24) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -220;
  const endAngle = 40;
  const totalAngle = endAngle - startAngle;

  const pct = Math.min(1, Math.max(0, value / max));
  const fillAngle = startAngle + totalAngle * pct;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcPath = (start: number, end: number) => {
    const s = toRad(start);
    const e = toRad(end);
    const x1 = cx + radius * Math.cos(s);
    const y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e);
    const y2 = cy + radius * Math.sin(e);
    const large = Math.abs(end - start) > 180 ? 1 : 0;
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };

  const trackPath = arcPath(startAngle, endAngle);
  const activePath = pct > 0 ? arcPath(startAngle, fillAngle) : '';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={trackPath} fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
        {activePath && (
          <path d={activePath} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
        )}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fontWeight="700" fill="#f8fafc">
          {value.toFixed(1)}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#64748b">
          {unit}
        </text>
      </svg>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}
