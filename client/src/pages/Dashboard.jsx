import { useMemo, memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { TrendingDown, Leaf, Flame, Target, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import actionsData from '../data/actions';
import PropTypes from 'prop-types';
import { getRecommendations, getContextualMessage } from '../utils/recommendations';
import { GLOBAL_AVG_FOOTPRINT as GLOBAL_AVG } from '../utils/constants';
import './Dashboard.css';

/* ── Constants ─────────────────────────────────────────────── */
const TARGET_FOOTPRINT = 4.0;

const CAT_COLORS = {
  Transport: '#3b82f6',
  Diet:      '#f59e0b',
  Energy:    '#10b981',
  Shopping:  '#8b5cf6',
};
const CAT_ICONS = { Transport: '🚗', Diet: '🥗', Energy: '⚡', Shopping: '🛍️' };
const catClass   = { Transport: 'chip-transport', Diet: 'chip-diet', Energy: 'chip-energy', Shopping: 'chip-shopping' };

/* ── Helpers ────────────────────────────────────────────────── */
function computeLevel(offset) {
  if (offset >= 3)   return 'Eco Hero';
  if (offset >= 1.5) return 'Eco Champion';
  if (offset >= 0.5) return 'Eco Steward';
  if (offset >  0)   return 'Eco Aware';
  return 'Eco Starter';
}

function computeStreak(completedActions) {
  if (!completedActions.length) return 0;
  const dates = [...new Set(completedActions.map(a => a.completedAt))].sort();
  const today  = new Date().toISOString().split('T')[0];
  let streak = 0;
  let check  = new Date(today);
  while (true) {
    const d = check.toISOString().split('T')[0];
    if (dates.includes(d)) { streak++; check.setDate(check.getDate() - 1); }
    else break;
  }
  return Math.max(streak, 1);
}

function computeBreakdown(completedActions) {
  const totals = {};
  completedActions.forEach(a => {
    totals[a.category] = (totals[a.category] || 0) + a.impact;
  });
  const grand = Object.values(totals).reduce((s, v) => s + v, 0);
  return Object.entries(totals).map(([category, value]) => ({
    category,
    value: grand > 0 ? Math.round((value / grand) * 100) : 0,
    color: CAT_COLORS[category] || '#adedd3',
    icon:  CAT_ICONS[category]  || '♻️',
  }));
}

function computeSavingsTimeline(completedActions) {
  const sorted = [...completedActions].sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
  let running = 0;
  return sorted.map(a => {
    running += a.impact;
    return {
      date:  new Date(a.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      saved: parseFloat(running.toFixed(2)),
    };
  });
}

/* ── Sub-components ─────────────────────────────────────────── */
function StatCard({ label, value, unit, sub, icon: Icon, accent }) {
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
      <div className="db-stat__sub">{sub}</div>
    </div>
  );
}

StatCard.propTypes = {
  label:  PropTypes.string.isRequired,
  value:  PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit:   PropTypes.string.isRequired,
  sub:    PropTypes.string.isRequired,
  icon:   PropTypes.elementType.isRequired,
  accent: PropTypes.string,
};

const CustomTooltip = memo(function CustomTooltip({ active, payload, label }) {
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
});

CustomTooltip.propTypes = {
  active:  PropTypes.bool,
  payload: PropTypes.array,
  label:   PropTypes.string,
};

/* ── Onboarding empty state ─────────────────────────────────── */
const OnboardingState = memo(function OnboardingState({ name }) {
  return (
    <div className="dashboard">
      <div className="container">
        <div className="db-header animate-fade-up">
          <div>
            <span className="label-sm" style={{ color: 'var(--color-primary)' }}>Personal Dashboard</span>
            <h1 className="headline-md db-header__title">Welcome, {name} 👋</h1>
            <p style={{ color: 'var(--color-on-surface-variant)', marginTop: 4 }}>
              Your journey starts here. Complete your first action to see your impact.
            </p>
          </div>
        </div>

        <div className="card card-p db-onboarding animate-fade-up delay-100">
          <div className="db-onboarding__icon">🌱</div>
          <h2 className="headline-md">No actions logged yet</h2>
          <p style={{ color: 'var(--color-on-surface-variant)', marginTop: 8, marginBottom: 24 }}>
            Head to the Action Library and log what you did today. Come back daily — your
            dashboard will track your CO₂ savings, streak, and progress toward the 4t target.
          </p>
          <Link to="/actions" className="btn btn-primary">
            Browse Actions <ArrowRight size={16} />
          </Link>
        </div>

        <div className="db-stats animate-fade-up delay-200">
          <StatCard label="CO₂ Saved"        value="0"   unit="t"           sub="Complete actions to start saving" icon={Leaf}        accent="var(--color-primary)" />
          <StatCard label="Current Footprint" value={GLOBAL_AVG} unit="t CO₂e/yr"  sub="Based on global average"          icon={TrendingDown} accent="var(--color-tertiary)" />
          <StatCard label="Target Footprint"  value={TARGET_FOOTPRINT}   unit="t CO₂e/yr"  sub="Sustainable goal"                 icon={Target}      accent="#2b6954" />
          <StatCard label="Streak"            value="0"   unit=" days"       sub="Start your streak today"         icon={Flame}       accent="#e67e22" />
        </div>
      </div>
    </div>
  );
});

OnboardingState.propTypes = {
  name: PropTypes.string.isRequired,
};

/* ── Main Dashboard ─────────────────────────────────────────── */
export default function Dashboard() {
  const { user: authUser, progress, updateProgress } = useAuth();
  const { completedActions } = progress;

  const quickLog = (action) => {
    const today = new Date().toISOString().split('T')[0];
    updateProgress(prev => {
      if (prev.completedActions.some(a => a.id === action.id && a.completedAt === today))
        return prev;
      return {
        ...prev,
        completedActions: [...prev.completedActions, {
          id: action.id, title: action.title, impact: action.impact,
          category: action.category, completedAt: today,
        }],
      };
    });
  };

  if (!completedActions.length) {
    return <OnboardingState name={authUser?.name ?? 'there'} />;
  }

  const today = new Date().toISOString().split('T')[0];

  const totalOffset = useMemo(
    () => completedActions.reduce((s, a) => s + a.impact, 0),
    [completedActions],
  );
  const currentFootprint = useMemo(
    () => parseFloat(Math.max(GLOBAL_AVG - totalOffset, 1.0).toFixed(1)),
    [totalOffset],
  );
  const pctDone = useMemo(
    () => Math.min(Math.round(((GLOBAL_AVG - currentFootprint) / (GLOBAL_AVG - TARGET_FOOTPRINT)) * 100), 100),
    [currentFootprint],
  );
  const streak  = useMemo(() => computeStreak(completedActions), [completedActions]);
  const level   = useMemo(() => computeLevel(totalOffset),       [totalOffset]);

  const breakdown       = useMemo(() => computeBreakdown(completedActions),      [completedActions]);
  const savingsTimeline = useMemo(() => computeSavingsTimeline(completedActions), [completedActions]);
  const recentActions   = useMemo(
    () => [...completedActions].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, 4),
    [completedActions],
  );
  const todayLoggedIds  = useMemo(
    () => new Set(completedActions.filter(a => a.completedAt === today).map(a => a.id)),
    [completedActions, today],
  );
  const suggestions  = useMemo(() => getRecommendations(completedActions, actionsData), [completedActions]);
  const ctxMessage   = useMemo(() => getContextualMessage(completedActions, streak),    [completedActions, streak]);

  return (
    <div className="dashboard">
      <div className="container">

        {/* ── Page header ─────────────────────────────── */}
        <div className="db-header animate-fade-up">
          <div>
            <span className="label-sm" style={{ color: 'var(--color-primary)' }}>Personal Dashboard</span>
            <h1 className="headline-md db-header__title">Welcome back, {authUser?.name} 👋</h1>
            <p className="db-header__sub">
              <span className="chip chip-transport">{level}</span>&nbsp;
              <span style={{ color: 'var(--color-on-surface-variant)', fontSize: 14 }}>
                · 🔥 {streak}-day streak · {totalOffset.toFixed(1)}t CO₂ offset total
              </span>
            </p>
            <p className={`db-ctx-msg db-ctx-msg--${ctxMessage.type}`}>
              {ctxMessage.text}
            </p>
          </div>
          <div className="db-header__actions">
            <Link to="/actions" className="btn btn-primary btn-sm">
              <Leaf size={15} /> Log Activity
            </Link>
          </div>
        </div>

        {/* ── Stat cards ───────────────────────────────── */}
        <div className="db-stats animate-fade-up delay-100">
          <StatCard label="CO₂ Saved"         value={totalOffset.toFixed(1)} unit="t"          sub="Your personal offset"       icon={Leaf}        accent="var(--color-primary)" />
          <StatCard label="Current Footprint"  value={currentFootprint}       unit="t CO₂e/yr"  sub={`vs ${GLOBAL_AVG}t global avg`} icon={TrendingDown} accent="var(--color-tertiary)" />
          <StatCard label="Target Footprint"   value={TARGET_FOOTPRINT}       unit="t CO₂e/yr"  sub="Sustainable goal"           icon={Target}      accent="#2b6954" />
          <StatCard label="Streak"             value={streak}                 unit=" days"       sub="Consecutive eco actions"    icon={Flame}       accent="#e67e22" />
        </div>

        {/* ── Smart Suggestions ────────────────────────── */}
        <div className="card card-p db-suggestions animate-fade-up delay-200">
          <div className="db-suggestions__header">
            <Sparkles size={16} color="var(--color-primary)" />
            <h3 className="headline-md">Suggested for You</h3>
            <span className="label-sm db-suggestions__sub">Based on your habits &amp; impact</span>
          </div>
          {suggestions.length === 0 ? (
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 14 }}>
              Great job — you've logged all top actions today! 🎉
            </p>
          ) : (
            <div className="db-suggestions__list">
              {suggestions.map(action => (
                <div key={action.id} className="db-suggestions__item">
                  <div className="db-suggestions__info">
                    <span className={`chip chip-${action.category.toLowerCase()}`}>{action.category}</span>
                    <span className="db-suggestions__title">{action.title}</span>
                  </div>
                  <div className="db-suggestions__right">
                    <span className="db-recent__impact">-{action.impact}t/yr</span>
                    {todayLoggedIds.has(action.id) ? (
                      <span className="db-suggestions__logged">Logged ✓</span>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => quickLog(action)}>
                        <Zap size={13} /> Log Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Progress to target ───────────────────────── */}
        <div className="card card-p db-progress animate-fade-up delay-200">
          <div className="db-progress__header">
            <div>
              <span className="label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>Progress to Target</span>
              <div className="db-progress__title headline-md">{pctDone}% there</div>
            </div>
            <div className="db-progress__badge">
              <Leaf size={16} /> {currentFootprint}t → {TARGET_FOOTPRINT}t
            </div>
          </div>
          <div className="progress-track" style={{ height: 14 }}>
            <div className="progress-fill" style={{ width: `${pctDone}%` }} />
          </div>
          <div className="db-progress__labels">
            <span>{TARGET_FOOTPRINT}t target</span>
            <span>{GLOBAL_AVG}t global avg</span>
            <span>You: {currentFootprint}t</span>
          </div>
        </div>

        {/* ── Charts row ───────────────────────────────── */}
        <div className="db-charts animate-fade-up delay-300">
          {/* Cumulative savings timeline */}
          <div className="card card-p db-chart-card">
            <h3 className="headline-md db-chart-title">Cumulative CO₂ Saved</h3>
            <p className="db-chart-sub">Your total offset growing over time (tonnes CO₂e)</p>
            {savingsTimeline.length >= 2 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={savingsTimeline} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradSaved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#006c49" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#006c49" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
                  <XAxis dataKey="date"  tick={{ fontSize: 12, fill: 'var(--color-outline)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--color-outline)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  <Area type="monotone" dataKey="saved" name="CO₂ Saved" stroke="#006c49" strokeWidth={2.5} fill="url(#gradSaved)" dot={{ r: 4, fill: '#006c49' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="db-chart-empty">
                <p>Complete more actions to see your savings timeline.</p>
                <Link to="/actions" className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>
                  Browse Actions <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* Breakdown pie */}
          <div className="card card-p db-chart-card">
            <h3 className="headline-md db-chart-title">Savings by Category</h3>
            <p className="db-chart-sub">Where your CO₂ reductions are coming from</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={breakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
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
            <Link to="/actions" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          <div className="db-recent__list">
            {recentActions.map(action => (
              <div key={`${action.id}-${action.completedAt}`} className="db-recent__item">
                <div className="db-recent__info">
                  <span className={`chip ${catClass[action.category] || ''}`}>{action.category}</span>
                  <span className="db-recent__title">{action.title}</span>
                </div>
                <div className="db-recent__meta">
                  <span className="db-recent__impact">-{action.impact}t CO₂e</span>
                  <span className="db-recent__date">{action.completedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
