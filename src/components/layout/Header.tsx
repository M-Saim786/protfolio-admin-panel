import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="ml-4 text-2xl font-semibold text-gray-900">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">AJ</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">Alex Johnson</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};