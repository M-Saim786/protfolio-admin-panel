import { apiService } from './api';

export interface SkillRequest {
  skillName: string;
  icon: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface SkillResponse extends SkillRequest {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export class SkillService {
  async getAllSkills(): Promise<SkillResponse[]> {
    return apiService.get<SkillResponse[]>('/api/skills');
  }

  async getSkillById(id: string): Promise<SkillResponse> {
    return apiService.get<SkillResponse>(`/api/skills/${id}`);
  }

  async createSkill(skill: SkillRequest): Promise<SkillResponse> {
    return apiService.post<SkillResponse>('/api/skills', skill);
  }

  async updateSkill(id: string, skill: Partial<SkillRequest>): Promise<SkillResponse> {
    return apiService.put<SkillResponse>(`/api/skills/${id}`, skill);
  }

  async deleteSkill(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/skills/${id}`);
  }
}

export const skillService = new SkillService();