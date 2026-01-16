import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink, Github, Calendar, Image, Star, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { projectService, ProjectResponse, ProjectRequest } from '../services/projectService';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    images: [''],
    keyFeatures: [''],
    githubUrl: '',
    liveUrl: ''
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      techStack: '',
      images: [''],
      keyFeatures: [''],
      githubUrl: '',
      liveUrl: ''
    });
    setEditingProject(null);
  };

  const handleOpenModal = (project?: ProjectResponse) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        techStack: project.techStack.join(', '),
        images: project.images.length > 0 ? project.images : [''],
        keyFeatures: project.keyFeatures.length > 0 ? project.keyFeatures : [''],
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl
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

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImageField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, '']
    }));
  };

  const removeFeatureField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
  };

  const updateFeatureField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.map((feature, i) => i === index ? value : feature)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const projectData: ProjectRequest = {
        title: formData.title,
        description: formData.description,
        techStack: formData.techStack.split(',').map(tech => tech.trim()),
        images: formData.images.filter(img => img.trim() !== ''),
        keyFeatures: formData.keyFeatures.filter(feature => feature.trim() !== ''),
        githubUrl: formData.githubUrl,
        liveUrl: formData.liveUrl
      };

      if (editingProject) {
        await projectService.updateProject(editingProject._id, projectData);
        toast.success('Project updated successfully!');
      } else {
        await projectService.createProject(projectData);
        toast.success('Project created successfully!');
      }

      await loadProjects();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(id);
        toast.success('Project deleted successfully!');
        await loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage your portfolio projects with multiple images and key features</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project._id} className="hover:shadow-lg transition-shadow duration-200">
            <div className="space-y-4">
              {/* Image Gallery */}
              <div className="relative">
                <img
                  src={project.images[0] || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {project.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <Image className="w-3 h-3 mr-1" />
                    {project.images.length}
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Key Features */}
                {project.keyFeatures.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                      Key Features
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {project.keyFeatures.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                      {project.keyFeatures.length > 3 && (
                        <li className="text-blue-600">+{project.keyFeatures.length - 3} more features</li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(project)}
                      className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Project Title"
              value={formData.title}
              onChange={(value) => setFormData({ ...formData, title: value })}
              required
            />
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {editingProject ? `Created: ${new Date(editingProject.createdAt).toLocaleDateString()}` : 'Will be set to today'}
            </div>
          </div>
          
          <Input
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            rows={3}
            required
          />
          
          <Input
            label="Tech Stack (comma-separated)"
            value={formData.techStack}
            onChange={(value) => setFormData({ ...formData, techStack: value })}
            placeholder="React, TypeScript, Node.js"
            required
          />
          
          {/* Project Images */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Project Images
              </label>
              <Button type="button" size="sm" onClick={addImageField} icon={Plus}>
                Add Image
              </Button>
            </div>
            {formData.images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="url"
                  value={image}
                  onChange={(value) => updateImageField(index, value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Key Features */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Key Features
              </label>
              <Button type="button" size="sm" onClick={addFeatureField} icon={Plus}>
                Add Feature
              </Button>
            </div>
            {formData.keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={feature}
                  onChange={(value) => updateFeatureField(index, value)}
                  placeholder="Describe a key feature of your project"
                  className="flex-1"
                />
                {formData.keyFeatures.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeatureField(index)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="GitHub URL"
              type="url"
              value={formData.githubUrl}
              onChange={(value) => setFormData({ ...formData, githubUrl: value })}
              placeholder="https://github.com/username/repo"
              required
            />
            
            <Input
              label="Live URL"
              type="url"
              value={formData.liveUrl}
              onChange={(value) => setFormData({ ...formData, liveUrl: value })}
              placeholder="https://example.com"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCloseModal} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};