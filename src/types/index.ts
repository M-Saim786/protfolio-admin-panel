export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  images: string[];
  keyFeatures: string[];
  githubUrl: string;
  liveUrl: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  institute: string;
  type: 'achievement' | 'certification';
  description: string;
  image: string;
  date: string;
  year: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  tags: string[];
  publishedAt: string;
  isPublished: boolean;
  readTime: number;
}

export interface ChatbotResponse {
  id: string;
  trigger: string;
  response: string;
  category: string;
  isActive: boolean;
}

export interface SiteContent {
  introTitle: string;
  introDescription: string;
  contactEmail: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  aboutText: string;
}

export interface AdminSettings {
  name: string;
  email: string;
  theme: 'light' | 'dark';
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}