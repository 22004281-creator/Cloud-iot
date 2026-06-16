import React, { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';

export default function DeviceTokenControl(){
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load(){
    setLoading(true);
    try{
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/telemetry/token', { headers });
      if(!res.ok) throw new Error('Failed to load token');
      const json = await res.json();
      setInfo(json);
    }catch(e){
      console.warn(e);
      setInfo(null);
    }finally{ setLoading(false); }
  }

  async function rotate(){
    setLoading(true);
    try{
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/telemetry/token', { method: 'POST', headers });
      if(!res.ok) throw new Error('Rotate failed');
      const json = await res.json();
      setInfo(json);
    }catch(e){
      alert(e.message || 'Rotate failed');
    }finally{ setLoading(false); }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div className="glass-card p-4 rounded-xl">
      <h3 className="font-semibold mb-2">Device Token</h3>
      {loading && <div className="muted">Loading…</div>}
      {!loading && !info && <div className="muted">No token info available (unauthenticated?)</div>}
      {info && (
        <div className="space-y-2">
          <div><strong>Broker:</strong> <span className="muted">{info.mqttBroker || '—'}</span></div>
          <div><strong>Topic:</strong> <span className="muted">{info.mqttTopic || '—'}</span></div>
          <div><strong>Device Token:</strong>
            <div className="mt-1 flex gap-2">
              <input className="p-2 bg-card/30 rounded-md flex-1" readOnly value={info.deviceToken || ''} />
              <button onClick={()=>{ navigator.clipboard.writeText(info.deviceToken||''); }} className="px-3 bg-primary rounded-md text-white">Copy</button>
            </div>
          </div>
          <div className="pt-2">
            <button onClick={rotate} className="px-3 py-2 bg-warning rounded-md text-black">Rotate</button>
          </div>
        </div>
      )}
    </div>
  );
}
