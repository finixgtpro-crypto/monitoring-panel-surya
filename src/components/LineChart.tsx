import { ChartDataPoint } from '../types';

interface LineChartProps {
  data: ChartDataPoint[];
  color: string;
  gradientId: string;
  unit: string;
  height?: number;
}

export default function LineChart({ data, color, gradientId, unit, height = 180 }: LineChartProps) {
  if (data.length < 2) return null;

  const W = 600;
  const H = height;
  const pad = { top: 16, right: 16, bottom: 32, left: 52 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const values = data.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const xScale = (i: number) => (i / (data.length - 1)) * innerW;
  const yScale = (v: number) => innerH - ((v - minVal) / range) * innerH;

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(2)} ${yScale(d.value).toFixed(2)}`)
    .join(' ');

  const areaPath = `${linePath} L ${xScale(data.length - 1).toFixed(2)} ${innerH} L 0 ${innerH} Z`;

  const yTicks = 4;
  const xTickInterval = Math.floor(data.length / 6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g transform={`translate(${pad.left}, ${pad.top})`}>
        {Array.from({ length: yTicks + 1 }, (_, i) => {
          const y = (i / yTicks) * innerH;
          const val = maxVal - (i / yTicks) * range;
          return (
            <g key={i}>
              <line x1={0} y1={y} x2={innerW} y2={y} stroke="#1e293b" strokeWidth="1" />
              <text x={-8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          if (i % xTickInterval !== 0) return null;
          return (
            <text key={i} x={xScale(i)} y={innerH + 18} textAnchor="middle" fontSize="9" fill="#64748b">
              {d.label}
            </text>
          );
        })}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />

        {data.length > 0 && (
          <circle
            cx={xScale(data.length - 1)}
            cy={yScale(data[data.length - 1].value)}
            r="4"
            fill={color}
            stroke="#0f172a"
            strokeWidth="2"
          />
        )}

        <text x={innerW} y={-4} textAnchor="end" fontSize="9" fill="#64748b">{unit}</text>
      </g>
    </svg>
  );
}
