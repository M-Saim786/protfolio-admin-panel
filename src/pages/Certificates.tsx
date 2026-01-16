import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Award, Calendar, Building } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { certificateService, CertificateResponse, CertificateRequest } from '../services/certificateService';

export const Certificates: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<CertificateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'Certification' | 'Achievement'>('all');
  const [formData, setFormData] = useState({
    title: '',
    institute: '',
    type: 'Certification' as 'Certification' | 'Achievement',
    description: '',
    imageUrl: '',
    date: '',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await certificateService.getAllCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Error loading certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      institute: '',
      type: 'Certification',
      description: '',
      imageUrl: '',
      date: '',
      year: new Date().getFullYear()
    });
    setEditingCertificate(null);
  };

  const handleOpenModal = (certificate?: CertificateResponse) => {
    if (certificate) {
      setEditingCertificate(certificate);
      setFormData({
        title: certificate.title,
        institute: certificate.institute,
        type: certificate.type,
        description: certificate.description,
        imageUrl: certificate.imageUrl,
        date: certificate.date.split('T')[0], // Convert to YYYY-MM-DD format
        year: certificate.year
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const certificateData: CertificateRequest = {
        title: formData.title,
        institute: formData.institute,
        type: formData.type,
        description: formData.description,
        imageUrl: formData.imageUrl || 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800',
        date: formData.date,
        year: formData.year
      };

      if (editingCertificate) {
        await certificateService.updateCertificate(editingCertificate._id, certificateData);
        toast.success('Certificate updated successfully!');
      } else {
        await certificateService.createCertificate(certificateData);
        toast.success('Certificate added successfully!');
      }

      await loadCertificates();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast.error('Failed to save certificate');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      try {
        await certificateService.deleteCertificate(id);
        toast.success('Certificate deleted successfully!');
        await loadCertificates();
      } catch (error) {
        console.error('Error deleting certificate:', error);
        toast.error('Failed to delete certificate');
      }
    }
  };

  const filteredCertificates = selectedType === 'all' 
    ? certificates 
    : certificates.filter(cert => cert.type === selectedType);

  const getTypeColor = (type: string) => {
    return type === 'Certification' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  };

  const getTypeIcon = (type: string) => {
    return type === 'Certification' ? '📜' : '🏆';
  };

  const certificationCount = certificates.filter(c => c.type === 'Certification').length;
  const achievementCount = certificates.filter(c => c.type === 'Achievement').length;

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
          <h2 className="text-2xl font-bold text-gray-900">Certificates & Awards</h2>
          <p className="text-gray-600">Manage your professional certifications and achievements</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          Add Certificate
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900">Total</h3>
          <p className="text-2xl font-bold text-blue-600">{certificates.length}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl">📜</span>
          </div>
          <h3 className="font-medium text-gray-900">Certifications</h3>
          <p className="text-2xl font-bold text-blue-600">{certificationCount}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl">🏆</span>
          </div>
          <h3 className="font-medium text-gray-900">Achievements</h3>
          <p className="text-2xl font-bold text-green-600">{achievementCount}</p>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({certificates.length})
        </button>
        <button
          onClick={() => setSelectedType('Certification')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedType === 'Certification'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Certifications ({certificationCount})
        </button>
        <button
          onClick={() => setSelectedType('Achievement')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedType === 'Achievement'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Achievements ({achievementCount})
        </button>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map((certificate) => (
          <Card key={certificate._id} className="hover:shadow-lg transition-shadow duration-200">
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={certificate.imageUrl}
                  alt={certificate.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(certificate.type)}`}>
                    {getTypeIcon(certificate.type)} {certificate.type}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">{certificate.title}</h3>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="w-4 h-4 mr-2" />
                  {certificate.institute}
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-3">{certificate.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(certificate.date).toLocaleDateString()}
                  </div>
                  <span className="font-medium">{certificate.year}</span>
                </div>
                
                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleOpenModal(certificate)}
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(certificate._id)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCertificates.length === 0 && (
        <Card className="text-center py-12">
          <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
          <p className="text-gray-500 mb-4">
            {selectedType === 'all' 
              ? 'Start by adding your first certificate or achievement'
              : `No ${selectedType.toLowerCase()}s found. Try switching to a different filter.`
            }
          </p>
          <Button onClick={() => handleOpenModal()} icon={Plus}>
            Add Certificate
          </Button>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
            placeholder="AWS Certified Solutions Architect"
            required
          />
          
          <Input
            label="Institute/Organization"
            value={formData.institute}
            onChange={(value) => setFormData({ ...formData, institute: value })}
            placeholder="Amazon Web Services"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Certification' | 'Achievement' })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Certification">Certification</option>
              <option value="Achievement">Achievement</option>
            </select>
          </div>
          
          <Input
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="Brief description of the certificate or achievement"
            rows={3}
            required
          />
          
          <Input
            label="Certificate Image URL"
            type="url"
            value={formData.imageUrl}
            onChange={(value) => setFormData({ ...formData, imageUrl: value })}
            placeholder="https://example.com/certificate.jpg"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(value) => setFormData({ ...formData, date: value })}
              required
            />
            
            <Input
              label="Year"
              type="number"
              value={formData.year.toString()}
              onChange={(value) => setFormData({ ...formData, year: parseInt(value) || new Date().getFullYear() })}
              placeholder="2024"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCloseModal} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : (editingCertificate ? 'Update Certificate' : 'Add Certificate')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};