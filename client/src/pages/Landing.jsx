import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, ArrowRight, CheckCircle2, Zap, BarChart3,
  Users, Globe2, Award, ChevronDown, TrendingDown, Activity
} from 'lucide-react';
import './Landing.css';

/* ── Counter animation hook ─────────────────────────────── */
function useCountUp(target, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return val;
}

/* ── Stat item component ────────────────────────────────── */
function StatItem({ value, suffix, label, inView }) {
  const count = useCountUp(value, 2000, inView);
  return (
    <div className="stats__item">
      <div className="stats__value">
        {count.toLocaleString()}<span className="stats__suffix">{suffix}</span>
      </div>
      <div className="label-sm stats__label">{label}</div>
    </div>
  );
}

const features = [
  {
    icon: Activity,
    title: 'Real-time Tracking',
    description: 'Connect your utility accounts and lifestyle apps to visualize your carbon impact as it happens, not months later.',
    items: ['Automatic Data Sync', 'Comparative Benchmarking'],
    color: '#006c49',
  },
  {
    icon: BarChart3,
    title: 'Personalized Insights',
    description: 'Our AI-driven engine analyzes your habits to suggest the most effective, least disruptive changes for your unique life.',
    items: ['AI Behavioral Analysis', 'Impact Forecasting'],
    color: '#006a61',
  },
  {
    icon: Zap,
    title: 'Actionable Steps',
    description: 'Turn awareness into agency with simple, gamified tasks designed to reduce CO2 emissions across travel, diet, and home.',
    items: ['Gamified Missions', 'Reward Integration'],
    color: '#2b6954',
  },
];


export default function Landing() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        {/* Organic blobs */}
        <div className="blob hero__blob1" />
        <div className="blob hero__blob2" />

        <div className="container hero__content">
          <h1 className="display-lg hero__headline animate-fade-up delay-100">
            Your Journey to a<br />
            <span className="hero__headline-accent">Lighter Footprint</span>
            <br />Starts Here
          </h1>

          <p className="hero__sub animate-fade-up delay-200">
            Empower your sustainable journey with GreenSteps. Track your footprint,
            discover personalized carbon-cutting strategies, and contribute to a
            healthier planet—one step at a time.
          </p>

          <div className="hero__actions animate-fade-up delay-300">
            <Link to="/dashboard" className="btn btn-primary btn-lg hero__cta-primary">
              Start Tracking Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/actions" className="btn btn-secondary btn-lg">
              Explore Actions
            </Link>
          </div>

          {/* Live momentum card */}
          <div className="hero__momentum animate-fade-up delay-400">
            <div className="hero__momentum-label label-sm">Live Momentum</div>
            <div className="hero__momentum-bar">
              <div className="progress-track" style={{ flex: 1 }}>
                <div className="progress-fill" style={{ width: '84%' }} />
              </div>
              <span className="hero__momentum-pct">84%</span>
            </div>
            <div className="hero__momentum-sub">Community target reached this month</div>
          </div>
        </div>

      </section>

      {/* ── Stats Bar ────────────────────────────────────── */}
      <section className="stats" ref={statsRef} id="stats">
        <div className="container stats__grid">
          <StatItem value={45200}  suffix="+"    label="Active Stewards"    inView={statsVisible} />
          <StatItem value={1200000} suffix="t"   label="Tonnes CO₂ Offset"  inView={statsVisible} />
          <StatItem value={850}    suffix=""     label="Green Partners"      inView={statsVisible} />
          <StatItem value={312000} suffix="+"    label="Actions Completed"   inView={statsVisible} />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <span className="label-sm section-eyebrow">How It Works</span>
            <h2 className="headline-md section-title">
              Everything you need to take control
            </h2>
            <p className="section-desc">
              We provide the tools and data you need to make informed decisions
              that benefit both your lifestyle and the environment.
            </p>
          </div>

          <div className="features__grid">
            {features.map(({ icon: Icon, title, description, items, color }, i) => (
              <div
                key={title}
                className="feature-card card card-p animate-fade-up"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="feature-card__icon" style={{ background: `${color}18`, color }}>
                  <Icon size={24} strokeWidth={1.8} />
                </div>
                <h3 className="headline-md feature-card__title">{title}</h3>
                <p className="feature-card__desc">{description}</p>
                <ul className="feature-card__list">
                  {items.map(item => (
                    <li key={item} className="feature-card__item">
                      <CheckCircle2 size={16} color="var(--color-primary)" strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact Visual ─────────────────────────────────── */}
      <section className="impact">
        <div className="blob impact__blob" />
        <div className="container impact__inner">
          <div className="impact__text">
            <span className="label-sm section-eyebrow">Why It Matters</span>
            <h2 className="display-lg impact__title">
              Small steps,
              <span className="hero__headline-accent"> massive impact</span>
            </h2>
            <p style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.7, marginBottom: 32 }}>
              The average person can reduce their footprint by up to 40% through
              conscious daily choices—no sacrifice needed, just smarter decisions
              guided by real data.
            </p>
            <div className="impact__metrics">
              {[
                { icon: TrendingDown, val: '40%', label: 'Average Footprint Reduction' },
                { icon: Globe2,       val: '2t',  label: 'Sustainable Annual Target' },
                { icon: Award,        val: '14d', label: 'Average Streak to Form Habits' },
              ].map(({ icon: Icon, val, label }) => (
                <div key={label} className="impact__metric">
                  <div className="impact__metric-icon">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="impact__metric-val">{val}</div>
                    <div className="label-sm impact__metric-label">{label}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ marginTop: 8 }}>
              View My Impact <ArrowRight size={18} />
            </Link>
          </div>

          <div className="impact__visual animate-float">
            <div className="impact__circle-outer">
              <div className="impact__circle-mid">
                <div className="impact__circle-inner animate-pulse-g">
                  <Leaf size={48} color="white" strokeWidth={1.5} />
                  <span>5.8t</span>
                  <small>Your footprint</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── CTA Section ──────────────────────────────────── */}
      <section className="cta-section">
        <div className="blob cta-section__blob1" />
        <div className="blob cta-section__blob2" />
        <div className="container cta-section__inner">
          <Users size={40} color="var(--color-primary)" strokeWidth={1.5} />
          <h2 className="display-lg cta-section__title">
            Ready to take your first Green Step?
          </h2>
          <p className="cta-section__desc">
            Join GreenSteps today and receive your first personalized carbon
            reduction report for free.
          </p>
          <div className="cta-section__form">
            <input
              type="email"
              className="input cta-section__input"
              placeholder="Enter your email address"
            />
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
          </div>
          <p className="cta-section__note">No credit card required. Free forever for personal use.</p>
        </div>
      </section>
    </div>
  );
}
