import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { siteContentService, SiteContentResponse, SiteContentRequest } from '../services/siteContentService';

export const SiteContentPage: React.FC = () => {
  const [content, setContent] = useState<SiteContentRequest>({
    introTitle: '',
    introDescription: '',
    contactEmail: '',
    githubLink: '',
    linkedinLink: '',
    twitterLink: '',
    aboutText: ''
  });
  const [contentId, setContentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSiteContent();
  }, []);

  const loadSiteContent = async () => {
    try {
      setLoading(true);
      const data = await siteContentService.getAllSiteContent();
      if (data.length > 0) {
        const siteContent = data[0];
        setContent({
          introTitle: siteContent.introTitle,
          introDescription: siteContent.introDescription,
          contactEmail: siteContent.contactEmail,
          githubLink: siteContent.githubLink,
          linkedinLink: siteContent.linkedinLink,
          twitterLink: siteContent.twitterLink,
          aboutText: siteContent.aboutText
        });
        setContentId(siteContent._id);
      }
    } catch (error) {
      console.error('Error loading site content:', error);
      toast.error('Failed to load site content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (contentId) {
        await siteContentService.updateSiteContent(contentId, content);
        toast.success('Site content updated successfully!');
      } else {
        const newContent = await siteContentService.createSiteContent(content);
        setContentId(newContent._id);
        toast.success('Site content created successfully!');
      }
    } catch (error) {
      console.error('Error saving site content:', error);
      toast.error('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (field: keyof SiteContentRequest, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
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
          <h2 className="text-2xl font-bold text-gray-900">Site Content</h2>
          <p className="text-gray-600">Manage your portfolio content and information</p>
        </div>
        <Button onClick={handleSave} disabled={saving} icon={Save}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>
          </div>
          <div className="space-y-4">
            <Input
              label="Intro Title"
              value={content.introTitle}
              onChange={(value) => updateContent('introTitle', value)}
              placeholder="Your main headline"
            />
            <Input
              label="Intro Description"
              type="textarea"
              value={content.introDescription}
              onChange={(value) => updateContent('introDescription', value)}
              placeholder="Brief description about yourself"
              rows={4}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center mb-4">
            <Mail className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          </div>
          <div className="space-y-4">
            <Input
              label="Contact Email"
              type="email"
              value={content.contactEmail}
              onChange={(value) => updateContent('contactEmail', value)}
              placeholder="your.email@example.com"
            />
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center mb-4">
          <Github className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <Github className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">GitHub</span>
            </div>
            <Input
              type="url"
              value={content.githubLink}
              onChange={(value) => updateContent('githubLink', value)}
              placeholder="https://github.com/username"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Linkedin className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">LinkedIn</span>
            </div>
            <Input
              type="url"
              value={content.linkedinLink}
              onChange={(value) => updateContent('linkedinLink', value)}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Twitter className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">Twitter</span>
            </div>
            <Input
              type="url"
              value={content.twitterLink}
              onChange={(value) => updateContent('twitterLink', value)}
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Section</h3>
        <Input
          label="About Text"
          type="textarea"
          value={content.aboutText}
          onChange={(value) => updateContent('aboutText', value)}
          placeholder="Tell visitors about your background, experience, and interests"
          rows={6}
        />
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Content Preview</h3>
            <div className="space-y-3 text-blue-800">
              <div>
                <h4 className="font-medium">{content.introTitle || 'Intro Title'}</h4>
                <p className="text-sm mt-1">{content.introDescription || 'Intro description will appear here'}</p>
              </div>
              <div>
                <h4 className="font-medium">Contact</h4>
                <p className="text-sm">{content.contactEmail || 'Contact email will appear here'}</p>
              </div>
              <div>
                <h4 className="font-medium">About</h4>
                <p className="text-sm">{content.aboutText || 'About text will appear here'}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};