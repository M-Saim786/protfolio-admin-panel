import { apiService } from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>('/api/login', credentials);
      
      if (response.token) {
        apiService.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout(): void {
    apiService.clearToken();
    localStorage.removeItem('demo_mode');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('portfolio_admin_token');
  }

  getToken(): string | null {
    return localStorage.getItem('portfolio_admin_token');
  }

  // Demo mode for when backend is not available
  setDemoToken(token: string): void {
    localStorage.setItem('portfolio_admin_token', token);
    localStorage.setItem('demo_mode', 'true');
    apiService.setToken(token);
  }

  isDemoMode(): boolean {
    return localStorage.getItem('demo_mode') === 'true';
  }
}

export const authService = new AuthService();