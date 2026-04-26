import { SensorReading } from '../types';

interface DataTableProps {
  data: SensorReading[];
}

function statusColor(power: number): string {
  if (power > 50) return 'text-green-400 bg-green-500/15';
  if (power > 10) return 'text-amber-400 bg-amber-500/15';
  return 'text-slate-400 bg-slate-700/50';
}

function statusLabel(power: number): string {
  if (power > 50) return 'Optimal';
  if (power > 10) return 'Rendah';
  return 'Minim';
}

export default function DataTable({ data }: DataTableProps) {
  const recent = [...data].reverse().slice(0, 10);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700/60">
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Waktu</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-amber-400 uppercase tracking-wider">Tegangan (V)</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-cyan-400 uppercase tracking-wider">Arus (A)</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-green-400 uppercase tracking-wider">Daya (W)</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-orange-400 uppercase tracking-wider">Suhu (°C)</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Irradiansi</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((r, i) => (
            <tr
              key={r.id}
              className={`border-b border-slate-800 transition-colors hover:bg-slate-800/40 ${i === 0 ? 'bg-slate-800/20' : ''}`}
            >
              <td className="py-2.5 px-4 text-xs font-mono text-slate-400">
                {new Date(r.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </td>
              <td className="py-2.5 px-4 text-right font-mono font-semibold text-amber-300">{r.voltage.toFixed(2)}</td>
              <td className="py-2.5 px-4 text-right font-mono font-semibold text-cyan-300">{r.current.toFixed(2)}</td>
              <td className="py-2.5 px-4 text-right font-mono font-semibold text-green-300">{r.power.toFixed(2)}</td>
              <td className="py-2.5 px-4 text-right font-mono text-orange-300">{r.temperature.toFixed(1)}</td>
              <td className="py-2.5 px-4 text-right font-mono text-slate-400">{r.irradiance.toFixed(0)} W/m²</td>
              <td className="py-2.5 px-4 text-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(r.power)}`}>
                  {statusLabel(r.power)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
