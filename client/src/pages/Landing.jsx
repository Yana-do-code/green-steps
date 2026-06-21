import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Leaf, ArrowRight, CheckCircle2, Zap, BarChart3,
  Users, Globe2, Award, TrendingDown, Activity, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const GLOBAL_AVG       = 7.5;
const TARGET_FOOTPRINT = 2.0;

/* ── Animation variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 }
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};


/* ── Scroll-reveal wrapper ──────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial="hidden" animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp} custom={delay}>
      {children}
    </motion.div>
  );
}

/* ── Animated counter ───────────────────────────────────── */
function AnimatedCounter({ value, suffix, label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div className="stats__item" ref={ref}>
      <motion.div
        className="stats__value"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: 'backOut' }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {value}
        </motion.span>
        <span className="stats__suffix">{suffix}</span>
      </motion.div>
      <div className="label-sm stats__label">{label}</div>
    </div>
  );
}

const features = [
  {
    icon: Activity,
    title: 'Real-time Tracking',
    description: 'Visualize your carbon impact as it happens. Connect daily habits and see your footprint shift in real time.',
    items: ['Automatic Data Sync', 'Comparative Benchmarking'],
    color: '#006c49',
    gradient: 'from-emerald-50 to-transparent',
  },
  {
    icon: BarChart3,
    title: 'Personalized Insights',
    description: 'Our engine analyzes your habits to surface the most effective, least disruptive changes for your lifestyle.',
    items: ['AI Behavioral Analysis', 'Impact Forecasting'],
    color: '#006a61',
    gradient: 'from-teal-50 to-transparent',
  },
  {
    icon: Zap,
    title: 'Actionable Steps',
    description: 'Turn awareness into agency with gamified missions across travel, diet, energy, and shopping.',
    items: ['Gamified Missions', 'Reward Integration'],
    color: '#2b6954',
    gradient: 'from-green-50 to-transparent',
  },
];

const impactMetrics = [
  { icon: TrendingDown, val: '40%', label: 'Average Footprint Reduction' },
  { icon: Globe2,       val: '2t',  label: 'Sustainable Annual Target' },
  { icon: Award,        val: '14d', label: 'Average Streak to Form Habits' },
];

/* ── Hero preview card ──────────────────────────────────── */
const previewSteps = [
  { label: 'Track your daily actions', icon: '🚗' },
  { label: 'See your CO₂ impact',      icon: '📊' },
  { label: 'Build eco-friendly habits', icon: '🌱' },
];

function HeroPreviewCard({ user, footprint }) {
  const circumference = 2 * Math.PI * 44;
  const fillPct = footprint != null
    ? Math.min((GLOBAL_AVG - footprint) / (GLOBAL_AVG - TARGET_FOOTPRINT), 1)
    : 0.15;
  const dashOffset = circumference * (1 - fillPct);

  return (
    <motion.div
      className="hero__preview-card"
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Card header */}
      <div className="hpc__header">
        <div className="hpc__dot hpc__dot--pulse" />
        <span className="hpc__live">Your Dashboard</span>
        {user
          ? <span className="hpc__date">{user.name?.split(' ')[0] ?? 'Welcome'} 👋</span>
          : <Link to="/login" className="hpc__date hpc__date--link">Sign in to start →</Link>
        }
      </div>

      {/* Footprint ring */}
      <div className="hpc__ring-wrap">
        <svg viewBox="0 0 100 100" width="110" height="110">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(0,108,73,0.1)" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r="44" fill="none"
            stroke="url(#ringGrad)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.4, delay: 0.8, ease: 'easeOut' }}
            transform="rotate(-90 50 50)"
          />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#006c49" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="hpc__ring-label">
          <motion.span
            className="hpc__ring-val"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {footprint != null ? `${footprint}t` : '—'}
          </motion.span>
          <small>{footprint != null ? 'CO₂e/yr' : 'your footprint'}</small>
        </div>
      </div>

      {/* Feature steps */}
      <div className="hpc__actions">
        {previewSteps.map((s, i) => (
          <motion.div
            key={s.label}
            className="hpc__action hpc__action--step"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 + i * 0.15 }}
          >
            <span className="hpc__step-icon">{s.icon}</span>
            <span>{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* CTA hint */}
      <motion.div
        className="hpc__cta-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <Leaf size={13} /> {user ? 'Keep logging actions to reduce your footprint' : 'Log actions daily to grow your impact'}
      </motion.div>

    </motion.div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function Landing() {
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' });
  const { user, progress, loading } = useAuth();

  const footprint = (!loading && user && progress?.completedActions)
    ? parseFloat(Math.max(GLOBAL_AVG - progress.completedActions.reduce((s, a) => s + a.impact, 0), 1.0).toFixed(1))
    : null;

  return (
    <div className="landing">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg-mesh" aria-hidden="true">
          <div className="blob hero__blob1" />
          <div className="blob hero__blob2" />
          <div className="hero__grid-lines" />
        </div>

        <div className="container hero__layout">
          {/* Left: copy */}
          <div className="hero__copy">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="hero__eyebrow"
            >
              <Leaf size={14} strokeWidth={2.5} />
              Carbon Footprint Tracker
            </motion.div>

            <motion.h1
              className="display-lg hero__headline"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {['Your Journey to a', 'Lighter Footprint', 'Starts Here'].map((line, i) => (
                <motion.span key={line} variants={fadeUp} custom={i} className="hero__headline-line">
                  {i === 1
                    ? <span className="hero__headline-accent">{line}</span>
                    : line}
                  <br />
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              className="hero__sub"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45 }}
            >
              Track your footprint, discover personalized carbon-cutting strategies,
              and contribute to a healthier planet—one step at a time.
            </motion.p>

            <motion.div
              className="hero__actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to={user ? '/dashboard' : '/login'} className="btn btn-primary btn-lg hero__cta-primary">
                  {user ? 'Go to Dashboard' : 'Start Tracking Free'}
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/calculator" className="btn btn-secondary btn-lg">
                  Carbon Calculator
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero__trust"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { icon: Shield, text: 'No credit card required' },
                { icon: Leaf,   text: 'Free forever' },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="hero__trust-badge">
                  <Icon size={13} strokeWidth={2.2} /> {text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: live preview card */}
          <div className="hero__preview">
            <HeroPreviewCard user={user} footprint={footprint} />
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────── */}
      <section className="stats">
        <div className="container stats__grid">
          <AnimatedCounter value="1.2M+"  suffix="" label="Tonnes CO₂ Offset" />
          <AnimatedCounter value="850+"   suffix="" label="Green Partners" />
          <AnimatedCounter value="312K+"  suffix="" label="Actions Completed" />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="features" id="features">
        <div className="container">
          <Reveal className="section-header">
            <span className="label-sm section-eyebrow">How It Works</span>
            <h2 className="headline-md section-title">Everything you need to take control</h2>
            <p className="section-desc">
              We provide the tools and data you need to make informed decisions
              that benefit both your lifestyle and the environment.
            </p>
          </Reveal>

          <motion.div
            ref={featuresRef}
            className="features__grid"
            initial="hidden"
            animate={featuresInView ? 'visible' : 'hidden'}
            variants={stagger}
          >
            {features.map(({ icon: Icon, title, description, items, color }) => (
              <motion.div
                key={title}
                className="feature-card card card-p"
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  boxShadow: '0 20px 48px rgba(0,108,73,0.14)',
                  borderColor: 'rgba(0,108,73,0.28)',
                  transition: { duration: 0.22, ease: 'easeOut' },
                }}
              >
                <motion.div
                  className="feature-card__icon"
                  style={{ background: `${color}18`, color }}
                  whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                >
                  <Icon size={24} strokeWidth={1.8} />
                </motion.div>
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
                <div className="feature-card__glow" style={{ background: `${color}08` }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Impact ───────────────────────────────────────── */}
      <section className="impact" id="impact">
        <div className="blob impact__blob" />
        <div className="container impact__inner">
          <Reveal className="impact__text">
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
              {impactMetrics.map(({ icon: Icon, val, label }, i) => (
                <Reveal key={label} delay={i * 0.12}>
                  <motion.div className="impact__metric" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                    <motion.div
                      className="impact__metric-icon"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon size={20} strokeWidth={1.8} />
                    </motion.div>
                    <div>
                      <div className="impact__metric-val">{val}</div>
                      <div className="label-sm impact__metric-label">{label}</div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block', marginTop: 8 }}>
              <Link to="/login" className="btn btn-primary btn-lg">
                View My Impact <ArrowRight size={18} />
              </Link>
            </motion.div>
          </Reveal>

          {/* Orbital ring visual */}
          <div className="impact__visual">
            <div className="impact__orbit-wrap">
              <motion.div
                className="impact__orbit impact__orbit--lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="impact__orbit impact__orbit--md"
                animate={{ rotate: -360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              >
                <div className="impact__orbit-dot impact__orbit-dot--1" />
              </motion.div>
              <motion.div
                className="impact__orbit impact__orbit--sm"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              >
                <div className="impact__orbit-dot impact__orbit-dot--2" />
              </motion.div>
              <motion.div
                className="impact__circle-inner"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Leaf size={48} color="white" strokeWidth={1.5} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="blob cta-section__blob1" />
        <div className="blob cta-section__blob2" />
        <div className="container cta-section__inner">
          <Reveal>
            <motion.div
              className="cta-section__icon-wrap"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Users size={36} color="var(--color-primary)" strokeWidth={1.5} />
            </motion.div>
            <h2 className="display-lg cta-section__title">
              Ready to take your first Green Step?
            </h2>
            <p className="cta-section__desc">
              Join GreenSteps today and start tracking your carbon footprint for free.
              No credit card. No commitment.
            </p>
            <div className="cta-section__btns">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login" className="btn btn-primary btn-lg cta-section__cta">
                  Get Started Free <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/calculator" className="btn btn-secondary btn-lg">
                  Try the Calculator
                </Link>
              </motion.div>
            </div>
            <p className="cta-section__note">No credit card required · Free forever for personal use</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
