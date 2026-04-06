"use client";

import BlogFormDialog from "@/features/blogs/components/blog-form-dialog";
import BlogRow from "@/features/blogs/components/blog-row";
import {
  BlogsProvider,
  useBlogs,
} from "@/features/blogs/context/BlogsContext";

function AdminBlogsPageContent() {
  const { blogs, loading } = useBlogs();

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-6 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Blogs</h1>
            <p className="mt-2 text-sm text-purple-100">
              Manage blog posts, drafts, thumbnails, and featured content.
            </p>
          </div>

          <BlogFormDialog />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl bg-[#24303d]"
            />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <BlogRow key={blog._id || blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#24303d] p-10 text-center text-slate-400">
          No blogs found.
        </div>
      )}
    </div>
  );
}

export default function AdminBlogsPage() {
  return (
    <BlogsProvider>
      <AdminBlogsPageContent />
    </BlogsProvider>
  );
}