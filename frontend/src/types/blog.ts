export interface Blog {
  _id?: string;
  id?: string;

  title: string;
  slug: string;
  shortDescription: string;
  content: string;

  thumbnail?: string;
  thumbnailPublicId?: string;

  category: string;
  tags: string[];

  authorName: string;

  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface GetBlogsResponse {
  success: boolean;
  count?: number;
  blogs: Blog[];
  message?: string;
}

export interface GetSingleBlogResponse {
  success: boolean;
  blog: Blog;
  message?: string;
}