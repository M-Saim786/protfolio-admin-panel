import { apiService } from './api';

export interface ContactMessageRequest {
  senderName: string;
  email: string;
  message: string;
}

export interface ContactMessageResponse extends ContactMessageRequest {
  _id: string;
  timestamp: string;
  isRead: boolean;
}

export class ContactService {
  async sendContactMessage(message: ContactMessageRequest): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/api/contact-us', message);
  }

  async getAllContactMessages(): Promise<ContactMessageResponse[]> {
    return apiService.get<ContactMessageResponse[]>('/api/contact-messages');
  }

  async getContactMessageById(id: string): Promise<ContactMessageResponse> {
    return apiService.get<ContactMessageResponse>(`/api/contact-messages/${id}`);
  }

  async updateContactMessage(id: string, message: Partial<ContactMessageRequest>): Promise<ContactMessageResponse> {
    return apiService.put<ContactMessageResponse>(`/api/contact-messages/${id}`, message);
  }

  async deleteContactMessage(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/contact-messages/${id}`);
  }

  async markAsRead(id: string): Promise<ContactMessageResponse> {
    return apiService.patch<ContactMessageResponse>(`/api/contact-messages/${id}/read`);
  }
}

export const contactService = new ContactService();