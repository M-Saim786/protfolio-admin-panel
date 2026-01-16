import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, Calendar, User, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { contactService, ContactMessageResponse } from '../services/contactService';

export const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessageResponse[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllContactMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await contactService.markAsRead(messageId);
      await loadMessages();
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactService.deleteContactMessage(messageId);
        await loadMessages();
        setSelectedMessage(null);
        toast.success('Message deleted successfully');
      } catch (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message');
      }
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'read' && message.isRead) ||
                         (filter === 'unread' && !message.isRead);
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-gray-600">
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                {unreadCount} unread
              </span>
            )}
            Manage inquiries and messages from your portfolio
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card padding="sm">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === 'unread' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filter === 'read' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Read ({messages.length - unreadCount})
                </button>
              </div>
            </div>
          </Card>

          <div className="mt-4 space-y-2">
            {filteredMessages.map((message) => (
              <Card
                key={message._id}
                padding="sm"
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedMessage?._id === message._id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                } ${!message.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-sm font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {message.senderName}
                      </h3>
                      {!message.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{message.email}</p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{message.message}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(message.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {filteredMessages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No messages found</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedMessage.senderName}</h3>
                    <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(selectedMessage.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!selectedMessage.isRead && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(selectedMessage._id)}
                      icon={MailOpen}
                    >
                      Mark Read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => deleteMessage(selectedMessage._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Message</h4>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Reply via email:</strong> Click on the email address above to compose a reply in your email client.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Message Selected</h3>
                <p>Select a message from the list to view its details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};