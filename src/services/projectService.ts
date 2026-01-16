import { apiService } from './api';

export interface ProjectRequest {
  title: string;
  description: string;
  techStack: string[];
  images: string[];
  keyFeatures: string[];
  githubUrl: string;
  liveUrl: string;
}

export interface ProjectResponse extends ProjectRequest {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export class ProjectService {
  async getAllProjects(): Promise<ProjectResponse[]> {
    return apiService.get<ProjectResponse[]>('/api/projects');
  }

  async getProjectById(id: string): Promise<ProjectResponse> {
    return apiService.get<ProjectResponse>(`/api/projects/${id}`);
  }

  async createProject(project: ProjectRequest): Promise<ProjectResponse> {
    return apiService.post<ProjectResponse>('/api/projects', project);
  }

  async updateProject(id: string, project: Partial<ProjectRequest>): Promise<ProjectResponse> {
    return apiService.put<ProjectResponse>(`/api/projects/${id}`, project);
  }

  async deleteProject(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/projects/${id}`);
  }
}

export const projectService = new ProjectService();