import React from 'react'

export default function MetricCard({ icon, label, value, status }) {
  const toneColor = status && status.tone === 'danger' ? 'var(--danger)' : status && status.tone === 'warning' ? 'var(--warning)' : 'var(--success)'

  return (
    <div className="metric-card glass-card rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[140px]">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-[20px] font-semibold">{label}</div>
      <div className="text-[48px] font-extrabold mt-2">{value}</div>
      {status && <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
        <span style={{ width: 10, height: 10, borderRadius: 999, background: toneColor, display: 'inline-block' }} />
        <span>{status.text}</span>
      </div>}
    </div>
  )
}
