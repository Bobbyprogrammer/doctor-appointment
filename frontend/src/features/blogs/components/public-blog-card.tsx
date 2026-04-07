"use client";

import Link from "next/link";
import type { Blog } from "@/types/blog";

interface Props {
  blog: Blog;
}

export default function PublicBlogCard({ blog }: Props) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-[#24303d] shadow-xl transition hover:-translate-y-1 hover:border-white/20"
    >
      <div className="overflow-hidden">
        <img
          src={blog.thumbnail || "/placeholder.jpg"}
          alt={blog.title}
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
            {blog.category}
          </span>

          {blog.isFeatured ? (
            <span className="rounded-full bg-pink-500/15 px-3 py-1 text-xs font-medium text-pink-300">
              Featured
            </span>
          ) : null}
        </div>

        <div>
          <h3 className="line-clamp-2 text-xl font-bold text-white transition group-hover:text-green-300">
            {blog.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
            {blog.shortDescription || "No description available."}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{blog.authorName || "Admin"}</span>
          <span>
            {blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString()
              : blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString()
              : "-"}
          </span>
        </div>
      </div>
    </Link>
  );
}