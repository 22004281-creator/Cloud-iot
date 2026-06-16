import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function TelemetryChart({ records = [] }) {
  const ordered = useMemo(() => [...records].reverse(), [records])
  const labels = ordered.map(r => {
    if (r.timestamp) return new Date(r.timestamp).toLocaleTimeString()
    if (r.timestampMillis) return new Date(r.timestampMillis).toLocaleTimeString()
    return ''
  })

  const keys = ['temperature','humidity','distance','light']
  const palette = {
    temperature: '#f59e0b',
    humidity: '#06b6d4',
    distance: '#a78bfa',
    light: '#3b82f6'
  }

  const datasets = keys.map(k => ({
    label: k,
    data: ordered.map(r => (typeof r[k] === 'number' ? r[k] : null)),
    borderColor: palette[k],
    backgroundColor: palette[k],
    tension: 0.3,
    spanGaps: true,
    pointRadius: 3,
    borderWidth: 2
  }))

  const data = { labels, datasets }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#cbd5e1', padding: 16, boxWidth: 12 }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255,255,255,0.02)' }
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(255,255,255,0.02)' }
      }
    }
  }

  return <Line data={data} options={options} />
}
