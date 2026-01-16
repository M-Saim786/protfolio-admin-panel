import { apiService } from './api';

export interface SectionRequest {
  name: string;
  content: string;
  order: number;
}

export interface SectionResponse extends SectionRequest {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export class SectionService {
  async getAllSections(): Promise<SectionResponse[]> {
    return apiService.get<SectionResponse[]>('/api/sections');
  }

  async getSectionById(id: string): Promise<SectionResponse> {
    return apiService.get<SectionResponse>(`/api/sections/${id}`);
  }

  async createSection(section: SectionRequest): Promise<SectionResponse> {
    return apiService.post<SectionResponse>('/api/sections', section);
  }

  async updateSection(id: string, section: Partial<SectionRequest>): Promise<SectionResponse> {
    return apiService.put<SectionResponse>(`/api/sections/${id}`, section);
  }

  async deleteSection(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/sections/${id}`);
  }
}

export const sectionService = new SectionService();