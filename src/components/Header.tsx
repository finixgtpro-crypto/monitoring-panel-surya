import { Sun, Wifi, WifiOff, Activity, LogOut } from 'lucide-react';

interface HeaderProps {
  isLive: boolean;
  onToggleLive: () => void;
  userEmail?: string;
  onLogout?: () => void;
}

export default function Header({ isLive, onToggleLive, userEmail, onLogout }: HeaderProps) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <header className="bg-slate-900 border-b border-slate-700/60">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30">
              <Sun className="w-6 h-6 text-amber-400" strokeWidth={1.75} />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-slate-900" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight tracking-tight">
                SolarTrack <span className="text-amber-400">IoT</span>
              </h1>
              <p className="text-xs text-slate-400 leading-tight">
                Monitoring Tegangan & Arus Panel Surya — ESP32
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400">{dateStr}</span>
              <span className="text-xs font-mono text-slate-300">{timeStr}</span>
            </div>

            <button
              onClick={onToggleLive}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 ${
                isLive
                  ? 'bg-green-500/15 border-green-500/40 text-green-400 hover:bg-green-500/25'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {isLive ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  <Wifi className="w-3.5 h-3.5" />
                  Live
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  Paused
                </>
              )}
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs text-blue-400 font-medium">ESP32-WROOM-32</span>
            </div>

            {userEmail && (
              <div className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-lg bg-slate-700/50 border border-slate-600/50">
                <span className="text-xs text-slate-400">{userEmail}</span>
                <button
                  onClick={onLogout}
                  className="p-1 hover:bg-slate-600/50 rounded transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
