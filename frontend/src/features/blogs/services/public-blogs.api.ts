import api from "@/lib/axios";
import type { GetBlogsResponse, GetSingleBlogResponse } from "@/types/blog";

export const getPublishedBlogsApi = async () => {
  const { data } = await api.get<GetBlogsResponse>("/blogs");
  return data;
};

export const getPublishedBlogBySlugApi = async (slug: string) => {
  const { data } = await api.get<GetSingleBlogResponse>(`/blogs/slug/${slug}`);
  return data;
};