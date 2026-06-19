import { useEffect, useState, useCallback } from 'react';
import {
  Zap, Car, Salad, ShoppingBag, Filter,
  CheckCircle2, Bookmark, BookmarkCheck, Search,
  TrendingDown, Clock, Star, ChevronDown
} from 'lucide-react';
import './ActionLibrary.css';

const API = '/api/actions';

/* ── Category icon map ───────────────────────────────────── */
const catIcons = {
  Transport: Car,
  Diet:      Salad,
  Energy:    Zap,
  Shopping:  ShoppingBag,
};
const catColors = {
  Transport: { bg: 'rgba(0,108,73,0.1)',   color: '#006c49' },
  Diet:      { bg: 'rgba(0,106,97,0.1)',   color: '#006a61' },
  Energy:    { bg: 'rgba(43,105,84,0.1)',  color: '#2b6954' },
  Shopping:  { bg: 'rgba(16,185,129,0.12)',color: '#065f46' },
};
const diffColors = {
  Easy:   { bg: 'rgba(0,108,73,0.1)',   color: '#006c49' },
  Medium: { bg: 'rgba(217,119,6,0.1)',  color: '#d97706' },
  Hard:   { bg: 'rgba(239,68,68,0.1)',  color: '#dc2626' },
};

/* ── Impact bar ──────────────────────────────────────────── */
function ImpactBar({ value, max = 2.5 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="action-impact-bar">
      <div className="progress-track" style={{ height: 6 }}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── Single action card ───────────────────────────────────── */
function ActionCard({ action, onToggleComplete, onToggleBookmark }) {
  const Icon = catIcons[action.category] || Zap;
  const catStyle  = catColors[action.category]  || catColors.Energy;
  const diffStyle = diffColors[action.difficulty] || diffColors.Easy;

  return (
    <div className={`action-card card${action.completed ? ' action-card--done' : ''}`}>
      {/* Card top strip */}
      <div className="action-card__strip" style={{ background: catStyle.color }} />

      <div className="action-card__body">
        {/* Icon + badges row */}
        <div className="action-card__top">
          <div className="action-card__icon" style={{ background: catStyle.bg, color: catStyle.color }}>
            <Icon size={20} strokeWidth={1.8} />
          </div>
          <div className="action-card__badges">
            <span className="action-badge" style={{ background: catStyle.bg, color: catStyle.color }}>
              {action.category}
            </span>
            <span className="action-badge" style={{ background: diffStyle.bg, color: diffStyle.color }}>
              {action.difficulty}
            </span>
          </div>
          <button
            className={`action-card__bookmark${action.bookmarked ? ' action-card__bookmark--active' : ''}`}
            onClick={() => onToggleBookmark(action.id)}
            aria-label="Bookmark action"
          >
            {action.bookmarked
              ? <BookmarkCheck size={17} />
              : <Bookmark size={17} />
            }
          </button>
        </div>

        {/* Title + desc */}
        <h3 className="action-card__title">{action.title}</h3>
        <p className="action-card__desc">{action.description}</p>

        {/* Tags */}
        <div className="action-card__tags">
          {action.tags.map(t => (
            <span key={t} className="chip" style={{ fontSize: 11 }}>{t}</span>
          ))}
          <span className="chip" style={{ fontSize: 11, background: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}>
            <Clock size={10} /> {action.duration}
          </span>
        </div>

        {/* Impact */}
        <div className="action-card__impact-row">
          <div>
            <div className="label-sm" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 4 }}>
              CO₂ Impact
            </div>
            <div className="action-card__impact-val">
              <TrendingDown size={14} /> -{action.impact}t/yr
            </div>
          </div>
          <div>
            <div className="label-sm" style={{ color: 'var(--color-on-surface-variant)', marginBottom: 4 }}>
              Points
            </div>
            <div className="action-card__points">
              <Star size={13} fill="currentColor" /> {action.points}
            </div>
          </div>
        </div>
        <ImpactBar value={action.impact} />

        {/* Complete button */}
        <button
          className={`action-card__complete btn${action.completed ? ' action-card__complete--done' : ' btn-primary'}`}
          onClick={() => onToggleComplete(action.id)}
        >
          <CheckCircle2 size={16} />
          {action.completed ? 'Completed ✓' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
const CATEGORIES  = ['All', 'Transport', 'Diet', 'Energy', 'Shopping'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const SORT_OPTIONS = [
  { value: 'impact',    label: 'Highest Impact' },
  { value: 'points',    label: 'Most Points'    },
  { value: 'difficulty',label: 'Easiest First'  },
];

export default function ActionLibrary() {
  const [actions,    setActions]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [category,   setCategory]   = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sortBy,     setSortBy]     = useState('impact');
  const [search,     setSearch]     = useState('');
  const [showBookmarked, setShowBookmarked] = useState(false);

  const fetchActions = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category   !== 'All') params.set('category',   category);
    if (difficulty !== 'All') params.set('difficulty', difficulty);
    fetch(`${API}?${params}`)
      .then(r => r.json())
      .then(d => { setActions(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category, difficulty]);

  useEffect(() => { fetchActions(); }, [fetchActions]);

  const handleComplete = async (id) => {
    await fetch(`${API}/${id}/complete`, { method: 'POST' });
    setActions(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const handleBookmark = async (id) => {
    await fetch(`${API}/${id}/bookmark`, { method: 'POST' });
    setActions(prev => prev.map(a => a.id === id ? { ...a, bookmarked: !a.bookmarked } : a));
  };

  /* Client-side search + sort + bookmark filter */
  const displayed = actions
    .filter(a => !showBookmarked || a.bookmarked)
    .filter(a => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'impact')     return b.impact - a.impact;
      if (sortBy === 'points')     return b.points - a.points;
      if (sortBy === 'difficulty') {
        const order = { Easy: 0, Medium: 1, Hard: 2 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });

  const completedCount = actions.filter(a => a.completed).length;
  const totalImpact    = actions.filter(a => a.completed).reduce((s, a) => s + a.impact, 0);

  return (
    <div className="action-lib">
      <div className="container">

        {/* ── Header ──────────────────────────────────── */}
        <div className="al-header animate-fade-up">
          <div>
            <span className="label-sm" style={{ color: 'var(--color-primary)' }}>Action Library</span>
            <h1 className="headline-md al-header__title">Turn Awareness into Action</h1>
            <p className="al-header__sub">
              Browse curated eco-actions. Each step shows its real CO₂ impact so you
              know exactly what difference you're making.
            </p>
          </div>
          {/* Progress summary */}
          <div className="al-progress-summary card card-p">
            <div className="al-progress-summary__row">
              <CheckCircle2 size={18} color="var(--color-primary)" />
              <span className="al-progress-summary__val">{completedCount}/{actions.length}</span>
              <span className="al-progress-summary__lbl">Actions Done</span>
            </div>
            <div className="progress-track" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: `${actions.length ? (completedCount / actions.length) * 100 : 0}%` }} />
            </div>
            <div className="al-progress-summary__impact">
              <TrendingDown size={14} /> <strong>{totalImpact.toFixed(1)}t</strong> CO₂e saved so far
            </div>
          </div>
        </div>

        {/* ── Toolbar ─────────────────────────────────── */}
        <div className="al-toolbar animate-fade-up delay-100">
          {/* Search */}
          <div className="al-search">
            <Search size={16} className="al-search__icon" />
            <input
              type="text"
              className="input al-search__input"
              placeholder="Search actions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Category pills */}
          <div className="al-filter-group">
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`ins-filter-pill${category === c ? ' ins-filter-pill--active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {catIcons[c] ? (() => { const I = catIcons[c]; return <I size={13} />; })() : null}
                {c}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="al-toolbar__right">
            {/* Difficulty */}
            <div className="al-select-wrap">
              <Filter size={14} />
              <select
                className="al-select"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown size={14} />
            </div>

            {/* Sort */}
            <div className="al-select-wrap">
              <select
                className="al-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} />
            </div>

            {/* Bookmarks toggle */}
            <button
              className={`btn btn-sm${showBookmarked ? ' btn-primary' : ' btn-secondary'}`}
              onClick={() => setShowBookmarked(b => !b)}
            >
              <Bookmark size={14} />
              Saved
            </button>
          </div>
        </div>

        {/* ── Results count ────────────────────────────── */}
        <div className="al-count animate-fade-up delay-200">
          <span className="label-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            {loading ? 'Loading…' : `${displayed.length} action${displayed.length !== 1 ? 's' : ''} found`}
          </span>
        </div>

        {/* ── Grid ─────────────────────────────────────── */}
        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : displayed.length === 0 ? (
          <div className="al-empty">
            <Zap size={48} color="var(--color-outline-variant)" strokeWidth={1.2} />
            <h3 className="headline-md">No actions found</h3>
            <p>Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="al-grid animate-fade-up delay-300">
            {displayed.map(action => (
              <ActionCard
                key={action.id}
                action={action}
                onToggleComplete={handleComplete}
                onToggleBookmark={handleBookmark}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
