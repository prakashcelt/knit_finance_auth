import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { getCurrentUser, setCredentials } from './store/slices/authSlice';

// Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import NotificationContainer from './components/ui/NotificationContainer';
import DeleteModal from './components/todos/DeleteModal';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// App content component
const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Router future={{ v7_startTransition: true }}>
        <AppRoutes />
      </Router>
    </div>
  );
};

// Routes component that can use useLocation
const AppRoutes = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  useEffect(() => {
    // Handle Google OAuth callback with token in URL
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      // Store token and get user data
      localStorage.setItem('token', tokenFromUrl);
      dispatch(setCredentials({ token: tokenFromUrl }));
      dispatch(getCurrentUser());
      
      // Clean up URL by removing token parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      return;
    }
  }, [dispatch, location.search]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {isAuthenticated && (
        <Sidebar isOpen={sidebarOpen} />
      )}
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isAuthenticated && sidebarOpen ? 'ml-64' : ''
      }`}>
        {/* Navbar */}
        {isAuthenticated && <Navbar />}
        
        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route 
              path="/" 
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
              } 
            />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      
      {/* Notifications */}
      <NotificationContainer />
      
      {/* Modals */}
      <DeleteModal />
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
