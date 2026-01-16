// services/blogService.ts  (or wherever you keep your services)

export interface BlogRequest {
  title: string;
  category: string;
  slug: string;
  excerpt: string;
  content: string;
  // imageUrl?: string;
  image?: string;
  readTime?: string;
  tags?: string[];
  isPublished?: boolean;
  imageFile: File | null;
}

export interface BlogResponse extends BlogRequest {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteBlogResponse {
  message: string;
}


import { apiService } from './api'; // adjust path if needed

export class BlogService {
  // Public: Get all published blogs (for frontend)
  async getPublishedBlogs(): Promise<BlogResponse[]> {
    return apiService.get<BlogResponse[]>('/api/blog');
  }

  // Public: Get single blog by slug (SEO-friendly)
  async getBlogBySlug(slug: string): Promise<BlogResponse> {
    return apiService.get<BlogResponse>(`/api/blog/${slug}`);
  }

  // Admin: Get all blogs (including drafts)
  async getAllBlogs(): Promise<BlogResponse[]> {
    return apiService.get<BlogResponse[]>('/api/admin/blog');
  }

  // Admin: Get single blog by ID
  async getBlogById(id: string): Promise<BlogResponse> {
    return apiService.get<BlogResponse>(`/api/admin/blog/${id}`);
  }

  // Admin: Create new blog
  async createBlog(blog: BlogRequest): Promise<BlogResponse> {
    return apiService.post<BlogResponse>('/api/admin/blog', blog);
  }

  // Admin: Update blog
  async updateBlog(id: string, blog: Partial<BlogRequest>): Promise<BlogResponse> {
    return apiService.put<BlogResponse>(`/api/admin/blog/${id}`, blog);
  }

  // Admin: Delete blog
  async deleteBlog(id: string): Promise<DeleteBlogResponse> {
    return apiService.delete<DeleteBlogResponse>(`/api/admin/blog/${id}`);
  }


  // Admin: Create blog (FormData)
  async createBlogFormData(data: FormData): Promise<BlogResponse> {
    return apiService.postFormData<BlogResponse>("/api/admin/blog", data);
  }

  // Admin: Update blog (FormData)
  async updateBlogFormData(id: string, data: FormData): Promise<BlogResponse> {
    return apiService.putFormData<BlogResponse>(`/api/admin/blog/${id}`, data);
  }

}

// Export a singleton instance (just like your certificateService)
export const blogService = new BlogService();