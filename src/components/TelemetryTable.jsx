import React from 'react'

export default function TelemetryTable({ records = [] }) {
  return (
    <div className="table-wrap">
      <table className="table min-w-full text-sm">
        <thead className="bg-card/60 text-slate-300">
          <tr>
            <th>Time</th>
            <th>Device</th>
            <th>Temperature</th>
            <th>Humidity</th>
            <th>Motion</th>
            <th>Distance</th>
            <th>Light</th>
          </tr>
        </thead>
        <tbody>
          {records.length===0 ? (
            <tr><td colSpan={7} style={{padding:'20px',textAlign:'center',color:'#9aa6bd'}}>No telemetry records yet.</td></tr>
          ) : records.map((r, idx) => (
            <tr key={idx} className={idx%2===0 ? 'bg-white/2' : ''}>
              <td>{r.timestamp ? new Date(r.timestamp).toLocaleString() : (r.timestampMillis ? new Date(r.timestampMillis).toLocaleString() : '—')}</td>
              <td>{r.deviceId || '—'}</td>
              <td>{typeof r.temperature === 'number' ? `${r.temperature} °C` : '—'}</td>
              <td>{typeof r.humidity === 'number' ? `${r.humidity} %` : '—'}</td>
              <td>{(r.motion === 1 || r.motion === true) ? 'Detected' : 'No'}</td>
              <td>{typeof r.distance === 'number' ? `${r.distance} cm` : '—'}</td>
              <td>{typeof r.light === 'number' ? `${r.light}` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
