
/*
  # Solar Panel Monitoring System - Database Schema

  ## Description
  Creates the database tables for the IoT-based Solar Panel Voltage and Current
  Monitoring System using ESP32.

  ## New Tables

  ### `solar_panels`
  Stores metadata for each solar panel unit being monitored.
  - `id` (uuid, primary key)
  - `name` (text) - Panel name/identifier
  - `location` (text) - Physical installation location
  - `capacity_wp` (numeric) - Panel capacity in Watt-peak
  - `status` (text) - 'online', 'offline', or 'warning'
  - `created_at` (timestamptz)

  ### `sensor_readings`
  Stores time-series sensor data transmitted by ESP32 devices.
  - `id` (uuid, primary key)
  - `panel_id` (uuid, FK to solar_panels)
  - `voltage` (numeric) - Panel voltage in Volts
  - `current` (numeric) - Panel current in Amperes
  - `power` (numeric) - Calculated power in Watts
  - `temperature` (numeric) - Panel temperature in Celsius
  - `irradiance` (numeric) - Solar irradiance in W/m²
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Authenticated users can read all data
  - Service role (ESP32 via edge function) handles inserts

  ## Seed Data
  - 1 default solar panel
  - 48 hours of simulated historical readings
*/

CREATE TABLE IF NOT EXISTS solar_panels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Panel Surya 1',
  location text NOT NULL DEFAULT 'Atap Gedung A',
  capacity_wp numeric NOT NULL DEFAULT 100,
  status text NOT NULL DEFAULT 'online',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  panel_id uuid REFERENCES solar_panels(id) ON DELETE CASCADE,
  voltage numeric NOT NULL DEFAULT 0,
  current numeric NOT NULL DEFAULT 0,
  power numeric NOT NULL DEFAULT 0,
  temperature numeric NOT NULL DEFAULT 25,
  irradiance numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sensor_readings_panel_id ON sensor_readings(panel_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_created_at ON sensor_readings(created_at DESC);

ALTER TABLE solar_panels ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read solar panels"
  ON solar_panels FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can read sensor readings"
  ON sensor_readings FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Service role can insert panels"
  ON solar_panels FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update panels"
  ON solar_panels FOR UPDATE
  TO service_role
  USING (id IS NOT NULL)
  WITH CHECK (id IS NOT NULL);

CREATE POLICY "Service role can insert readings"
  ON sensor_readings FOR INSERT
  TO service_role
  WITH CHECK (panel_id IS NOT NULL);

INSERT INTO solar_panels (id, name, location, capacity_wp, status)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Panel Surya ESP32-01', 'Atap Laboratorium IoT', 100, 'online')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sensor_readings (panel_id, voltage, current, power, temperature, irradiance, created_at)
SELECT
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  CASE
    WHEN extract(hour from t) BETWEEN 6 AND 18
    THEN round((12 + 6 * GREATEST(0, sin((extract(hour from t) - 6) * pi() / 12)) + (random() - 0.5) * 0.8)::numeric, 2)
    ELSE round((11.5 + (random() - 0.5) * 0.3)::numeric, 2)
  END,
  CASE
    WHEN extract(hour from t) BETWEEN 6 AND 18
    THEN round((GREATEST(0, 5 * sin((extract(hour from t) - 6) * pi() / 12)) + (random() - 0.5) * 0.3)::numeric, 2)
    ELSE 0
  END,
  CASE
    WHEN extract(hour from t) BETWEEN 6 AND 18
    THEN round(((12 + 6 * GREATEST(0, sin((extract(hour from t) - 6) * pi() / 12))) * GREATEST(0, 5 * sin((extract(hour from t) - 6) * pi() / 12)))::numeric, 2)
    ELSE 0
  END,
  round((25 + 20 * GREATEST(0, sin((extract(hour from t) - 6) * pi() / 12)) + (random() - 0.5) * 3)::numeric, 1),
  round((GREATEST(0, 1000 * sin((extract(hour from t) - 6) * pi() / 12)) + (random() - 0.5) * 50)::numeric, 0),
  t
FROM generate_series(
  now() - interval '48 hours',
  now(),
  interval '30 minutes'
) AS t
ON CONFLICT DO NOTHING;
