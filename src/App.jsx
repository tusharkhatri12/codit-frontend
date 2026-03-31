import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ConnectStore from './pages/ConnectStore';
import SyncingData from './pages/SyncingData';
import StoreConnected from './pages/StoreConnected';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import RiskPatterns from './pages/RiskPatterns';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import { Navigate } from 'react-router-dom';

import { UserProvider } from './context/UserContext';

const ProtectedRoute = ({ children }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  
  const user = JSON.parse(userStr);
  
  if (!user.plan || user.plan === 'none') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans text-on-surface selection:bg-primary selection:text-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/connect" element={<ConnectStore />} />
            <Route path="/syncing" element={<SyncingData />} />
            <Route path="/connected" element={<StoreConnected />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="risk-patterns" element={<RiskPatterns />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
