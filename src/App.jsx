import React, { useEffect, useState, useRef } from 'react'
import MetricsBar from './components/MetricsBar'
import TelemetryChart from './components/TelemetryChart'
import TelemetryTable from './components/TelemetryTable'
import Login from './components/Login'
import DeviceTokenControl from './components/DeviceTokenControl'
import { getToken, clearToken } from './utils/auth'
import { FiRefreshCw } from 'react-icons/fi'

const API_BASE = '' // same-origin; set to full URL if you host API elsewhere
const TELEMETRY_URL = `${API_BASE}/api/telemetry?limit=40`
const POLL_MS = 5000

export default function App() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [user, setUser] = useState(null)
  const pollRef = useRef()

  // check token and /api/auth/me on mount
  useEffect(() => {
    const t = getToken()
    if (t) {
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${t}` } })
          if (res.ok) {
            const json = await res.json()
            setUser(json.user || null)
          } else {
            clearToken()
            setUser(null)
          }
        } catch (_) { clearToken(); setUser(null) }
      })()
    }
  }, [])

  async function fetchTelemetry() {
    setLoading(true)
    try {
      const token = getToken()
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await fetch(TELEMETRY_URL, { headers })
      if (res.status === 401) {
        // unauthorized; clear data and show login
        setRecords([])
      } else {
        const json = await res.json()
        const recs = Array.isArray(json.records) ? json.records : (Array.isArray(json) ? json : [])
        setRecords(recs)
        setLastUpdate(new Date())
      }
    } catch (e) {
      console.error('Failed to load telemetry', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTelemetry()
    pollRef.current = setInterval(fetchTelemetry, POLL_MS)
    return () => clearInterval(pollRef.current)
  }, [])

  const latest = records && records.length ? records[0] : null

  const sensors = {
    temperature: latest && typeof latest.temperature === 'number' ? latest.temperature : null,
    humidity: latest && typeof latest.humidity === 'number' ? latest.humidity : null,
    motion: latest && (typeof latest.motion === 'number' ? latest.motion : (latest && latest.motion ? 1 : 0)),
    distance: latest && typeof latest.distance === 'number' ? latest.distance : null,
    light: latest && typeof latest.light === 'number' ? latest.light : null
  }

  return (
    <div className="app-root min-h-screen p-6 bg-bg text-slate-100">
      <div className="container mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">IoT Monitoring Dashboard</h1>
            <p className="text-sm text-slate-400">Demo layout — logic unchanged, live telemetry</p>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="live-dot" />
                  <span className="text-sm text-slate-400">{lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : 'No data yet'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-200">Hi, {user.email || user.name || 'user'}</div>
                  <button onClick={() => { clearToken(); setUser(null); }} className="px-3 py-2 rounded-xl bg-card hover:bg-opacity-90 glass-card text-sm">Logout</button>
                </div>
              </>
            ) : (
              <Login onLogin={(u) => { setUser(u); fetchTelemetry() }} />
            )}
            <button onClick={() => fetchTelemetry()} title="Refresh" className="px-3 py-2 rounded-xl bg-card/60 hover:bg-opacity-90 glass-card flex items-center gap-2 text-sm">
              <FiRefreshCw className="text-primary" />
              <span className="text-slate-200">Refresh</span>
            </button>
          </div>
        </header>

        {/* METRICS BAR */}
        <section className="mb-6">
          <MetricsBar
            metrics={[
              { key: 'temperature', label: 'Temp', icon: '🌡', value: sensors.temperature !== null ? `${sensors.temperature.toFixed(1)}°C` : '--', raw: sensors.temperature },
              { key: 'humidity', label: 'Humidity', icon: '💧', value: sensors.humidity !== null ? `${Math.round(sensors.humidity)}%` : '--', raw: sensors.humidity },
              { key: 'motion', label: 'Motion', icon: '🚶', value: sensors.motion ? 'Detected' : 'No', raw: sensors.motion },
              { key: 'distance', label: 'Distance', icon: '📏', value: sensors.distance !== null ? `${sensors.distance.toFixed(1)} cm` : '--', raw: sensors.distance },
              { key: 'light', label: 'Light', icon: '💡', value: sensors.light !== null ? `${sensors.light} lx` : '--', raw: sensors.light }
            ]}
          />
        </section>

        {/* Chart */}
        <section className="mb-6 glass-card p-4 rounded-xl shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">BIG TELEMETRY CHART</h2>
            <div className="text-sm text-slate-400">{records.length} readings</div>
          </div>
          <div className="chart-fixed-height bg-card rounded-md p-3">
            <TelemetryChart records={records} />
          </div>
        </section>

        {/* Device Token control (visible when logged in) */}
        {user && (
          <section className="mb-6">
            <DeviceTokenControl />
          </section>
        )}

        {/* Table */}
        <section className="glass-card p-4 rounded-xl shadow-soft">
          <h2 className="text-lg font-semibold mb-3">DEVICE HISTORY TABLE</h2>
          <TelemetryTable records={records} />
        </section>
      </div>
    </div>
  )
}
