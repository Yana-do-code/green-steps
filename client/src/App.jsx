import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import ActionLibrary from './pages/ActionLibrary';

export default function App() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="page-content">
        <Routes>
          <Route path="/"              element={<Landing />} />
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/insights"      element={<Insights />} />
          <Route path="/actions"       element={<ActionLibrary />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
