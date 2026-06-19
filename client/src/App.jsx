import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import ActionLibrary from './pages/ActionLibrary';

export default function App() {
  return (
    <AuthProvider>
      <div className="page-wrapper">
        <Navbar />
        <main className="page-content">
          <Routes>
            <Route path="/"       element={<Landing />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/insights"  element={<ProtectedRoute><Insights /></ProtectedRoute>} />
            <Route path="/actions"   element={<ProtectedRoute><ActionLibrary /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
