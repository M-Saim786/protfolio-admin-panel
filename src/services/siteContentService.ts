import { apiService } from './api';

export interface SiteContentRequest {
  introTitle: string;
  introDescription: string;
  contactEmail: string;
  githubLink: string;
  linkedinLink: string;
  twitterLink: string;
  aboutText: string;
}

export interface SiteContentResponse extends SiteContentRequest {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export class SiteContentService {
  async getAllSiteContent(): Promise<SiteContentResponse[]> {
    return apiService.get<SiteContentResponse[]>('/api/site-content');
  }

  async getSiteContentById(id: string): Promise<SiteContentResponse> {
    return apiService.get<SiteContentResponse>(`/api/site-content/${id}`);
  }

  async createSiteContent(content: SiteContentRequest): Promise<SiteContentResponse> {
    return apiService.post<SiteContentResponse>('/api/site-content', content);
  }

  async updateSiteContent(id: string, content: Partial<SiteContentRequest>): Promise<SiteContentResponse> {
    return apiService.put<SiteContentResponse>(`/api/site-content/${id}`, content);
  }

  async deleteSiteContent(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/site-content/${id}`);
  }
}

export const siteContentService = new SiteContentService();