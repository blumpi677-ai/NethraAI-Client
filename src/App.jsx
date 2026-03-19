import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ContactUs from './Pages/Jsx/Contact';
import AboutUs from './Pages/Jsx/About';
import HomePage from './Pages/Jsx/Home';
import Auth from './Pages/Jsx/Auth';
import { AuthProvider } from './Pages/context/AuthContext.jsx';
import Navbar from './Pages/Components/Navbar.jsx';
import Settings from './Pages/Jsx/Settings.jsx';
import Chat from './Pages/Jsx/Chat.jsx';
import Footer from './Pages/Components/Footer.jsx';
import NotFound from './Pages/Jsx/NotFound.jsx';

// ============================================
// SCROLL TO TOP ON ROUTE CHANGE
// ============================================
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Skip scroll reset for chat (it manages its own scroll)
    if (pathname === '/chat') return;

    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return null;
};

// ============================================
// APP CONTENT — Layout Logic
// ============================================
const AppContent = () => {
  const location = useLocation();

  const showNavbar = location.pathname !== '/chat';
  const showFooter = !['/login', '/chat'].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Auth />} />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* 404 — must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {showFooter && <Footer />}
    </>
  );
};

// ============================================
// APP — Root
// ============================================
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;