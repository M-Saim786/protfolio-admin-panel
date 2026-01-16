import { Project, Skill, ContactMessage, SiteContent, AdminSettings, Certificate, Blog, ChatbotResponse } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'TailwindCSS'],
    images: [
      'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    keyFeatures: [
      'User authentication and authorization',
      'Shopping cart and checkout process',
      'Payment integration with Stripe',
      'Admin dashboard for inventory management',
      'Real-time order tracking',
      'Responsive design for all devices'
    ],
    githubUrl: 'https://github.com/example/ecommerce',
    liveUrl: 'https://ecommerce-demo.com',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    techStack: ['React', 'TypeScript', 'Firebase', 'Material-UI'],
    images: [
      'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    keyFeatures: [
      'Drag and drop task management',
      'Real-time collaboration',
      'Team member assignment',
      'Progress tracking and analytics',
      'File attachments and comments',
      'Mobile-responsive interface'
    ],
    githubUrl: 'https://github.com/example/taskmanager',
    liveUrl: 'https://taskmanager-demo.com',
    createdAt: '2024-02-20'
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'A beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.',
    techStack: ['Vue.js', 'OpenWeather API', 'Chart.js', 'SCSS'],
    images: [
      'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    keyFeatures: [
      'Location-based weather forecasts',
      'Interactive weather maps',
      'Historical weather data',
      'Weather alerts and notifications',
      'Customizable dashboard widgets',
      'Multi-city weather comparison'
    ],
    githubUrl: 'https://github.com/example/weather',
    liveUrl: 'https://weather-demo.com',
    createdAt: '2024-03-10'
  }
];

export const mockSkills: Skill[] = [
  { id: '1', name: 'React', icon: '⚛️', level: 'Expert', category: 'Frontend' },
  { id: '2', name: 'TypeScript', icon: '🔷', level: 'Advanced', category: 'Languages' },
  { id: '3', name: 'Node.js', icon: '🟢', level: 'Advanced', category: 'Backend' },
  { id: '4', name: 'Python', icon: '🐍', level: 'Intermediate', category: 'Languages' },
  { id: '5', name: 'PostgreSQL', icon: '🐘', level: 'Intermediate', category: 'Database' },
  { id: '6', name: 'AWS', icon: '☁️', level: 'Intermediate', category: 'Cloud' },
  { id: '7', name: 'Docker', icon: '🐳', level: 'Intermediate', category: 'DevOps' },
  { id: '8', name: 'TailwindCSS', icon: '🎨', level: 'Expert', category: 'Frontend' }
];

export const mockMessages: ContactMessage[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    message: 'Hi! I love your portfolio. I would like to discuss a potential collaboration on a React project. Are you available for freelance work?',
    date: '2024-01-20',
    isRead: false
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    message: 'We are impressed by your work and would like to invite you for an interview for a Senior Frontend Developer position at our company.',
    date: '2024-01-18',
    isRead: true
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@startup.io',
    message: 'Your weather dashboard project caught our attention. Would you be interested in building something similar for our startup?',
    date: '2024-01-15',
    isRead: true
  },
  {
    id: '4',
    name: 'Lisa Brown',
    email: 'lisa.brown@design.com',
    message: 'I am a UI/UX designer looking for a developer to collaborate with. Your portfolio shows great attention to design details!',
    date: '2024-01-10',
    isRead: false
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: '1',
    title: 'AWS Certified Solutions Architect',
    institute: 'Amazon Web Services',
    type: 'certification',
    description: 'Demonstrated expertise in designing distributed systems on AWS platform with focus on scalability, security, and cost optimization.',
    image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-03-15',
    year: '2024'
  },
  {
    id: '2',
    title: 'Best Innovation Award',
    institute: 'Tech Conference 2023',
    type: 'achievement',
    description: 'Received recognition for developing an innovative AI-powered chatbot solution that improved customer engagement by 40%.',
    image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2023-11-20',
    year: '2023'
  },
  {
    id: '3',
    title: 'React Developer Certification',
    institute: 'Meta (Facebook)',
    type: 'certification',
    description: 'Comprehensive certification covering advanced React concepts, hooks, context API, and performance optimization techniques.',
    image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2023-08-10',
    year: '2023'
  }
];

export const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications: Best Practices and Patterns',
    content: `# Building Scalable React Applications

When building large-scale React applications, following best practices and established patterns is crucial for maintainability and performance.

## Component Architecture

One of the most important aspects of scalable React applications is having a well-thought-out component architecture. Here are some key principles:

### 1. Single Responsibility Principle
Each component should have a single, well-defined purpose. This makes components easier to test, debug, and reuse.

### 2. Composition over Inheritance
React favors composition over inheritance. Use component composition to build complex UIs from simpler components.

### 3. Container and Presentational Components
Separate your components into containers (smart components) that handle logic and state, and presentational components (dumb components) that focus on rendering UI.

## State Management

For complex applications, consider using state management libraries like Redux, Zustand, or React Context API for global state management.

## Performance Optimization

- Use React.memo for component memoization
- Implement code splitting with React.lazy
- Optimize bundle size with tree shaking
- Use React DevTools Profiler to identify performance bottlenecks

## Conclusion

Building scalable React applications requires careful planning and adherence to best practices. By following these guidelines, you can create maintainable and performant applications that can grow with your needs.`,
    excerpt: 'Learn essential best practices and patterns for building scalable React applications that can grow with your project needs.',
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['React', 'JavaScript', 'Frontend', 'Best Practices'],
    publishedAt: '2024-01-15',
    isPublished: true,
    readTime: 8
  },
  {
    id: '2',
    title: 'The Future of Web Development: Trends to Watch in 2024',
    content: `# The Future of Web Development: Trends to Watch in 2024

The web development landscape is constantly evolving, and 2024 promises to bring exciting new trends and technologies.

## Key Trends

### 1. AI-Powered Development Tools
AI is revolutionizing how we write code, with tools like GitHub Copilot and ChatGPT helping developers be more productive.

### 2. WebAssembly (WASM)
WebAssembly is gaining traction for performance-critical applications, allowing languages like Rust and C++ to run in the browser.

### 3. Edge Computing
Moving computation closer to users with edge computing solutions for better performance and reduced latency.

### 4. Progressive Web Apps (PWAs)
PWAs continue to bridge the gap between web and native applications, offering app-like experiences in the browser.

## Conclusion

Staying updated with these trends will help developers build better, more efficient applications in 2024 and beyond.`,
    excerpt: 'Explore the latest trends and technologies shaping the future of web development in 2024.',
    image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Web Development', 'Trends', 'AI', 'WebAssembly'],
    publishedAt: '2024-02-01',
    isPublished: true,
    readTime: 6
  },
  {
    id: '3',
    title: 'Mastering TypeScript: Advanced Types and Patterns',
    content: `# Mastering TypeScript: Advanced Types and Patterns

TypeScript has become an essential tool for modern JavaScript development. Let's explore some advanced concepts.

## Advanced Types

### Union and Intersection Types
Learn how to combine types effectively using union (|) and intersection (&) operators.

### Conditional Types
Conditional types allow you to create types that depend on a condition, making your type system more flexible.

### Mapped Types
Transform existing types by mapping over their properties to create new types.

## Design Patterns

### Factory Pattern
Use TypeScript's type system to create robust factory patterns for object creation.

### Observer Pattern
Implement type-safe observer patterns for event handling and state management.

## Best Practices

- Use strict TypeScript configuration
- Leverage utility types like Partial, Pick, and Omit
- Create custom type guards for runtime type checking
- Use generics for reusable type-safe functions

This article is currently in draft mode and will be published soon.`,
    excerpt: 'Deep dive into advanced TypeScript concepts, patterns, and best practices for professional development.',
    image: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['TypeScript', 'JavaScript', 'Programming', 'Advanced'],
    publishedAt: '2024-02-10',
    isPublished: false,
    readTime: 12
  }
];

export const mockChatbotResponses: ChatbotResponse[] = [
  {
    id: '1',
    trigger: 'hello',
    response: 'Hello! Welcome to my portfolio. I\'m here to help you learn more about my work and experience. How can I assist you today?',
    category: 'greeting',
    isActive: true
  },
  {
    id: '2',
    trigger: 'projects',
    response: 'I\'ve worked on various exciting projects including e-commerce platforms, task management apps, and weather dashboards. You can view all my projects in the Projects section. Which type of project interests you most?',
    category: 'projects',
    isActive: true
  },
  {
    id: '3',
    trigger: 'skills',
    response: 'I specialize in full-stack development with expertise in React, TypeScript, Node.js, and cloud technologies. I\'m also experienced with databases, DevOps, and modern development practices. What specific technology would you like to know more about?',
    category: 'skills',
    isActive: true
  },
  {
    id: '4',
    trigger: 'contact',
    response: 'I\'d love to hear from you! You can reach me at hello@portfolio.com or connect with me on LinkedIn and GitHub. I\'m always open to discussing new opportunities and collaborations.',
    category: 'contact',
    isActive: true
  },
  {
    id: '5',
    trigger: 'experience',
    response: 'I have 5+ years of experience in full-stack development, working with startups and established companies. I\'ve led development teams, architected scalable solutions, and delivered projects from concept to production.',
    category: 'experience',
    isActive: true
  },
  {
    id: '6',
    trigger: 'hire',
    response: 'I\'m currently available for freelance projects and full-time opportunities. I\'m particularly interested in React/Node.js projects and innovative web applications. Let\'s discuss how I can help bring your ideas to life!',
    category: 'hiring',
    isActive: true
  },
  {
    id: '7',
    trigger: 'technologies',
    response: 'I work with modern web technologies including React, TypeScript, Node.js, Python, AWS, Docker, and PostgreSQL. I stay updated with the latest trends and continuously learn new technologies to deliver cutting-edge solutions.',
    category: 'technical',
    isActive: true
  }
];

export const mockSiteContent: SiteContent = {
  introTitle: 'Full Stack Developer & UI/UX Enthusiast',
  introDescription: 'I craft beautiful, functional web applications that solve real-world problems. With expertise in React, Node.js, and modern web technologies, I bring ideas to life through code.',
  contactEmail: 'hello@portfolio.com',
  socialLinks: {
    github: 'https://github.com/username',
    linkedin: 'https://linkedin.com/in/username',
    twitter: 'https://twitter.com/username'
  },
  aboutText: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. I specialize in React, TypeScript, and Node.js, with a strong focus on user experience and clean code architecture.'
};

export const mockAdminSettings: AdminSettings = {
  name: 'Alex Johnson',
  email: 'admin@portfolio.com',
  theme: 'light'
};