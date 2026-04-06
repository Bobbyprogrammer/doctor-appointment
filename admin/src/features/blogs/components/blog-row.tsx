"use client";

import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/types/blog";
import { useBlogs } from "../context/BlogsContext";
import BlogFormDialog from "./blog-form-dialog";

export default function BlogRow({ blog }: { blog: Blog }) {
  const { deleteBlog } = useBlogs();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${blog.title}"?`
    );

    if (!confirmed || !blog._id) return;

    const res = await deleteBlog(blog._id);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#24303d] p-5 shadow">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <img
            src={blog.thumbnail || "/placeholder.jpg"}
            alt={blog.title}
            className="h-24 w-32 rounded-xl object-cover"
          />

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">{blog.title}</h3>

            <p className="line-clamp-2 text-sm text-slate-400">
              {blog.shortDescription || "No description"}
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-blue-500/15 px-3 py-1 text-blue-300">
                {blog.category}
              </span>

              <span
                className={`rounded-full px-3 py-1 ${
                  blog.isPublished
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-yellow-500/15 text-yellow-300"
                }`}
              >
                {blog.isPublished ? "Published" : "Draft"}
              </span>

              {blog.isFeatured ? (
                <span className="rounded-full bg-pink-500/15 px-3 py-1 text-pink-300">
                  Featured
                </span>
              ) : null}
            </div>

            <p className="text-xs text-slate-500">
              Slug: <span className="text-slate-300">{blog.slug}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <BlogFormDialog blog={blog} />

          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-500 text-white"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}