import './Legal.css';

export default function Privacy() {
  return (
    <div className="legal">
      <div className="container legal__inner">
        <h1 className="legal__title">Privacy Policy</h1>
        <p className="legal__date">Last updated: June 2026</p>

        <section className="legal__section">
          <h2>1. Information We Collect</h2>
          <p>We collect your name, email address, and the eco-actions you complete. This data is stored securely in Firebase and used solely to provide your personalised dashboard.</p>
        </section>

        <section className="legal__section">
          <h2>2. How We Use Your Data</h2>
          <p>Your data is used exclusively to calculate your carbon footprint progress and sync it across your devices. We do not sell or share your data with third parties.</p>
        </section>

        <section className="legal__section">
          <h2>3. Authentication</h2>
          <p>Authentication is handled by Firebase Authentication (Google). We do not store your password. If you use Google Sign-In, your data is subject to Google's privacy policy.</p>
        </section>

        <section className="legal__section">
          <h2>4. Data Retention</h2>
          <p>Your data is retained as long as your account is active. You can request deletion of your account and all associated data at any time by contacting us.</p>
        </section>

        <section className="legal__section">
          <h2>5. Cookies</h2>
          <p>We use only essential cookies required for authentication. We do not use tracking or advertising cookies. See our <a href="/cookies">Cookie Settings</a> page for details.</p>
        </section>

        <section className="legal__section">
          <h2>6. Contact</h2>
          <p>For privacy-related questions, please reach out via our <a href="https://github.com/Yana-do-code/green-steps" target="_blank" rel="noreferrer">GitHub repository</a>.</p>
        </section>
      </div>
    </div>
  );
}
