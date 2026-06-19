import { useEffect, useState } from 'react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingDown, Leaf, Flame, Target, ArrowDown, ArrowUp } from 'lucide-react';
import './Dashboard.css';

const API = '/api/dashboard';

/* ── Small helpers ─────────────────────────────────── */
function StatCard({ label, value, unit, sub, trend, icon: Icon, accent }) {
  const isPos = trend < 0;
  return (
    <div className="db-stat card card-p" style={{ borderLeftColor: accent || 'var(--color-primary)' }}>
      <div className="db-stat__top">
        <span className="label-sm db-stat__label">{label}</span>
        <div className="db-stat__icon" style={{ color: accent || 'var(--color-primary)', background: `${accent || 'var(--color-primary)'}15` }}>
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
      <div className="db-stat__value">
        {value}<span className="db-stat__unit">{unit}</span>
      </div>
      <div className="db-stat__sub">
        {trend !== undefined && (
          <span className={`db-stat__trend db-stat__trend--${isPos ? 'good' : 'bad'}`}>
            {isPos ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
        {sub}
      </div>
    </div>
  );
}

/* ── Custom tooltip for chart ──────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="chart-tooltip__row" style={{ color: p.color }}>
          <span>{p.name}:</span>
          <strong>{p.value}t</strong>
        </div>
      ))}
    </div>
  );
}

/* ── Category chip colors ─────────────────────────── */
const catClass = { Transport: 'chip-transport', Diet: 'chip-diet', Energy: 'chip-energy', Shopping: 'chip-shopping' };

export default function Dashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state"><div className="spinner" /><p>Loading your dashboard…</p></div>;
  if (!data)   return <div className="loading-state"><p>Could not load data. Make sure the server is running.</p></div>;

  const { user, summary, monthlyEmissions, breakdown, recentActions } = data;
  const pctDone = summary.percentToTarget;

  return (
    <div className="dashboard">
      <div className="container">

        {/* ── Page header ─────────────────────────────── */}
        <div className="db-header animate-fade-up">
          <div>
            <span className="label-sm" style={{ color: 'var(--color-primary)' }}>Personal Dashboard</span>
            <h1 className="headline-md db-header__title">Welcome back, {user.name} 👋</h1>
            <p className="db-header__sub">
              <span className="chip chip-transport">{user.level}</span>&nbsp;
              <span style={{ color: 'var(--color-on-surface-variant)', fontSize: 14 }}>
                · 🔥 {user.streak}-day streak · {user.totalOffset}t CO₂ offset total
              </span>
            </p>
          </div>
          <div className="db-header__actions">
            <button className="btn btn-secondary btn-sm">Export Report</button>
            <button className="btn btn-primary btn-sm">
              <Leaf size={15} />Log Activity
            </button>
          </div>
        </div>

        {/* ── Stat cards ───────────────────────────────── */}
        <div className="db-stats animate-fade-up delay-100">
          <StatCard
            label="Current Footprint"
            value={summary.currentFootprint}
            unit="t CO₂e/yr"
            sub="vs 7.5t global avg"
            trend={summary.monthlyChange}
            icon={Leaf}
            accent="var(--color-primary)"
          />
          <StatCard
            label="Global Average"
            value={summary.globalAverage}
            unit="t CO₂e/yr"
            sub="World benchmark"
            icon={TrendingDown}
            accent="var(--color-tertiary)"
          />
          <StatCard
            label="Target Footprint"
            value={summary.targetFootprint}
            unit="t CO₂e/yr"
            sub="Sustainable goal"
            icon={Target}
            accent="#2b6954"
          />
          <StatCard
            label="Streak"
            value={user.streak}
            unit=" days"
            sub="Consecutive eco actions"
            icon={Flame}
            accent="#e67e22"
          />
        </div>

        {/* ── Progress to target ───────────────────────── */}
        <div className="card card-p db-progress animate-fade-up delay-200">
          <div className="db-progress__header">
            <div>
              <span className="label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Progress to Target</span>
              <div className="db-progress__title headline-md">{pctDone}% there</div>
            </div>
            <div className="db-progress__badge">
              <Leaf size={16} /> {summary.currentFootprint}t → {summary.targetFootprint}t
            </div>
          </div>
          <div className="progress-track" style={{ height: 14 }}>
            <div className="progress-fill" style={{ width: `${pctDone}%` }} />
          </div>
          <div className="db-progress__labels">
            <span>{summary.targetFootprint}t target</span>
            <span>{summary.globalAverage}t global avg</span>
            <span>You: {summary.currentFootprint}t</span>
          </div>
        </div>

        {/* ── Charts row ───────────────────────────────── */}
        <div className="db-charts animate-fade-up delay-300">
          {/* Area chart */}
          <div className="card card-p db-chart-card">
            <h3 className="headline-md db-chart-title">Monthly Emissions</h3>
            <p className="db-chart-sub">Your footprint vs. your personal target (tonnes CO₂e)</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyEmissions} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#006c49" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#006c49" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#006a61" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#006a61" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-outline)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-outline)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                <Area type="monotone" dataKey="emissions" name="Emissions" stroke="#006c49" strokeWidth={2.5} fill="url(#gradEmissions)" dot={false} activeDot={{ r: 5, fill: '#006c49' }} />
                <Area type="monotone" dataKey="target"    name="Target"    stroke="#006a61" strokeWidth={2} fill="url(#gradTarget)" strokeDasharray="5 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="card card-p db-chart-card">
            <h3 className="headline-md db-chart-title">Emissions by Category</h3>
            <p className="db-chart-sub">What's driving your footprint</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {breakdown.map(entry => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="db-legend">
              {breakdown.map(({ category, value, color, icon }) => (
                <div key={category} className="db-legend__item">
                  <div className="db-legend__dot" style={{ background: color }} />
                  <span className="db-legend__cat">{icon} {category}</span>
                  <span className="db-legend__val">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Actions ───────────────────────────── */}
        <div className="card db-recent animate-fade-up delay-400">
          <div className="db-recent__header card-p">
            <h3 className="headline-md">Recent Actions</h3>
            <button className="btn btn-ghost btn-sm">View all</button>
          </div>
          <div className="db-recent__list">
            {recentActions.map(action => (
              <div key={action.id} className="db-recent__item">
                <div className="db-recent__info">
                  <span className={`chip ${catClass[action.category] || ''}`}>{action.category}</span>
                  <span className="db-recent__title">{action.title}</span>
                </div>
                <div className="db-recent__meta">
                  <span className="db-recent__impact">
                    {action.impact}t CO₂e
                  </span>
                  <span className="db-recent__date">{action.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
