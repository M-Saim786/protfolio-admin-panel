import { apiService } from './api';

export interface CertificateRequest {
  title: string;
  institute: string;
  type: 'Certification' | 'Achievement';
  description: string;
  imageUrl: string;
  date: string;
  year: number;
}

export interface CertificateResponse extends CertificateRequest {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export class CertificateService {
  async getAllCertificates(): Promise<CertificateResponse[]> {
    return apiService.get<CertificateResponse[]>('/api/certificates');
  }

  async getCertificateById(id: string): Promise<CertificateResponse> {
    return apiService.get<CertificateResponse>(`/api/certificates/${id}`);
  }

  async createCertificate(certificate: CertificateRequest): Promise<CertificateResponse> {
    return apiService.post<CertificateResponse>('/api/certificates', certificate);
  }

  async updateCertificate(id: string, certificate: Partial<CertificateRequest>): Promise<CertificateResponse> {
    return apiService.put<CertificateResponse>(`/api/certificates/${id}`, certificate);
  }

  async deleteCertificate(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/api/certificates/${id}`);
  }
}

export const certificateService = new CertificateService();