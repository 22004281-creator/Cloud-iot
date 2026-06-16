import React from 'react'
import clsx from 'clsx'

export default function SensorCard({ name, icon, value, rawValue, unit, color = 'primary' }) {
  let status = 'Normal'
  let statusColor = 'bg-success'
  if (name === 'Temperature' && typeof rawValue === 'number') {
    if (rawValue > 60) { status = 'Critical'; statusColor = 'bg-danger' }
    else if (rawValue > 45) { status = 'High'; statusColor = 'bg-warning' }
  }
  if (name === 'Motion') {
    if (rawValue) { status = 'Detected'; statusColor = 'bg-warning' } else { status = 'No Motion'; statusColor = 'bg-success' }
  }

  return (
    <div className="flex flex-col items-center justify-between p-6 rounded-xl glass-card hover:translate-y-[-6px] transition-transform duration-200" style={{ minHeight: 200 }}>
      <div className="flex flex-col items-center gap-3">
        <div className="text-4xl">{icon}</div>
        <div className="text-[20px] font-semibold text-slate-100">{name}</div>
        <div className="mt-2 text-[48px] font-extrabold text-white leading-none">{value}</div>
        <div className="mt-2 flex items-center gap-2">
          <span className={clsx('w-3 h-3 rounded-full', statusColor)} />
          <span className="text-sm text-slate-300">{status}</span>
        </div>
      </div>
    </div>
  )
}
