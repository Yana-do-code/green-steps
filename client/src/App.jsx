import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const Landing       = lazy(() => import('./pages/Landing'));
const Login         = lazy(() => import('./pages/Login'));
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const Insights      = lazy(() => import('./pages/Insights'));
const ActionLibrary = lazy(() => import('./pages/ActionLibrary'));
const Calculator    = lazy(() => import('./pages/Calculator'));
const Terms         = lazy(() => import('./pages/Terms'));
const Privacy       = lazy(() => import('./pages/Privacy'));
const Cookies       = lazy(() => import('./pages/Cookies'));

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.18, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } },
};

function PageSpinner() {
  return (
    <div className="loading-state" style={{ minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );
}

function AppRoutes() {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-state" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <ScrollToTop />
      <Navbar />
      <main id="main-content" className="page-content">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} {...pageTransition}>
            <ErrorBoundary>
              <Suspense fallback={<PageSpinner />}>
                <Routes location={location}>
                  <Route path="/"           element={<Landing />} />
                  <Route path="/login"      element={<Login />} />
                  <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/insights"   element={<ProtectedRoute><Insights /></ProtectedRoute>} />
                  <Route path="/actions"    element={<ProtectedRoute><ActionLibrary /></ProtectedRoute>} />
                  <Route path="/calculator" element={<Calculator />} />
                  <Route path="/terms"      element={<Terms />} />
                  <Route path="/privacy"    element={<Privacy />} />
                  <Route path="/cookies"    element={<Cookies />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
