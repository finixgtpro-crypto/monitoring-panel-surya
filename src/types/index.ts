export interface SensorReading {
  id: string;
  panel_id: string;
  voltage: number;
  current: number;
  power: number;
  temperature: number;
  irradiance: number;
  created_at: string;
}

export interface SolarPanel {
  id: string;
  name: string;
  location: string;
  capacity_wp: number;
  status: 'online' | 'offline' | 'warning';
  created_at: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  time: Date;
}
