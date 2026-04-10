import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import DetailModal from './components/DetailModal';
import AuthModal from './components/AuthModal';
import ProfileSetup from './components/ProfileSetup';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import OfflineStatus from './components/OfflineStatus';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Header />
          <OfflineStatus />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <>
                  <SearchBar />
                  <DetailModal />
                </>
              } />
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <AuthModal />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
