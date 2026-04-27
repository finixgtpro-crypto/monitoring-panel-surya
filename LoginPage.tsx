import { useState } from 'react';
import { Sun, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setError('Akun berhasil dibuat! Silakan login dengan email dan password Anda.');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        onLoginSuccess();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/80 backdrop-blur-xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
              <Sun className="w-7 h-7 text-slate-900" strokeWidth={2} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">SolarTrack</h1>
              <p className="text-sm text-slate-400 mt-1">Monitoring Panel Surya</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`rounded-lg p-3 flex gap-3 ${
              error.includes('berhasil')
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                error.includes('berhasil') ? 'text-green-400' : 'text-red-400'
              }`} />
              <p className={`text-sm ${
                error.includes('berhasil') ? 'text-green-300' : 'text-red-300'
              }`}>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gmail.com"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-medium transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                isSignUp ? 'Daftar' : 'Masuk'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              {isSignUp ? 'Masuk' : 'Daftar'}
            </button>
          </div>

          {/* Info */}
          <div className="rounded-lg bg-slate-700/30 border border-slate-600/30 p-3">
            <p className="text-xs text-slate-400 leading-relaxed text-center"> Login untuk mengakses monitoring panel surya
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
