// API Configuration and Base Service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;
  private isOfflineMode: boolean = false;


  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('portfolio_admin_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('portfolio_admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('portfolio_admin_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {};

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    headers["Content-Type"] = "application/json";
    return headers;
  }

  private getFormDataHeaders(): HeadersInit {
    const headers: HeadersInit = {};

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    // ❌ DO NOT set Content-Type
    return headers;
  }



  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      console.log("response", response)
      console.log("response", response.status)
      if (response.status === 401) {
        localStorage.removeItem("portfolio_admin_token")
        throw window.location.replace("/login")
      }
      console.log("error", errorData)
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text() as unknown as T;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: options.headers ?? this.getHeaders(), // ✅ RESPECT passed headers
      });

      this.isOfflineMode = false;
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);

      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        this.isOfflineMode = true;
        throw new Error('Unable to connect to server. Please check if the backend is running on ' + this.baseURL);
      }

      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    });
  }

  getIsOfflineMode(): boolean {
    return this.isOfflineMode;
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  async postFormData<T>(endpoint: string, data: FormData): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data,
      headers: this.getFormDataHeaders(),
    });
  }

  async putFormData<T>(endpoint: string, data: FormData): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data,
      headers: this.getFormDataHeaders(),
    });
  }


}

export const apiService = new ApiService(API_BASE_URL);