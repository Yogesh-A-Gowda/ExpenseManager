
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Dashboard from './pages/Dashboard';
import Transaction from './pages/Transaction';
import AccountPage from './pages/AccountPage';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import Setting from './pages/Setting';

const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/sign-in"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        {/* Private Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/transactions" element={<Transaction />} />
                  <Route path="/accounts" element={<AccountPage />} />
                  <Route path="/settings" element={<Setting />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </>
            </PrivateRoute>
          }
        />

        {/* Redirect root to /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
};

export default App;
