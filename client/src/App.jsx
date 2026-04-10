import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// High-Order Auth Shield
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-violet-400">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
        <span className="mt-4 text-sm font-medium animate-pulse tracking-wide">Syncing Identity...</span>
      </div>
    );
  }
  
  // Guard access
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            {/* The global chat logic only mounts once verified! */}
            <AppProvider> 
               <MainLayout />
            </AppProvider>
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
