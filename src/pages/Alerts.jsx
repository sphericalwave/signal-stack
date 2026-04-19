import { useState } from 'react';
import { zscoreIndicators } from '../data/mockData';
import SignalBadge from '../components/SignalBadge';

const defaultAlerts = [
  { id: 1, indicator: 'MVRV ratio',       threshold: 2.5, condition: 'above', method: 'push', active: true  },
  { id: 2, indicator: 'Global M2 (90d lag)', threshold: -1, condition: 'below', method: 'email', active: true },
  { id: 3, indicator: 'Fear & Greed index', threshold: -2, condition: 'below', method: 'push', active: false },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(defaultAlerts);
  const [form, setForm] = useState({ indicator: zscoreIndicators[0].name, threshold: 1.5, condition: 'above', method: 'push' });

  function addAlert(e) {
    e.preventDefault();
    setAlerts((prev) => [...prev, { ...form, id: Date.now(), threshold: parseFloat(form.threshold), active: true }]);
  }

  function removeAlert(id) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-base font-semibold text-white">Alert Configuration</h1>

      {/* Existing alerts */}
      <div className="space-y-2">
        {alerts.map((a) => (
          <div key={a.id} className="bg-[#111318] border border-white/10 rounded-lg px-4 py-3 flex items-center gap-4">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.active ? 'bg-green-400' : 'bg-slate-600'}`} />
            <span className="text-xs text-slate-300 flex-1">{a.indicator}</span>
            <span className="font-mono text-xs text-slate-400">
              {a.condition} <span className={a.condition === 'above' ? 'text-green-400' : 'text-red-400'}>
                {a.threshold > 0 ? '+' : ''}{a.threshold}σ
              </span>
            </span>
            <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded">{a.method}</span>
            <button onClick={() => removeAlert(a.id)} className="text-[10px] text-slate-600 hover:text-red-400 transition-colors ml-2">
              remove
            </button>
          </div>
        ))}
      </div>

      {/* Add alert form */}
      <form onSubmit={addAlert} className="bg-[#111318] border border-white/10 rounded-lg p-4 space-y-4">
        <h2 className="text-xs font-semibold text-slate-300">Add Alert</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Indicator</label>
            <select
              value={form.indicator}
              onChange={(e) => setForm((f) => ({ ...f, indicator: e.target.value }))}
              className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-green-400/50"
            >
              {zscoreIndicators.map((i) => <option key={i.name} value={i.name}>{i.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Condition</label>
            <select
              value={form.condition}
              onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
              className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-green-400/50"
            >
              <option value="above">above</option>
              <option value="below">below</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Z-score threshold</label>
            <input
              type="number"
              step="0.1"
              value={form.threshold}
              onChange={(e) => setForm((f) => ({ ...f, threshold: e.target.value }))}
              className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-green-400/50"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Notify via</label>
            <select
              value={form.method}
              onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
              className="bg-black/30 border border-white/10 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-green-400/50"
            >
              <option value="push">Push</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="text-xs font-semibold text-black bg-green-400 hover:bg-green-300 transition-colors px-4 py-1.5 rounded"
        >
          Add Alert
        </button>
      </form>
    </div>
  );
}
