import { useState, useEffect } from 'react';
import { Zap, Activity, Thermometer, Sun, Battery, TrendingUp, LogOut } from 'lucide-react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import LineChart from './components/LineChart';
import GaugeChart from './components/GaugeChart';
import DataTable from './components/DataTable';
import PanelInfo from './components/PanelInfo';
import LoginPage from './components/LoginPage';
import { useSolarData } from './hooks/useSolarData';
import { supabase } from './lib/supabase';

export default function App() {
  const { latest, history, voltageHistory, currentHistory, powerHistory, totalEnergy, efficiency, isLive, setIsLive } = useSolarData();
  const [tick, setTick] = useState(0);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ? { email: user.email || '' } : null);
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email || '' } : null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 rounded-lg bg-amber-400/30" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={() => {}} />;
  }

  const voltageValues = voltageHistory.map(d => d.value);
  const currentValues = currentHistory.map(d => d.value);

  const voltageTrend = voltageValues.length > 5
    ? ((voltageValues[voltageValues.length - 1] - voltageValues[voltageValues.length - 5]) / (voltageValues[voltageValues.length - 5] || 1)) * 100
    : 0;

  const currentTrend = currentValues.length > 5
    ? ((currentValues[currentValues.length - 1] - currentValues[currentValues.length - 5]) / (currentValues[currentValues.length - 5] || 1)) * 100
    : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header isLive={isLive} onToggleLive={() => setIsLive(v => !v)} userEmail={user?.email} onLogout={handleLogout} key={tick} />

      <main className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">

        <div className="rounded-xl border border-slate-700/60 bg-gradient-to-r from-slate-800 to-slate-800/50 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex-1">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Tugas Akhir / Skripsi</p>
              <h2 className="text-sm font-bold text-white leading-snug">
                Rancang Bangun Sistem Monitoring Tegangan dan Arus Panel Surya
                <span className="text-amber-400"> Berbasis Internet of Things</span> Menggunakan ESP32
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0 flex-wrap">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> MQTT / HTTP</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> INA219 Sensor</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" /> Real-time</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Tegangan"
            value={latest.voltage.toFixed(2)}
            unit="V"
            subtitle="Open-circuit voltage"
            icon={Zap}
            color="amber"
            trend={voltageTrend}
            min={Math.min(...voltageValues).toFixed(2)}
            max={Math.max(...voltageValues).toFixed(2)}
          />
          <MetricCard
            title="Arus"
            value={latest.current.toFixed(2)}
            unit="A"
            subtitle="Short-circuit current"
            icon={Activity}
            color="cyan"
            trend={currentTrend}
            min={Math.min(...currentValues).toFixed(2)}
            max={Math.max(...currentValues).toFixed(2)}
          />
          <MetricCard
            title="Daya"
            value={latest.power.toFixed(2)}
            unit="W"
            subtitle="P = V × I"
            icon={TrendingUp}
            color="green"
          />
          <MetricCard
            title="Energi Hari Ini"
            value={totalEnergy.toFixed(3)}
            unit="Wh"
            subtitle="Akumulasi 24 jam"
            icon={Battery}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Tren Tegangan</h3>
                <p className="text-xs text-slate-400">Voltage (V) — 24 jam terakhir</p>
              </div>
              <span className="text-lg font-bold tabular-nums text-amber-300">{latest.voltage.toFixed(2)} V</span>
            </div>
            <div className="h-44">
              <LineChart data={voltageHistory} color="#f59e0b" gradientId="voltageGrad" unit="V" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Tren Arus</h3>
                <p className="text-xs text-slate-400">Current (A) — 24 jam terakhir</p>
              </div>
              <span className="text-lg font-bold tabular-nums text-cyan-300">{latest.current.toFixed(2)} A</span>
            </div>
            <div className="h-44">
              <LineChart data={currentHistory} color="#22d3ee" gradientId="currentGrad" unit="A" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Tren Daya</h3>
                <p className="text-xs text-slate-400">Power (W) — 24 jam terakhir</p>
              </div>
              <span className="text-lg font-bold tabular-nums text-green-300">{latest.power.toFixed(2)} W</span>
            </div>
            <div className="h-44">
              <LineChart data={powerHistory} color="#4ade80" gradientId="powerGrad" unit="W" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Info Panel & Sensor</h3>
            <PanelInfo
              voltage={latest.voltage}
              current={latest.current}
              power={latest.power}
              temperature={latest.temperature}
              irradiance={latest.irradiance}
              efficiency={efficiency}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
          <h3 className="text-sm font-semibold text-white mb-6">Indikator Real-Time</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
            <GaugeChart value={latest.voltage} max={20} label="Tegangan" unit="V" color="#f59e0b" />
            <GaugeChart value={latest.current} max={6} label="Arus" unit="A" color="#22d3ee" />
            <GaugeChart value={latest.power} max={100} label="Daya" unit="W" color="#4ade80" />
            <GaugeChart value={latest.temperature} max={80} label="Suhu" unit="°C" color="#fb923c" />
            <GaugeChart value={latest.irradiance} max={1200} label="Irradiansi" unit="W/m²" color="#facc15" />
            <GaugeChart value={efficiency} max={100} label="Efisiensi" unit="%" color="#34d399" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Log Data Sensor</h3>
              <p className="text-xs text-slate-400">10 pembacaan terbaru dari ESP32</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {history.length} data tersimpan
            </div>
          </div>
          <DataTable data={history} />
        </div>

        <footer className="border-t border-slate-700/60 pt-4 pb-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
              <span>SolarTrack IoT Dashboard — Sistem Monitoring Panel Surya Berbasis ESP32</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
