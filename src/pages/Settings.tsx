import React, { useState, useEffect } from 'react';
import { Save, User, Moon, Sun, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AdminSettings } from '../types';
import { mockAdminSettings } from '../utils/mockData';
import { STORAGE_KEYS, getFromStorage, setToStorage } from '../utils/localStorage';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings>(mockAdminSettings);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const savedSettings = getFromStorage(STORAGE_KEYS.ADMIN_SETTINGS, mockAdminSettings);
    setSettings(savedSettings);
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      setToStorage(STORAGE_KEYS.ADMIN_SETTINGS, settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('Logged out successfully');
    }
  };

  const updateSettings = <K extends keyof AdminSettings>(field: K, value: AdminSettings[K]) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} icon={Save}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          </div>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={settings.name}
              onChange={(value) => updateSettings('name', value)}
              placeholder="Enter your full name"
            />
            <Input
              label="Email Address"
              type="email"
              value={settings.email}
              onChange={(value) => updateSettings('email', value)}
              placeholder="Enter your email address"
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {settings.theme === 'light' ? (
                <Sun className="w-5 h-5 text-yellow-500 mr-2" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500 mr-2" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme Preference
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => updateSettings('theme', 'light')}
                  className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                    settings.theme === 'light'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </button>
                <button
                  onClick={() => updateSettings('theme', 'dark')}
                  className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                    settings.theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <h4 className="font-medium text-red-900">Logout</h4>
              <p className="text-sm text-red-700">Sign out of your admin account</p>
            </div>
            <Button variant="danger" onClick={handleLogout} icon={LogOut}>
              Logout
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-gray-50 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Version:</span>
            <span className="text-gray-600 ml-2">1.0.0</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Last Updated:</span>
            <span className="text-gray-600 ml-2">January 2024</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Storage:</span>
            <span className="text-gray-600 ml-2">Local Storage</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Theme:</span>
            <span className="text-gray-600 ml-2 capitalize">{settings.theme}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};