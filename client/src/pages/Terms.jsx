import './Legal.css';

export default function Terms() {
  return (
    <div className="legal">
      <div className="container legal__inner">
        <h1 className="legal__title">Terms of Service</h1>
        <p className="legal__date">Last updated: June 2026</p>

        <section className="legal__section">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using GreenSteps, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
        </section>

        <section className="legal__section">
          <h2>2. Use of the Platform</h2>
          <p>GreenSteps is a personal carbon footprint tracking tool. You agree to use it only for lawful purposes and in a way that does not infringe the rights of others.</p>
        </section>

        <section className="legal__section">
          <h2>3. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        </section>

        <section className="legal__section">
          <h2>4. Data Accuracy</h2>
          <p>The CO₂ impact figures provided are estimates based on publicly available research. GreenSteps does not guarantee their absolute accuracy.</p>
        </section>

        <section className="legal__section">
          <h2>5. Changes to Terms</h2>
          <p>We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
        </section>

        <section className="legal__section">
          <h2>6. Contact</h2>
          <p>For any questions regarding these terms, please reach out via our <a href="https://github.com/Yana-do-code/green-steps" target="_blank" rel="noreferrer">GitHub repository</a>.</p>
        </section>
      </div>
    </div>
  );
}
