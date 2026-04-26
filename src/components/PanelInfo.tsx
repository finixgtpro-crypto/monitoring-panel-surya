import { MapPin, Zap, Cpu, Thermometer, Sun, BarChart2 } from 'lucide-react';

interface PanelInfoProps {
  voltage: number;
  current: number;
  power: number;
  temperature: number;
  irradiance: number;
  efficiency: number;
}

export default function PanelInfo({ voltage, current, power, temperature, irradiance, efficiency }: PanelInfoProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Online</span>
        <span className="ml-auto text-xs text-slate-500">ESP32-WROOM-32</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InfoRow icon={MapPin} label="Lokasi" value="Atap Lab IoT" color="text-slate-300" />
        <InfoRow icon={Zap} label="Kapasitas" value="100 Wp" color="text-amber-300" />
        <InfoRow icon={Cpu} label="Panel ID" value="ESP32-01" color="text-blue-300" />
        <InfoRow icon={Sun} label="Irradiansi" value={`${irradiance.toFixed(0)} W/m²`} color="text-yellow-300" />
        <InfoRow icon={Thermometer} label="Suhu Panel" value={`${temperature.toFixed(1)} °C`} color="text-orange-300" />
        <InfoRow icon={BarChart2} label="Efisiensi" value={`${efficiency.toFixed(1)} %`} color="text-green-300" />
      </div>

      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-400">Beban Daya</span>
          <span className="text-green-300 font-semibold">{power.toFixed(1)} W / 100 W</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-700"
            style={{ width: `${Math.min(100, (power / 100) * 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-400">Tegangan</span>
          <span className="text-amber-300 font-semibold">{voltage.toFixed(2)} V / 18 V</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700"
            style={{ width: `${Math.min(100, (voltage / 18) * 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-400">Arus</span>
          <span className="text-cyan-300 font-semibold">{current.toFixed(2)} A / 5.5 A</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-700"
            style={{ width: `${Math.min(100, (current / 5.5) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>, label: string, value: string, color: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" strokeWidth={1.75} />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`text-xs font-semibold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
