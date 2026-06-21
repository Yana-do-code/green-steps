import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="loading-state" style={{ minHeight: '60vh', gap: 16 }}>
          <span style={{ fontSize: '2.5rem' }}>🌿</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 14 }}>
            An unexpected error occurred. Your data is safe.
          </p>
          <Link
            to="/"
            className="btn btn-primary"
            onClick={() => this.setState({ hasError: false })}
          >
            Return Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
