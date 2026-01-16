import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { skillService, SkillResponse, SkillRequest } from '../services/skillService';

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
const categories = ['Frontend', 'Backend', 'Languages', 'Database', 'Cloud', 'DevOps', 'Design', 'Mobile'] as const;

export const Skills: React.FC = () => {
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    skillName: '',
    icon: '',
    skillLevel: 'Intermediate' as const,
    category: 'Frontend' as const
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await skillService.getAllSkills();
      setSkills(data);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      skillName: '',
      icon: '',
      skillLevel: 'Intermediate',
      category: 'Frontend'
    });
    setEditingSkill(null);
  };

  const handleOpenModal = (skill?: SkillResponse) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        skillName: skill.skillName,
        icon: skill.icon,
        skillLevel: skill.skillLevel,
        category: skill.category
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
      const skillData: SkillRequest = {
        skillName: formData.skillName,
        icon: formData.icon || '🔧',
        skillLevel: formData.skillLevel,
        category: formData.category
      };

      if (editingSkill) {
        await skillService.updateSkill(editingSkill._id, skillData);
        toast.success('Skill updated successfully!');
      } else {
        await skillService.createSkill(skillData);
        toast.success('Skill added successfully!');
      }

      await loadSkills();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving skill:', error);
      toast.error('Failed to save skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await skillService.deleteSkill(id);
        toast.success('Skill deleted successfully!');
        await loadSkills();
      } catch (error) {
        console.error('Error deleting skill:', error);
        toast.error('Failed to delete skill');
      }
    }
  };

  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const getLevelColor = (level: string) => {
    const colors = {
      'Beginner': 'bg-yellow-100 text-yellow-800',
      'Intermediate': 'bg-blue-100 text-blue-800',
      'Advanced': 'bg-green-100 text-green-800',
      'Expert': 'bg-purple-100 text-purple-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getLevelStars = (level: string) => {
    const stars = {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3,
      'Expert': 4
    };
    return stars[level as keyof typeof stars] || 2;
  };

  const allCategories = ['All', ...categories];
  const skillsByCategory = categories.reduce((acc, category) => {
    acc[category] = skills.filter(skill => skill.category === category).length;
    return acc;
  }, {} as Record<string, number>);

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
          <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
          <p className="text-gray-600">Manage your technical skills and expertise</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          Add Skill
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category} padding="sm" className="text-center">
            <h3 className="font-medium text-gray-900">{category}</h3>
            <p className="text-2xl font-bold text-blue-600">{skillsByCategory[category] || 0}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSkills.map((skill) => (
          <Card key={skill._id} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{skill.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{skill.skillName}</h3>
                  <p className="text-sm text-gray-500">{skill.category}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleOpenModal(skill)}
                  className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.skillLevel)}`}>
                  {skill.skillLevel}
                </span>
                <div className="flex space-x-1">
                  {[...Array(4)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-3 h-3 ${
                        index < getLevelStars(skill.skillLevel)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Skill Name"
            value={formData.skillName}
            onChange={(value) => setFormData({ ...formData, skillName: value })}
            placeholder="React, Node.js, Python..."
            required
          />
          
          <Input
            label="Icon (Emoji)"
            value={formData.icon}
            onChange={(value) => setFormData({ ...formData, icon: value })}
            placeholder="⚛️, 🐍, 🔧..."
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.skillLevel}
              onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as any })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {skillLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCloseModal} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : (editingSkill ? 'Update Skill' : 'Add Skill')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};