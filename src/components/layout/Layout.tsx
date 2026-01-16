import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ConnectionStatus } from '../ui/ConnectionStatus';

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/projects': 'Projects',
    '/skills': 'Skills',
    '/certificates': 'Certificates',
    '/blogs': 'Blogs',
    '/site-content': 'Site Content',
    '/messages': 'Messages',
    '/chatbot': 'Chatbot',
    '/settings': 'Settings'
  };
  return routes[pathname] || 'Dashboard';
};

export const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <ConnectionStatus />
      <Sidebar isCollapsed={isSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header onToggleSidebar={toggleSidebar} title={pageTitle} />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile overlay */}
      {isMobile && !isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}
    </div>
  );
};