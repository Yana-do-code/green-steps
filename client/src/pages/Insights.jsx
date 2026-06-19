import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import {
  Lightbulb, TrendingDown, AlertCircle, Trophy,
  ChevronRight, Leaf, Flame, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Insights.css';

const API = '/api/insights';

/* ── Insight type config ────────────────────────────── */
const insightConfig = {
  opportunity: { icon: Lightbulb, color: '#006c49', bg: 'rgba(0,108,73,0.08)', label: 'Opportunity'  },
  trend:       { icon: TrendingDown, color: '#006a61', bg: 'rgba(0,106,97,0.08)', label: 'Trend'     },
  alert:       { icon: AlertCircle, color: '#d97706', bg: 'rgba(217,119,6,0.08)',  label: 'Alert'    },
  achievement: { icon: Trophy,      color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', label: 'Achievement'},
};

/* ── Comparison bar ──────────────────────────────────── */
function CompBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="comp-bar">
      <div className="comp-bar__meta">
        <span className="comp-bar__label">{label}</span>
        <span className="comp-bar__value">{value}t</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

/* ── Custom tooltip ──────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="chart-tooltip__row" style={{ color: p.color }}>
          <span>{p.name}:</span><strong>{p.value}t</strong>
        </div>
      ))}
    </div>
  );
}

export default function Insights() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setFilter] = useState('all');

  useEffect(() => {
    fetch(API)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-state">
      <div className="spinner" />
      <p>Analysing your data…</p>
    </div>
  );
  if (!data) return (
    <div className="loading-state">
      <p>Could not load insights. Make sure the server is running on port 5000.</p>
    </div>
  );

  const { aiInsights, comparisons, weeklyTrend, categoryTrend } = data;

  const filters = ['all', 'opportunity', 'trend', 'alert', 'achievement'];
  const filteredInsights = activeFilter === 'all'
    ? aiInsights
    : aiInsights.filter(i => i.type === activeFilter);

  const compMax = Math.max(...Object.values(comparisons)) * 1.1;

  return (
    <div className="insights">
      <div className="container">

        {/* ── Page header ─────────────────────────────── */}
        <div className="ins-header animate-fade-up">
          <div>
            <span className="label-sm" style={{ color: 'var(--color-primary)' }}>AI Analysis</span>
            <h1 className="headline-md ins-header__title">Your Sustainability Insights</h1>
            <p className="ins-header__sub">
              Personalised recommendations powered by your activity data.
              Updated weekly.
            </p>
          </div>
          <div className="ins-header__score">
            <div className="ins-score-ring">
              <svg viewBox="0 0 80 80" width="80" height="80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="var(--color-outline-variant)" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="34"
                  fill="none"
                  stroke="url(#ringGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${34 * 2 * Math.PI}`}
                  strokeDashoffset={`${34 * 2 * Math.PI * (1 - 0.72)}`}
                  transform="rotate(-90 40 40)"
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-tertiary)" />
                    <stop offset="100%" stopColor="var(--color-primary)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="ins-score-ring__label">
                <span>72</span>
                <small>Eco Score</small>
              </div>
            </div>
          </div>
        </div>

        {/* ── Filter pills ─────────────────────────────── */}
        <div className="ins-filters animate-fade-up delay-100">
          {filters.map(f => (
            <button
              key={f}
              className={`ins-filter-pill${activeFilter === f ? ' ins-filter-pill--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '✦ All' : insightConfig[f]?.label}
            </button>
          ))}
        </div>

        {/* ── AI Insight cards ─────────────────────────── */}
        <div className="ins-cards animate-fade-up delay-200">
          {filteredInsights.map((insight, i) => {
            const cfg = insightConfig[insight.type];
            const Icon = cfg?.icon || Lightbulb;
            return (
              <div
                key={insight.id}
                className={`ins-card card card-p ins-card--${insight.priority}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="ins-card__top">
                  <div className="ins-card__icon" style={{ background: cfg?.bg, color: cfg?.color }}>
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <div className="ins-card__badges">
                    <span className="chip" style={{ background: cfg?.bg, color: cfg?.color }}>
                      {cfg?.label}
                    </span>
                    <span className="chip chip-transport">{insight.category}</span>
                  </div>
                </div>
                <h3 className="ins-card__title">{insight.title}</h3>
                <p className="ins-card__desc">{insight.description}</p>
                {insight.impact !== 0 && (
                  <div className="ins-card__impact">
                    <TrendingDown size={14} />
                    Potential reduction: <strong>{Math.abs(insight.impact)}t CO₂e/yr</strong>
                  </div>
                )}
                {insight.difficulty && (
                  <div className="ins-card__footer">
                    <span className="ins-card__diff">
                      {insight.difficulty === 'Easy' ? '🟢' : insight.difficulty === 'Medium' ? '🟡' : '🔴'}
                      &nbsp;{insight.difficulty} change
                    </span>
                    <Link to="/actions" className="btn btn-ghost btn-sm ins-card__cta">
                      Take action <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Charts grid ──────────────────────────────── */}
        <div className="ins-charts animate-fade-up delay-300">

          {/* Weekly trend vs average */}
          <div className="card card-p ins-chart-card">
            <div className="ins-chart-header">
              <div>
                <h3 className="headline-md" style={{ fontSize: '1.05rem' }}>Weekly Trend</h3>
                <p className="ins-chart-sub">Your emissions vs. community average (t CO₂e)</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weeklyTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--color-outline)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-outline)' }} axisLine={false} tickLine={false} domain={[4, 9]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                <ReferenceLine y={2} stroke="#d97706" strokeDasharray="4 4" label={{ value: '2t goal', position: 'right', fontSize: 11, fill: '#d97706' }} />
                <Line type="monotone" dataKey="user"    name="You"     stroke="var(--color-primary)"  strokeWidth={2.5} dot={{ r: 4, fill: 'var(--color-primary)' }} />
                <Line type="monotone" dataKey="average" name="Avg"     stroke="var(--color-outline)"  strokeWidth={2} strokeDasharray="5 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category trend */}
          <div className="card card-p ins-chart-card">
            <div className="ins-chart-header">
              <div>
                <h3 className="headline-md" style={{ fontSize: '1.05rem' }}>Category Breakdown Trend</h3>
                <p className="ins-chart-sub">Monthly emissions by source (t CO₂e)</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-outline)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-outline)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                <Bar dataKey="transport" name="Transport" fill="#006c49" radius={[4,4,0,0]} stackId="a" />
                <Bar dataKey="energy"    name="Energy"    fill="#10b981" radius={[0,0,0,0]} stackId="a" />
                <Bar dataKey="diet"      name="Diet"      fill="#006a61" radius={[0,0,0,0]} stackId="a" />
                <Bar dataKey="other"     name="Other"     fill="#adedd3" radius={[4,4,0,0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Comparison panel ─────────────────────────── */}
        <div className="card card-p ins-comparison animate-fade-up delay-400">
          <div className="ins-comparison__header">
            <div>
              <h3 className="headline-md" style={{ fontSize: '1.05rem' }}>How You Compare</h3>
              <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', marginTop: 4 }}>
                Your footprint in context (tonnes CO₂e / year)
              </p>
            </div>
            <div className="ins-comparison__badge">
              <Flame size={14} />
              {((1 - comparisons.user / comparisons.nationalAverage) * 100).toFixed(0)}% below average
            </div>
          </div>
          <div className="ins-comparison__bars">
            <CompBar label="Sustainable Target" value={comparisons.sustainableTarget} max={compMax} color="#10b981" />
            <CompBar label="Top Stewards"        value={comparisons.topStewards}        max={compMax} color="#006c49" />
            <CompBar label="You"                 value={comparisons.user}               max={compMax} color="var(--color-primary)" />
            <CompBar label="City Average"        value={comparisons.cityAverage}        max={compMax} color="#d97706" />
            <CompBar label="National Average"    value={comparisons.nationalAverage}    max={compMax} color="#ef4444" />
          </div>
          <div className="ins-comparison__cta">
            <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)' }}>
              You're already ahead — follow our personalised actions to reach the sustainable target.
            </p>
            <Link to="/actions" className="btn btn-primary btn-sm">
              Explore Actions <ArrowRight size={15} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
