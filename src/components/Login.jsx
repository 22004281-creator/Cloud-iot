import React, { useState } from 'react';
import { setToken } from '../utils/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e){
    e.preventDefault();
    setBusy(true);
    try{
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if(!res.ok){
        const txt = await res.text();
        throw new Error(txt || 'Login failed');
      }
      const json = await res.json();
      if(json.token){
        setToken(json.token);
      }
      onLogin && onLogin(json.user || null);
    }catch(err){
      alert(err.message || 'Login error');
    }finally{
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm p-4 bg-card/60 glass-card rounded-xl flex items-center gap-3">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" className="px-3 py-2 rounded-md bg-card/30 text-sm" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" className="px-3 py-2 rounded-md bg-card/30 text-sm" />
      <button type="submit" disabled={busy} className="px-3 py-2 bg-primary rounded-md text-white text-sm">
        {busy ? 'Signing…' : 'Sign in'}
      </button>
    </form>
  );
}
