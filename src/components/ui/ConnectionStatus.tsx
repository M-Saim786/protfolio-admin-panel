import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { authService } from '../../services/authService';

export const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);
  const isDemoMode = authService.isDemoMode();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to make a simple request to check connectivity
        await fetch(apiService.getBaseURL() + '/api/health', { 
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-cache'
        });
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    // Check connection on mount
    checkConnection();

    // Show status for a few seconds if offline or in demo mode
    if (!isOnline || isDemoMode) {
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, isDemoMode]);

  if (!showStatus && isOnline && !isDemoMode) {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
      isDemoMode 
        ? 'bg-yellow-100 border border-yellow-300 text-yellow-800'
        : isOnline 
          ? 'bg-green-100 border border-green-300 text-green-800'
          : 'bg-red-100 border border-red-300 text-red-800'
    }`}>
      <div className="flex items-center space-x-2">
        {isDemoMode ? (
          <AlertCircle className="w-4 h-4" />
        ) : isOnline ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isDemoMode 
            ? 'Demo Mode - Backend Offline'
            : isOnline 
              ? 'Connected to Server'
              : 'Server Offline'
          }
        </span>
      </div>
      {!isOnline && (
        <p className="text-xs mt-1">
          Please start your backend server at {apiService.getBaseURL()}
        </p>
      )}
    </div>
  );
};