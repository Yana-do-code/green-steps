import './Legal.css';

export default function Cookies() {
  return (
    <div className="legal">
      <div className="container legal__inner">
        <h1 className="legal__title">Cookie Settings</h1>
        <p className="legal__date">Last updated: June 2026</p>

        <section className="legal__section">
          <h2>What Are Cookies</h2>
          <p>Cookies are small text files stored on your device. They help websites remember your preferences and keep you logged in.</p>
        </section>

        <section className="legal__section">
          <h2>Cookies We Use</h2>
          <div className="legal__table-wrap">
            <table className="legal__table">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Purpose</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Firebase Auth</td>
                  <td>Keeps you signed in across sessions</td>
                  <td>Essential</td>
                </tr>
                <tr>
                  <td>Firebase Session</td>
                  <td>Secures your authentication token</td>
                  <td>Essential</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="legal__section">
          <h2>No Tracking Cookies</h2>
          <p>GreenSteps does not use advertising, analytics, or third-party tracking cookies. Only the essential cookies listed above are used.</p>
        </section>

        <section className="legal__section">
          <h2>Managing Cookies</h2>
          <p>You can clear cookies at any time through your browser settings. Note that clearing authentication cookies will sign you out of GreenSteps.</p>
        </section>
      </div>
    </div>
  );
}
