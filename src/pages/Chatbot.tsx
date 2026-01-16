import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MessageCircle, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ChatbotResponse } from '../types';
import { mockChatbotResponses } from '../utils/mockData';
import { STORAGE_KEYS, getFromStorage, setToStorage } from '../utils/localStorage';

const categories = ['greeting', 'projects', 'skills', 'contact', 'experience', 'hiring', 'technical', 'general'] as const;

export const Chatbot: React.FC = () => {
  const [responses, setResponses] = useState<ChatbotResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<ChatbotResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    trigger: '',
    response: '',
    category: 'general' as string,
    isActive: true
  });

  useEffect(() => {
    const savedResponses = getFromStorage(STORAGE_KEYS.CHATBOT_RESPONSES, mockChatbotResponses);
    setResponses(savedResponses);
  }, []);

  const saveResponses = (updatedResponses: ChatbotResponse[]) => {
    setResponses(updatedResponses);
    setToStorage(STORAGE_KEYS.CHATBOT_RESPONSES, updatedResponses);
  };

  const resetForm = () => {
    setFormData({
      trigger: '',
      response: '',
      category: 'general',
      isActive: true
    });
    setEditingResponse(null);
  };

  const handleOpenModal = (response?: ChatbotResponse) => {
    if (response) {
      setEditingResponse(response);
      setFormData({
        trigger: response.trigger,
        response: response.response,
        category: response.category,
        isActive: response.isActive
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const responseData: ChatbotResponse = {
      id: editingResponse?.id || Date.now().toString(),
      trigger: formData.trigger.toLowerCase(),
      response: formData.response,
      category: formData.category,
      isActive: formData.isActive
    };

    let updatedResponses;
    if (editingResponse) {
      updatedResponses = responses.map(r => r.id === editingResponse.id ? responseData : r);
      toast.success('Chatbot response updated successfully!');
    } else {
      updatedResponses = [...responses, responseData];
      toast.success('Chatbot response added successfully!');
    }

    saveResponses(updatedResponses);
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this chatbot response?')) {
      const updatedResponses = responses.filter(r => r.id !== id);
      saveResponses(updatedResponses);
      toast.success('Chatbot response deleted successfully!');
    }
  };

  const toggleActiveStatus = (id: string) => {
    const updatedResponses = responses.map(response => 
      response.id === id ? { ...response, isActive: !response.isActive } : response
    );
    saveResponses(updatedResponses);
    const response = responses.find(r => r.id === id);
    toast.success(`Response ${response?.isActive ? 'deactivated' : 'activated'} successfully!`);
  };

  const filteredResponses = responses.filter(response => {
    const matchesCategory = selectedCategory === 'all' || response.category === selectedCategory;
    const matchesSearch = response.trigger.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.response.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      greeting: 'bg-green-100 text-green-800',
      projects: 'bg-blue-100 text-blue-800',
      skills: 'bg-purple-100 text-purple-800',
      contact: 'bg-orange-100 text-orange-800',
      experience: 'bg-indigo-100 text-indigo-800',
      hiring: 'bg-red-100 text-red-800',
      technical: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      greeting: '👋',
      projects: '💼',
      skills: '🛠️',
      contact: '📧',
      experience: '📈',
      hiring: '💼',
      technical: '⚙️',
      general: '💬'
    };
    return icons[category] || '💬';
  };

  const activeCount = responses.filter(r => r.isActive).length;
  const inactiveCount = responses.filter(r => !r.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chatbot Responses</h2>
          <p className="text-gray-600">Manage automated responses for your portfolio chatbot</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          Add Response
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900">Total Responses</h3>
          <p className="text-2xl font-bold text-blue-600">{responses.length}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <ToggleRight className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-medium text-gray-900">Active</h3>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <ToggleLeft className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="font-medium text-gray-900">Inactive</h3>
          <p className="text-2xl font-bold text-gray-600">{inactiveCount}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-medium text-gray-900">Categories</h3>
          <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search triggers or responses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Responses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResponses.map((response) => (
          <Card key={response.id} className="hover:shadow-lg transition-shadow duration-200">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(response.category)}`}>
                    {getCategoryIcon(response.category)} {response.category}
                  </span>
                  <button
                    onClick={() => toggleActiveStatus(response.id)}
                    className={`p-1 rounded-full transition-colors ${
                      response.isActive 
                        ? 'text-green-600 hover:text-green-800' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {response.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(response)}
                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(response.id)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Trigger:</h4>
                  <p className="text-sm bg-gray-100 px-3 py-2 rounded-lg font-mono">
                    {response.trigger}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Response:</h4>
                  <p className="text-sm text-gray-600 line-clamp-4">
                    {response.response}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredResponses.length === 0 && (
        <Card className="text-center py-12">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No responses found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first chatbot response'
            }
          </p>
          <Button onClick={() => handleOpenModal()} icon={Plus}>
            Add Response
          </Button>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingResponse ? 'Edit Chatbot Response' : 'Add New Chatbot Response'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Trigger Keywords"
            value={formData.trigger}
            onChange={(value) => setFormData({ ...formData, trigger: value })}
            placeholder="hello, hi, greeting"
            required
          />
          
          <Input
            label="Response Message"
            type="textarea"
            value={formData.response}
            onChange={(value) => setFormData({ ...formData, response: value })}
            placeholder="Hello! Welcome to my portfolio. How can I help you today?"
            rows={4}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active (response will be used by the chatbot)
            </label>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Preview</h4>
            <div className="space-y-2">
              <div className="bg-white p-2 rounded border-l-4 border-blue-500">
                <p className="text-xs text-gray-500">User input:</p>
                <p className="text-sm font-mono">{formData.trigger || 'trigger keywords'}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded border-l-4 border-blue-600">
                <p className="text-xs text-blue-700">Bot response:</p>
                <p className="text-sm">{formData.response || 'Your response message will appear here'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingResponse ? 'Update Response' : 'Add Response'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};