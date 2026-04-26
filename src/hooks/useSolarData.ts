import { useState, useEffect, useCallback, useRef } from 'react';
import { ChartDataPoint, SensorReading } from '../types';

const PANEL_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

function solarFactor(hour: number): number {
  if (hour < 6 || hour > 18) return 0;
  return Math.max(0, Math.sin(((hour - 6) * Math.PI) / 12));
}

function noise(scale = 1): number {
  return (Math.random() - 0.5) * scale;
}

function generateReading(now: Date): SensorReading {
  const hour = now.getHours() + now.getMinutes() / 60;
  const sf = solarFactor(hour);
  const voltage = parseFloat((12 + sf * 6 + noise(0.8)).toFixed(2));
  const current = parseFloat(Math.max(0, sf * 5 + noise(0.3)).toFixed(2));
  const power = parseFloat((voltage * current).toFixed(2));
  const temperature = parseFloat((25 + sf * 20 + noise(3)).toFixed(1));
  const irradiance = parseFloat(Math.max(0, sf * 1000 + noise(50)).toFixed(0));
  return {
    id: crypto.randomUUID(),
    panel_id: PANEL_ID,
    voltage,
    current,
    power,
    temperature,
    irradiance,
    created_at: now.toISOString(),
  };
}

function generateHistory(hours: number): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = Date.now();
  const intervalMs = (hours * 60 * 60 * 1000) / 48;
  for (let i = 48; i >= 0; i--) {
    const t = new Date(now - i * intervalMs);
    readings.push(generateReading(t));
  }
  return readings;
}

export function useSolarData() {
  const [history, setHistory] = useState<SensorReading[]>(() => generateHistory(24));
  const [latest, setLatest] = useState<SensorReading>(() => generateReading(new Date()));
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    const reading = generateReading(new Date());
    setLatest(reading);
    setHistory(prev => {
      const next = [...prev, reading];
      return next.slice(-50);
    });
  }, []);

  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(tick, 3000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive, tick]);

  const voltageHistory: ChartDataPoint[] = history.map(r => ({
    label: new Date(r.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    value: r.voltage,
    time: new Date(r.created_at),
  }));

  const currentHistory: ChartDataPoint[] = history.map(r => ({
    label: new Date(r.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    value: r.current,
    time: new Date(r.created_at),
  }));

  const powerHistory: ChartDataPoint[] = history.map(r => ({
    label: new Date(r.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    value: r.power,
    time: new Date(r.created_at),
  }));

  const totalEnergy = history.reduce((sum, r, i, arr) => {
    if (i === 0) return sum;
    const dtHours = (new Date(r.created_at).getTime() - new Date(arr[i - 1].created_at).getTime()) / 3_600_000;
    return sum + r.power * dtHours;
  }, 0);

  const efficiency = latest.irradiance > 0
    ? Math.min(100, (latest.power / (1 * latest.irradiance)) * 100)
    : 0;

  return {
    latest,
    history,
    voltageHistory,
    currentHistory,
    powerHistory,
    totalEnergy,
    efficiency,
    isLive,
    setIsLive,
  };
}
