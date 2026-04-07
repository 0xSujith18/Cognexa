import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Dashboard  from './pages/Dashboard'
import SessionSetup   from './pages/SessionSetup'
import InterviewRoom  from './pages/InterviewRoom'
import ResultsView    from './pages/ResultsView'
import Layout from './components/Layout'
import LoadingScreen from './components/LoadingScreen'

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected */}
        <Route element={<Layout />}>
          <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/setup"      element={<PrivateRoute><SessionSetup /></PrivateRoute>} />
          <Route path="/interview/:sessionId" element={<PrivateRoute><InterviewRoom /></PrivateRoute>} />
          <Route path="/results/:sessionId"   element={<PrivateRoute><ResultsView /></PrivateRoute>} />
          
          {/* New Placeholder Routes */}
          <Route path="/results" element={<PrivateRoute><div className="p-8 text-center glass-morphism rounded-3xl"><h1 className="text-2xl font-black text-main">Interview Results</h1><p className="text-muted mt-2 italic font-bold">Coming Soon...</p></div></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><div className="p-8 text-center glass-morphism rounded-3xl"><h1 className="text-2xl font-black text-main">Advanced Analytics</h1><p className="text-muted mt-2 italic font-bold">Coming Soon...</p></div></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><div className="p-8 text-center glass-morphism rounded-3xl"><h1 className="text-2xl font-black text-main">User Profile</h1><p className="text-muted mt-2 italic font-bold">Coming Soon...</p></div></PrivateRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
