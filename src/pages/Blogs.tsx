import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, Clock, Tag, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify'; // <-- Add this import
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { blogService, BlogResponse, BlogRequest } from '../services/blogService';
import DescriptionEditor from '../components/DescriptionBox';
import { useConfirmBeforeLeave } from '../utils/beforeunload';

const REVALIDATE_SECRET = import.meta.env.REVALIDATE_SECRET || 'ce17914c6e797c0dbb2180c62b0c2e7e404531fd91e8581512a0aa164a0918c5e14b08768faefa426eff4259caa0f3b9955c'
  ;




export const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    slug: '',
    excerpt: '',
    content: '',
    imageFile: null as File | null, // ✅ new

    imageUrl: '',
    readTime: '5',
    tags: '',
    isPublished: false,
  });

  useConfirmBeforeLeave(isModalOpen)

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Error loading blogs:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      slug: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      imageFile: null as File | null, // ✅ new

      readTime: '5',
      tags: '',
      isPublished: false,
    });
    setEditingBlog(null);
  };

  const handleOpenModal = (blog?: BlogResponse) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        category: blog.category,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        imageUrl: blog.image || '',
        imageFile: null as File | null, // ✅ new

        readTime: blog.readTime || '5',
        tags: blog.tags?.join(', ') || '',
        isPublished: blog.isPublished ?? false,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const slug =
        formData.slug ||
        formData.title
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "");

      const data = new FormData();

      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("slug", slug);
      data.append("excerpt", formData.excerpt);
      data.append("content", formData.content);
      data.append("readTime", formData.readTime);
      data.append("tags", formData.tags); // backend splits
      data.append("isPublished", String(formData.isPublished));

      // ✅ FILE upload
      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      } else if (formData.imageUrl) {
        data.append("imageUrl", formData.imageUrl);
      }

      if (editingBlog) {
        await blogService.updateBlogFormData(editingBlog._id, data);
        toast.success("Blog post updated successfully!");
      } else {
        await blogService.createBlogFormData(data);
        toast.success("Blog post created successfully!");
      }


      // ... inside handleSubmit ...

      // if (formData.isPublished) {
        // Calculate the final slug exactly as you did above
        const finalSlug = editingBlog ? editingBlog.slug : slug;

        // await fetch("https://thankful-sea-01c7a0b00.4.azurestaticapps.net/api/revalidate", {
        await fetch("https://personal-portfolio-pi-flax.vercel.app/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // <--- ADD THIS
            Authorization: `Bearer ${REVALIDATE_SECRET}`,
          },
          // V-- ADD THIS BODY
          body: JSON.stringify({
            slug: finalSlug
          }),
        });
      // }


      // if (formData.isPublished) {
      //   await fetch("https://thankful-sea-01c7a0b00.4.azurestaticapps.net/api/revalidate", {
      //   // await fetch("http://localhost:3000/api/revalidate", {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${REVALIDATE_SECRET}`,
      //     },
      //   });
      // }

      await loadBlogs();
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save blog post");
    } finally {
      setSubmitting(false);
    }
  };


  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deleteBlog(id);
        toast.success('Blog post deleted successfully!');
        await loadBlogs();
      } catch (error) {
        toast.error('Failed to delete blog post');
      }
    }
  };

  const togglePublishStatus = async (id: string) => {
    const blog = blogs.find(b => b._id === id);
    if (!blog) return;

    try {
      await blogService.updateBlog(id, { isPublished: !blog.isPublished });
      toast.success(`Blog ${!blog.isPublished ? 'published' : 'unpublished'} successfully!`);
      await loadBlogs();
    } catch (error) {
      toast.error('Failed to update publish status');
    }
  };

  // counts (put near filteredBlogs or above return)
  const publishedCount = blogs.filter((b) => b.isPublished).length;
  const allCount = blogs.length;

  const tabLabel =
    selectedStatus === "published" ? "active" : selectedStatus; // for empty state text


  const filteredBlogs = selectedStatus === 'all'
    ? blogs
    : blogs.filter(blog => selectedStatus === 'published' ? blog.isPublished : !blog.isPublished);

  // const publishedCount = blogs.filter(b => b.isPublished).length;
  // const draftCount = blogs.filter(b => !b.isPublished).length;

  // const avgReadTime = blogs.length > 0
  //   ? Math.round(blogs.reduce((acc, blog) => acc + parseInt(blog.readTime || '5'), 0) / blogs.length)
  //   : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-gray-600">Create and manage your blog content</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          New Blog Post
        </Button>
      </div>

      {/* Stats + Filters */}
      {/* ... (unchanged stats and filter buttons) ... */}
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="inline-flex gap-1 rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setSelectedStatus("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedStatus === "all"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            All
            <span className="ml-2 text-xs text-gray-500">{allCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus("published")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedStatus === "published"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Active
            <span className="ml-2 text-xs text-gray-500">{publishedCount}</span>
          </button>
        </div>
      </div>


      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <Card key={blog._id} className="hover:shadow-lg transition-shadow duration-200">
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={"https://res.cloudinary.com/dk3hy0n39/image" + blog.image || 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {blog.readTime || '5'}m
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{blog.title}</h3>

                {/* Safely render excerpt as HTML (supports bold, links, etc. if you write Markdown later) */}
                <div
                  className="text-gray-600 text-sm prose prose-sm max-w-none line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(blog.excerpt || ''),
                  }}
                />

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center">
                        <Tag className="w-2 h-2 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => togglePublishStatus(blog._id)}
                    className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${blog.isPublished
                      ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                  >
                    {blog.isPublished ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                    {blog.isPublished ? 'Unpublish' : 'Publish'}
                  </button>

                  <div className="flex space-x-2">
                    <button onClick={() => handleOpenModal(blog)} className="p-2 text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(blog._id)} className="p-2 text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBlogs.length === 0 && (
        <Card className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-500 mb-4">
            {selectedStatus === 'all' ? 'Start by creating your first blog post' : `No ${selectedStatus} posts found.`}
          </p>
          <Button onClick={() => handleOpenModal()} icon={Plus}>
            Create Blog Post
          </Button>
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(value) => {
              setFormData((prev) => {
                const newTitle = value;
                const generatedSlug = newTitle
                  .trim()
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^\w\-]+/g, '')
                  .replace(/\-\-+/g, '-')
                  .replace(/^-+/, '')
                  .replace(/-+$/, '');

                const shouldAutoUpdateSlug = !prev.slug || prev.slug === '' ||
                  prev.slug === (prev.title || '')
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '');

                return {
                  ...prev,
                  title: newTitle,
                  slug: shouldAutoUpdateSlug ? generatedSlug : prev.slug,
                };
              });
            }}
            placeholder="Enter blog post title"
            required
          />

          <Input
            label="Category"
            value={formData.category}
            onChange={
              (value) => {
                setFormData((prev) => ({
                  ...prev,
                  category: value,
                }))
              }
            }
            // disabled={f}
            placeholder="Blog Category Like (Backend Development, React JS etc)."
          // helperText="This is automatically generated and cannot be edited manually."
          />


          <Input
            label="Slug (URL-friendly)"
            value={formData.slug}
            onChange={() => { }}
            disabled={true}
            placeholder="Auto-generated from title"
          // helperText="This is automatically generated and cannot be edited manually."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Featured Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  imageFile: e.target.files?.[0] || null,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />

            <p className="text-xs text-gray-500 mt-1">
              Upload an image (recommended). If you don’t upload, URL field will be used.
            </p>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt (Short Summary)
            </label>

            <DescriptionEditor
              value={formData.excerpt}
              handleInputChange={(value) => setFormData(prev => ({ ...prev, excerpt: value }))}
            // placeholder="Brief summary (supports HTML/Markdown)"
            // rows={3}
            // required
            />
          </div>


          {/* <Input
            label="Excerpt (Short Summary)"
            type="textarea"
            value={formData.excerpt}
            onChange={(value) => setFormData(prev => ({ ...prev, excerpt: value }))}
            placeholder="Brief summary (supports HTML/Markdown)"
            rows={3}
            required
          />
 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (Complete Description) <span className="text-red-500">*</span>
            </label>
            <DescriptionEditor
              value={formData.content}
              handleInputChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
            />


            {/* <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your blog post here. You can use HTML or Markdown (e.g. <strong>bold</strong>, <em>italic</em>, links, lists, etc.)"
              rows={15}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              required
            /> */}
            <p className="text-xs text-gray-500 mt-1">HTML is allowed and will be safely rendered.</p>
          </div>

          {/* Rest of form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Featured Image URL"
              type="url"
              value={formData.imageUrl}
              onChange={(value) => setFormData(prev => ({ ...prev, imageUrl: value }))}
              placeholder="https://example.com/blog-image.jpg"
            />
            <Input
              label="Read Time (minutes)"
              type="text"
              value={formData.readTime}
              onChange={(value) => setFormData(prev => ({ ...prev, readTime: value }))}
              placeholder="5"
            />
          </div>

          <Input
            label="Tags (comma-separated)"
            value={formData.tags}
            onChange={(value) => setFormData(prev => ({ ...prev, tags: value }))}
            placeholder="React, TypeScript, Web Development"
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleCloseModal} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingBlog ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};