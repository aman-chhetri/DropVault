import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import FileList from './components/files/FileList';
import FileUpload from './components/files/FileUpload';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';

// Auth guard component for protected routes
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 text-emerald-500 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Public route - redirects to files if already logged in
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 text-emerald-500 animate-spin" />
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/files" />;
  }
  
  return <>{children}</>;
};

function App() {
  const { user } = useAuth();
  const location = useLocation();

  // Update page title based on route
  useEffect(() => {
    const pageTitles: Record<string, string> = {
      '/': 'Vaultify - Secure File Storage',
      '/login': 'Sign In - Vaultify',
      '/signup': 'Create Account - Vaultify',
      '/files': 'My Files - Vaultify',
      '/upload': 'Upload Files - Vaultify',
      '/settings': 'Account Settings - Vaultify',
    };

    document.title = pageTitles[location.pathname] || 'Vaultify';
  }, [location.pathname]);

  return (
    <>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <div className="min-h-[80vh] flex items-center justify-center px-4">
                  <Login />
                </div>
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <div className="min-h-[80vh] flex items-center justify-center px-4">
                  <Signup />
                </div>
              </PublicRoute>
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/files" 
            element={
              <PrivateRoute>
                <FileList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <PrivateRoute>
                <FileUpload />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to={user ? "/files" : "/"} />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;