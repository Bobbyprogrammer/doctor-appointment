"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import toast from "react-hot-toast";

import {
  getAdminBlogsApi,
  createBlogApi,
  updateBlogApi,
  deleteBlogApi,
} from "../services/blogs.api";

import type {
  Blog,
  CreateBlogPayload,
  CreateBlogResponse,
} from "@/types/blog";

interface BlogsContextType {
  blogs: Blog[];
  loading: boolean;
  fetchBlogs: () => Promise<void>;
  createBlog: (
    payload: CreateBlogPayload
  ) => Promise<CreateBlogResponse>;
  updateBlog: (
    id: string,
    payload: CreateBlogPayload
  ) => Promise<{ success: boolean; message: string }>;
  deleteBlog: (
    id: string
  ) => Promise<{ success: boolean; message: string }>;
}

const BlogsContext = createContext<BlogsContextType | undefined>(undefined);

export const BlogsProvider = ({ children }: { children: ReactNode }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAdminBlogsApi();

      if (data.success) {
        setBlogs(data.blogs || []);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (
    payload: CreateBlogPayload
  ): Promise<CreateBlogResponse> => {
    try {
      const data = await createBlogApi(payload);

      if (data.success) {
        setBlogs((prev) => [data.blog, ...prev]);
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create blog",
        blog: {} as Blog,
      };
    }
  };

  const updateBlog = async (
    id: string,
    payload: CreateBlogPayload
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const data = await updateBlogApi(id, payload);

      if (data.success) {
        await fetchBlogs();
        return {
          success: true,
          message: data.message || "Blog updated successfully",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to update blog",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update blog",
      };
    }
  };

  const deleteBlog = async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const data = await deleteBlogApi(id);

      if (data.success) {
        setBlogs((prev) => prev.filter((blog) => blog._id !== id));
        return {
          success: true,
          message: data.message || "Blog deleted successfully",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to delete blog",
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to delete blog",
      };
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <BlogsContext.Provider
      value={{
        blogs,
        loading,
        fetchBlogs,
        createBlog,
        updateBlog,
        deleteBlog,
      }}
    >
      {children}
    </BlogsContext.Provider>
  );
};

export const useBlogs = () => {
  const context = useContext(BlogsContext);

  if (!context) {
    throw new Error("useBlogs must be used within BlogsProvider");
  }

  return context;
};