import { Link } from 'react-router-dom';
import { Leaf, Github } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            <div className="footer__logo-icon"><Leaf size={18} strokeWidth={2.5} /></div>
            <span className="footer__logo-text">GreenSteps</span>
          </div>
          <p className="footer__tagline">
            Building a world where progress and preservation go hand in hand.
            Toward an Optimistic Future.
          </p>
          <div className="footer__social">
            <a href="https://github.com/Yana-do-code/green-steps" target="_blank" rel="noreferrer" aria-label="GitHub" className="footer__social-link"><Github size={18} /></a>
          </div>
        </div>

        {/* Links */}
        <div className="footer__nav">
          <div className="footer__nav-group">
            <h4 className="label-sm footer__nav-title">Platform</h4>
            <ul>
              <li><Link to="/dashboard" className="footer__nav-link">Dashboard</Link></li>
              <li><Link to="/insights"  className="footer__nav-link">Insights</Link></li>
              <li><Link to="/actions"   className="footer__nav-link">Action Library</Link></li>
            </ul>
          </div>
          <div className="footer__nav-group">
            <h4 className="label-sm footer__nav-title">Legal</h4>
            <ul>
              <li><Link to="/terms" className="footer__nav-link">Terms of Service</Link></li>
              <li><Link to="/privacy" className="footer__nav-link">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="footer__nav-link">Cookie Settings</Link></li>
            </ul>
          </div>
          <div className="footer__nav-group">
            <h4 className="label-sm footer__nav-title">Resources</h4>
            <ul>
              <li><Link to="/calculator" className="footer__nav-link">Carbon Calculator</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {new Date().getFullYear()} GreenSteps. All rights reserved.</span>
          <span>Made with 💚 for the planet</span>
        </div>
      </div>
    </footer>
  );
}
