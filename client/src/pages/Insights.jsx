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
import { useAuth } from '../context/AuthContext';
import './Insights.css';

const GLOBAL_AVG       = 7.5;
const CITY_AVG         = 7.4;
const SUSTAINABLE_TARGET = 2.0;
const TOP_STEWARDS     = 3.1;

/* ── Insight type config ────────────────────────────── */
const insightConfig = {
  opportunity: { icon: Lightbulb,   color: '#006c49', bg: 'rgba(0,108,73,0.08)',    label: 'Opportunity'  },
  trend:       { icon: TrendingDown, color: '#006a61', bg: 'rgba(0,106,97,0.08)',    label: 'Trend'        },
  alert:       { icon: AlertCircle,  color: '#d97706', bg: 'rgba(217,119,6,0.08)',   label: 'Alert'        },
  achievement: { icon: Trophy,       color: '#7c3aed', bg: 'rgba(124,58,237,0.08)',  label: 'Achievement'  },
};

/* ── Generate dynamic insights from user progress ─── */
function generateInsights(completedActions, totalOffset, currentFootprint) {
  const insights = [];

  if (totalOffset >= 0.5) {
    insights.push({
      id: 'ach-offset', type: 'achievement',
      title: `${totalOffset.toFixed(1)}t CO₂ Offset!`,
      description: `You've offset ${totalOffset.toFixed(1)} tonnes of CO₂ — equivalent to planting roughly ${Math.round(totalOffset * 50)} trees. Keep it up!`,
      impact: 0, difficulty: null, category: 'Milestone', priority: 'low',
    });
  }

  if (currentFootprint < GLOBAL_AVG) {
    const pctBelow = Math.round((1 - currentFootprint / GLOBAL_AVG) * 100);
    insights.push({
      id: 'trend-below', type: 'trend',
      title: `${pctBelow}% Below Global Average`,
      description: `Your estimated footprint of ${currentFootprint}t CO₂e/yr is ${pctBelow}% below the global average of ${GLOBAL_AVG}t. Your actions are making a measurable difference.`,
      impact: 0, difficulty: 'Easy', category: 'Comparison', priority: 'medium',
    });
  }

  const categories = [...new Set(completedActions.map(a => a.category))];
  if (categories.length < 3) {
    const missing = ['Transport', 'Diet', 'Energy', 'Shopping'].find(c => !categories.includes(c));
    if (missing) {
      insights.push({
        id: 'opp-category', type: 'opportunity',
        title: `Unlock ${missing} Savings`,
        description: `You haven't completed any ${missing} actions yet. This category could significantly reduce your footprint — explore what's available.`,
        impact: missing === 'Transport' ? 1.1 : missing === 'Energy' ? 1.0 : 0.4,
        difficulty: 'Easy', category: missing, priority: 'high',
      });
    }
  }

  if (completedActions.length >= 3) {
    insights.push({
      id: 'ach-streak', type: 'achievement',
      title: `${completedActions.length} Actions Completed`,
      description: `You've completed ${completedActions.length} eco-actions. Consistency is the key to long-term impact — share your progress to inspire others.`,
      impact: 0, difficulty: null, category: 'Milestone', priority: 'low',
    });
  }

  return insights;
}

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

/* ── Eco score from offset ───────────────────────────── */
function ecoScore(totalOffset) {
  return Math.min(Math.round(30 + (totalOffset / (GLOBAL_AVG - SUSTAINABLE_TARGET)) * 70), 100);
}

/* ── Empty state ─────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="insights">
      <div className="container">
        <div className="ins-header animate-fade-up">
          <div>
            <span className="label-sm" style={{ color: 'var(--color-primary)' }}>AI Analysis</span>
            <h1 className="headline-md ins-header__title">Your Sustainability Insights</h1>
            <p className="ins-header__sub">Complete actions to unlock personalised insights.</p>
          </div>
        </div>
        <div className="card card-p ins-empty animate-fade-up delay-100">
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📊</div>
          <h2 className="headline-md">No data yet</h2>
          <p style={{ color: 'var(--color-on-surface-variant)', marginTop: 8, marginBottom: 24 }}>
            Start completing eco-actions and your insights — trends, comparisons, and AI
            recommendations — will appear here automatically.
          </p>
          <Link to="/actions" className="btn btn-primary">
            Browse Actions <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────── */
export default function Insights() {
  const { progress } = useAuth();
  const { completedActions } = progress;

  const [activeFilter, setFilter] = useState('all');

  if (!completedActions.length) return <EmptyState />;

  const totalOffset      = completedActions.reduce((s, a) => s + a.impact, 0);
  const currentFootprint = parseFloat(Math.max(GLOBAL_AVG - totalOffset, 1.0).toFixed(1));
  const score            = ecoScore(totalOffset);
  const insights         = generateInsights(completedActions, totalOffset, currentFootprint);

  const filters = ['all', 'opportunity', 'trend', 'alert', 'achievement'];
  const filteredInsights = activeFilter === 'all'
    ? insights
    : insights.filter(i => i.type === activeFilter);

  const comparisons = {
    user:              currentFootprint,
    cityAverage:       CITY_AVG,
    nationalAverage:   GLOBAL_AVG,
    sustainableTarget: SUSTAINABLE_TARGET,
    topStewards:       TOP_STEWARDS,
  };
  const compMax = Math.max(...Object.values(comparisons)) * 1.1;

  const pctBelowNational = ((1 - comparisons.user / comparisons.nationalAverage) * 100).toFixed(0);

  return (
    <div className="insights">
      <div className="container">

        {/* ── Page header ─────────────────────────────── */}
        <div className="ins-header animate-fade-up">
          <div>
            <span className="label-sm" style={{ color: 'var(--color-primary)' }}>AI Analysis</span>
            <h1 className="headline-md ins-header__title">Your Sustainability Insights</h1>
            <p className="ins-header__sub">
              Personalised recommendations based on your completed actions. Updated as you progress.
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
                  strokeDashoffset={`${34 * 2 * Math.PI * (1 - score / 100)}`}
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
                <span>{score}</span>
                <small>Eco Score</small>
              </div>
            </div>
          </div>
        </div>

        {/* ── Filter pills ─────────────────────────────── */}
        <div className="ins-filters animate-fade-up delay-100" role="group" aria-label="Filter insights">
          {filters.map(f => (
            <button
              key={f}
              type="button"
              className={`ins-filter-pill${activeFilter === f ? ' ins-filter-pill--active' : ''}`}
              onClick={() => setFilter(f)}
              aria-pressed={activeFilter === f}
            >
              {f === 'all' ? '✦ All' : insightConfig[f]?.label}
            </button>
          ))}
        </div>

        {/* ── Insight cards ─────────────────────────────── */}
        {filteredInsights.length === 0 ? (
          <div className="card card-p" style={{ textAlign: 'center', padding: 'var(--space-5)', marginBottom: 'var(--space-3)' }}>
            <p style={{ color: 'var(--color-on-surface-variant)' }}>
              No {activeFilter} insights yet — keep completing actions!
            </p>
          </div>
        ) : (
          <div className="ins-cards animate-fade-up delay-200">
            {filteredInsights.map((insight, i) => {
              const cfg  = insightConfig[insight.type];
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
                      <span className="chip" style={{ background: cfg?.bg, color: cfg?.color }}>{cfg?.label}</span>
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
        )}

        {/* ── Comparison panel ─────────────────────────── */}
        <div className="card card-p ins-comparison animate-fade-up delay-300">
          <div className="ins-comparison__header">
            <div>
              <h3 className="headline-md" style={{ fontSize: '1.05rem' }}>How You Compare</h3>
              <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', marginTop: 4 }}>
                Your footprint in context (tonnes CO₂e / year)
              </p>
            </div>
            <div className="ins-comparison__badge">
              <Flame size={14} />
              {pctBelowNational > 0 ? `${pctBelowNational}% below average` : 'Keep going!'}
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
              {comparisons.user <= comparisons.cityAverage
                ? "You're already ahead of the city average — keep going to reach the sustainable target."
                : "Complete more actions to get below the city average."}
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
