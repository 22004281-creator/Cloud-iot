import React from 'react'
import MetricCard from './MetricCard'

export default function MetricsBar({ metrics = [] }) {
  const metricWithStatus = metrics.map(m => {
    let status = { text: 'Normal', tone: 'success' }
    if (m.key === 'temperature' && typeof m.raw === 'number') {
      if (m.raw > 60) status = { text: 'Critical', tone: 'danger' }
      else if (m.raw > 45) status = { text: 'High', tone: 'warning' }
    }
    if (m.key === 'motion') {
      if (m.raw) status = { text: 'Detected', tone: 'warning' }
      else status = { text: 'No motion', tone: 'success' }
    }
    return { ...m, status }
  })

  return (
    <div className="glass-card p-4 rounded-xl shadow-soft">
      <div className="flex gap-4 items-stretch w-full overflow-x-auto">
        {metricWithStatus.map((m) => (
          <div key={m.key} className="flex-1 min-w-[160px]">
            <MetricCard icon={m.icon} label={m.label} value={m.value} status={m.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
