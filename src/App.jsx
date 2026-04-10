import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import OfflineStatus from "./components/OfflineStatus";
import MockDataWarning from "./components/MockDataWarning";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AssetSearch from "./pages/AssetSearch";
import AssetDetail from "./pages/AssetDetail";
import Profile from "./pages/Profile";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("investfacil_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Header user={user} setUser={setUser} />
        <OfflineStatus />
        <MockDataWarning />

        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/onboarding" />} />
            <Route path="/onboarding" element={user ? <Onboarding user={user} setUser={setUser} /> : <Navigate to="/register" />} />
            <Route path="/dashboard" element={user?.profile ? <Dashboard user={user} /> : <Navigate to="/onboarding" />} />
            <Route path="/search" element={user?.profile ? <AssetSearch user={user} /> : <Navigate to="/onboarding" />} />
            <Route path="/asset/:symbol" element={user?.profile ? <AssetDetail user={user} /> : <Navigate to="/onboarding" />} />
            <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? (user.profile ? "/dashboard" : "/onboarding") : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
