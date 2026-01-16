import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Skills } from './pages/Skills';
import { Certificates } from './pages/Certificates';
import { Blogs } from './pages/Blogs';
import { SiteContentPage } from './pages/SiteContent';
import { ContactMessages } from './pages/ContactMessages';
import { Chatbot } from './pages/Chatbot';
import { Settings } from './pages/Settings';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="skills" element={<Skills />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="site-content" element={<SiteContentPage />} />
              <Route path="messages" element={<ContactMessages />} />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="settings" element={<Settings />} />
              <Route path="" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;