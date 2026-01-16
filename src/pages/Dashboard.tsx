import React, { useState, useEffect } from 'react';
import { FolderOpen, Wrench, Mail, Award, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { projectService, ProjectResponse } from '../services/projectService';
import { skillService, SkillResponse } from '../services/skillService';
import { contactService, ContactMessageResponse } from '../services/contactService';
import { certificateService, CertificateResponse } from '../services/certificateService';

export const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const [messages, setMessages] = useState<ContactMessageResponse[]>([]);
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsData, skillsData, messagesData, certificatesData] = await Promise.all([
        projectService.getAllProjects(),
        skillService.getAllSkills(),
        contactService.getAllContactMessages(),
        certificateService.getAllCertificates()
      ]);

      setProjects(projectsData);
      setSkills(skillsData);
      setMessages(messagesData);
      setCertificates(certificatesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const unreadMessages = messages.filter(msg => !msg.isRead).length;
  const recentProjects = projects.slice(0, 3);

  const stats = [
    {
      name: 'Total Projects',
      value: projects.length,
      icon: FolderOpen,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      name: 'Skills',
      value: skills.length,
      icon: Wrench,
      color: 'bg-green-500',
      change: '+1 this week'
    },
    {
      name: 'Certificates',
      value: certificates.length,
      icon: Award,
      color: 'bg-purple-500',
      change: '+1 this month'
    },
    {
      name: 'Unread Messages',
      value: unreadMessages,
      icon: Mail,
      color: 'bg-red-500',
      change: '3 new today'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-blue-100">Here's what's happening with your portfolio today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <FolderOpen className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <img
                  src={project.images[0] || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={project.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.title}</h4>
                  <p className="text-sm text-gray-500 truncate">{project.description}</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {messages.slice(0, 3).map((message) => (
              <div key={message._id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{message.senderName}</h4>
                  <div className="flex items-center space-x-2">
                    {!message.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                    <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">{message.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Certificates</h3>
            <Award className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {certificates.slice(0, 3).map((certificate) => (
              <div key={certificate._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg ${certificate.type === 'Certification' ? 'bg-blue-100' : 'bg-green-100'}`}>
                  <span className="text-lg">{certificate.type === 'Certification' ? '📜' : '🏆'}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{certificate.title}</h4>
                  <p className="text-sm text-gray-500">{certificate.institute}</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">{certificate.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Skills</h3>
            <Wrench className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {skills.slice(0, 6).map((skill) => (
              <div key={skill._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{skill.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{skill.skillName}</h4>
                    <p className="text-xs text-gray-500">{skill.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  skill.skillLevel === 'Expert' ? 'bg-purple-100 text-purple-800' :
                  skill.skillLevel === 'Advanced' ? 'bg-green-100 text-green-800' :
                  skill.skillLevel === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {skill.skillLevel}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};