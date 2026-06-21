import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Zap, Salad, ShoppingBag, ArrowRight, ArrowLeft, RotateCcw, TrendingDown } from 'lucide-react';
import './Calculator.css';

/* ── Emission factors ───────────────────────────────────────── */
function calcFootprint({ kmPerWeek, flights, homeSize, energyType, diet, shopping }) {
  const transport = kmPerWeek * 52 * 0.00021;                          // avg car CO2/km
  const aviation  = flights * 0.9;                                      // ~0.9t per return flight
  const homeBase  = { small: 1.5, medium: 2.5, large: 4.0 }[homeSize];
  const homeMulti = { gas: 1.0, mixed: 0.7, electric: 0.4 }[energyType];
  const home      = homeBase * homeMulti;
  const dietVal   = { daily: 2.5, sometimes: 1.5, vegetarian: 0.8, vegan: 0.4 }[diet];
  const shopVal   = { high: 0.8, medium: 0.4, low: 0.1 }[shopping];
  const total     = transport + aviation + home + dietVal + shopVal;
  return {
    total:     parseFloat(total.toFixed(1)),
    transport: parseFloat(transport.toFixed(1)),
    aviation:  parseFloat(aviation.toFixed(1)),
    home:      parseFloat(home.toFixed(1)),
    diet:      parseFloat(dietVal.toFixed(1)),
    shopping:  parseFloat(shopVal.toFixed(1)),
  };
}

const GLOBAL_AVG = 7.5;
const TARGET     = 2.0;

const STEPS = [
  { id: 'transport', label: 'Transport',    icon: Car },
  { id: 'home',      label: 'Home Energy',  icon: Zap },
  { id: 'diet',      label: 'Diet',         icon: Salad },
  { id: 'lifestyle', label: 'Lifestyle',    icon: ShoppingBag },
];

const OPTION_BTN = 'calc-option';
const OPTION_ACTIVE = 'calc-option--active';

export default function Calculator() {
  const [step,        setStep]        = useState(0);
  const [done,        setDone]        = useState(false);
  const [showError,   setShowError]   = useState(false);
  const [form, setForm] = useState({
    kmPerWeek:  null,
    flights:    null,
    homeSize:   null,
    energyType: null,
    diet:       null,
    shopping:   null,
  });

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setShowError(false); };

  const stepValid = [
    form.kmPerWeek !== null && form.flights !== null,
    form.homeSize  !== null && form.energyType !== null,
    form.diet      !== null,
    form.shopping  !== null,
  ];

  const result = done ? calcFootprint({
    kmPerWeek:  form.kmPerWeek  ?? 0,
    flights:    form.flights    ?? 0,
    homeSize:   form.homeSize   ?? 'medium',
    energyType: form.energyType ?? 'mixed',
    diet:       form.diet       ?? 'sometimes',
    shopping:   form.shopping   ?? 'medium',
  }) : null;

  const pctVsAvg = result
    ? result.total < GLOBAL_AVG
      ? `${Math.round((1 - result.total / GLOBAL_AVG) * 100)}% below global average`
      : `${Math.round((result.total / GLOBAL_AVG - 1) * 100)}% above global average`
    : null;

  const barMax = 5;

  return (
    <div className="calculator">
      <div className="container">

        {/* Header */}
        <div className="calc-header animate-fade-up">
          <span className="label-sm" style={{ color: 'var(--color-primary)' }}>Carbon Calculator</span>
          <h1 className="headline-md calc-header__title">Estimate Your Carbon Footprint</h1>
          <p className="calc-header__sub">
            Answer a few questions to get your estimated annual CO₂ footprint and see how you compare.
          </p>
        </div>

        {!done ? (
          <div className="calc-card card card-p animate-fade-up delay-100">

            {/* Progress */}
            <div className="calc-progress">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.id} className={`calc-step-dot${i === step ? ' calc-step-dot--active' : i < step ? ' calc-step-dot--done' : ''}`}>
                    <Icon size={16} />
                    <span>{s.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="progress-track" style={{ height: 6, marginBottom: 32 }}>
              <div className="progress-fill" style={{ width: `${((step) / STEPS.length) * 100}%`, transition: 'width 0.3s ease' }} />
            </div>

            {/* Step 0 — Transport */}
            {step === 0 && (
              <div className="calc-section">
                <h2 className="calc-section__title">🚗 How do you get around?</h2>

                <div className="calc-field">
                  <label className="calc-label">How many km do you drive per week?</label>
                  <div className="calc-slider-row">
                    <input type="range" min={0} max={1000} step={10}
                      value={form.kmPerWeek ?? 0}
                      onChange={e => set('kmPerWeek', +e.target.value)}
                      className="calc-slider" />
                    <span className="calc-slider-val">
                      {form.kmPerWeek !== null ? `${form.kmPerWeek} km` : '—'}
                    </span>
                  </div>
                  <div className="calc-slider-labels"><span>0</span><span>500</span><span>1000+</span></div>
                </div>

                <div className="calc-field">
                  <label className="calc-label">How many return flights do you take per year?</label>
                  <div className="calc-options">
                    {[0, 1, 2, 4, 6, 10].map(n => (
                      <button key={n} className={`${OPTION_BTN}${form.flights === n ? ` ${OPTION_ACTIVE}` : ''}`}
                        onClick={() => set('flights', n)}>
                        {n === 10 ? '10+' : n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 — Home Energy */}
            {step === 1 && (
              <div className="calc-section">
                <h2 className="calc-section__title">⚡ Home Energy</h2>

                <div className="calc-field">
                  <label className="calc-label">What size is your home?</label>
                  <div className="calc-options">
                    {[{ val: 'small', label: 'Small\nFlat/Studio' }, { val: 'medium', label: 'Medium\n2–3 bed' }, { val: 'large', label: 'Large\n4+ bed' }].map(o => (
                      <button key={o.val} className={`${OPTION_BTN}${form.homeSize === o.val ? ` ${OPTION_ACTIVE}` : ''}`}
                        onClick={() => set('homeSize', o.val)} style={{ whiteSpace: 'pre-line' }}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="calc-field">
                  <label className="calc-label">What type of energy do you use?</label>
                  <div className="calc-options">
                    {[{ val: 'gas', label: '🔥 Gas & Oil' }, { val: 'mixed', label: '⚡ Mix' }, { val: 'electric', label: '🌿 Renewable' }].map(o => (
                      <button key={o.val} className={`${OPTION_BTN}${form.energyType === o.val ? ` ${OPTION_ACTIVE}` : ''}`}
                        onClick={() => set('energyType', o.val)}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Diet */}
            {step === 2 && (
              <div className="calc-section">
                <h2 className="calc-section__title">🥗 Diet</h2>

                <div className="calc-field">
                  <label className="calc-label">How often do you eat meat?</label>
                  <div className="calc-options calc-options--col">
                    {[
                      { val: 'daily',       label: '🥩 Daily — meat at most meals' },
                      { val: 'sometimes',   label: '🍗 A few times a week' },
                      { val: 'vegetarian',  label: '🥦 Vegetarian' },
                      { val: 'vegan',       label: '🌱 Vegan' },
                    ].map(o => (
                      <button key={o.val} className={`${OPTION_BTN} calc-option--full${form.diet === o.val ? ` ${OPTION_ACTIVE}` : ''}`}
                        onClick={() => set('diet', o.val)}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Lifestyle */}
            {step === 3 && (
              <div className="calc-section">
                <h2 className="calc-section__title">🛍️ Shopping & Lifestyle</h2>

                <div className="calc-field">
                  <label className="calc-label">How would you describe your shopping habits?</label>
                  <div className="calc-options calc-options--col">
                    {[
                      { val: 'high',   label: '🛒 High — frequent new purchases, fast fashion' },
                      { val: 'medium', label: '🛍️ Moderate — occasional purchases' },
                      { val: 'low',    label: '♻️ Minimal — secondhand, repair, rarely buy new' },
                    ].map(o => (
                      <button key={o.val} className={`${OPTION_BTN} calc-option--full${form.shopping === o.val ? ` ${OPTION_ACTIVE}` : ''}`}
                        onClick={() => set('shopping', o.val)}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Validation message */}
            {showError && (
              <p className="calc-error">Please answer all questions on this page before continuing.</p>
            )}

            {/* Navigation */}
            <div className="calc-nav">
              {step > 0 && (
                <button className="btn btn-secondary" onClick={() => { setStep(s => s - 1); setShowError(false); }}>
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button className="btn btn-primary calc-nav__next" onClick={() => {
                  if (!stepValid[step]) { setShowError(true); return; }
                  setShowError(false);
                  setStep(s => s + 1);
                }}>
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button className="btn btn-primary calc-nav__next" onClick={() => {
                  if (!stepValid[step]) { setShowError(true); return; }
                  setShowError(false);
                  setDone(true);
                }}>
                  Calculate <ArrowRight size={16} />
                </button>
              )}
            </div>

          </div>
        ) : (

          /* ── Results ───────────────────────────────────────── */
          <div className="animate-fade-up delay-100">
            <div className="calc-result-hero card card-p">
              <div className="calc-result-hero__left">
                <p className="label-sm" style={{ color: 'var(--color-primary)' }}>Your estimated footprint</p>
                <div className="calc-result-hero__value">{result.total}<span>t CO₂e / yr</span></div>
                <div className={`calc-result-hero__badge ${result.total <= GLOBAL_AVG ? 'calc-badge--good' : 'calc-badge--warn'}`}>
                  {pctVsAvg}
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', marginTop: 8 }}>
                  Global average: {GLOBAL_AVG}t &nbsp;·&nbsp; Sustainable target: {TARGET}t
                </p>
              </div>
              <div className="calc-result-hero__right">
                <div className="calc-ring">
                  <svg viewBox="0 0 120 120" width="120" height="120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-outline-variant)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none"
                      stroke={result.total <= TARGET ? '#10b981' : result.total <= GLOBAL_AVG ? 'var(--color-primary)' : '#d97706'}
                      strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - Math.min(result.total / 12, 1))}`}
                      transform="rotate(-90 60 60)" />
                  </svg>
                  <div className="calc-ring__label">
                    <span>{result.total}t</span>
                    <small>annual</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="card card-p calc-breakdown">
              <h3 className="headline-md" style={{ marginBottom: 20 }}>Breakdown by Category</h3>
              {[
                { label: '🚗 Transport',    val: result.transport },
                { label: '✈️ Flights',      val: result.aviation  },
                { label: '⚡ Home Energy',  val: result.home      },
                { label: '🥗 Diet',         val: result.diet      },
                { label: '🛍️ Shopping',    val: result.shopping  },
              ].map(({ label, val }) => (
                <div key={label} className="calc-breakdown__row">
                  <span className="calc-breakdown__label">{label}</span>
                  <div className="calc-breakdown__bar-wrap">
                    <div className="progress-track" style={{ height: 10 }}>
                      <div className="progress-fill" style={{ width: `${Math.min((val / barMax) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <span className="calc-breakdown__val">{val}t</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="card card-p calc-cta">
              <TrendingDown size={28} color="var(--color-primary)" />
              <div>
                <h3 className="headline-md" style={{ marginBottom: 6 }}>Ready to reduce your footprint?</h3>
                <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)' }}>
                  Browse actions tailored to your biggest impact areas and start tracking your progress.
                </p>
              </div>
              <div className="calc-cta__actions">
                <Link to="/actions" className="btn btn-primary">
                  Browse Actions <ArrowRight size={15} />
                </Link>
                <button className="btn btn-secondary" onClick={() => { setDone(false); setStep(0); }}>
                  <RotateCcw size={15} /> Recalculate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
