import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import InvestmentList from './components/InvestmentList';
import DetailModal from './components/DetailModal';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ProfileSetup from './components/ProfileSetup';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <SearchBar />
                  <InvestmentList />
                </>
              } />
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <AuthModal />
          <DetailModal />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
