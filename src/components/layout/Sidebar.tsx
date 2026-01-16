import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Wrench,
  FileText,
  Mail,
  Settings,
  LogOut,
  User,
  Award,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Skills', href: '/skills', icon: Wrench },
  { name: 'Certificates', href: '/certificates', icon: Award },
  { name: 'Blogs', href: '/blogs', icon: BookOpen },
  { name: 'Site Content', href: '/site-content', icon: FileText },
  { name: 'Messages', href: '/messages', icon: Mail },
  { name: 'Chatbot', href: '/chatbot', icon: MessageCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-screen fixed left-0 top-0 z-40`}>
      <div className="flex items-center justify-center h-16 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <User className="w-8 h-8 text-blue-400" />
          {!isCollapsed && (
            <span className="text-xl font-bold">Portfolio Admin</span>
          )}
        </div>
      </div>
      
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={`flex items-center px-2 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className="flex items-center w-full px-2 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-3 font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};