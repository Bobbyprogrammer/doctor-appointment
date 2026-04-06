import api from "@/lib/axios";
import type {
  GetBlogsResponse,
  CreateBlogPayload,
  CreateBlogResponse,
} from "@/types/blog";

export const getAdminBlogsApi = async () => {
  const { data } = await api.get<GetBlogsResponse>("/blogs/admin/all");
  return data;
};

export const getBlogByIdApi = async (id: string) => {
  const { data } = await api.get(`/blogs/admin/${id}`);
  return data;
};

export const createBlogApi = async (payload: CreateBlogPayload) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("slug", payload.slug);
  formData.append("shortDescription", payload.shortDescription);
  formData.append("content", payload.content);
  formData.append("category", payload.category);
  formData.append("tags", payload.tags.join(","));
  formData.append("authorName", payload.authorName);
  formData.append("isPublished", String(payload.isPublished));
  formData.append("isFeatured", String(payload.isFeatured));

  if (payload.thumbnail) {
    formData.append("thumbnail", payload.thumbnail);
  }

  const { data } = await api.post<CreateBlogResponse>(
    "/blogs/admin/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const updateBlogApi = async (
  id: string,
  payload: CreateBlogPayload
) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("slug", payload.slug);
  formData.append("shortDescription", payload.shortDescription);
  formData.append("content", payload.content);
  formData.append("category", payload.category);
  formData.append("tags", payload.tags.join(","));
  formData.append("authorName", payload.authorName);
  formData.append("isPublished", String(payload.isPublished));
  formData.append("isFeatured", String(payload.isFeatured));

  if (payload.thumbnail) {
    formData.append("thumbnail", payload.thumbnail);
  }

  const { data } = await api.put(`/blogs/admin/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const deleteBlogApi = async (id: string) => {
  const { data } = await api.delete(`/blogs/admin/${id}`);
  return data;
};