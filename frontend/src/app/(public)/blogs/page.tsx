import PublicBlogCard from "@/features/blogs/components/public-blog-card";
import { getPublishedBlogsApi } from "@/features/blogs/services/public-blogs.api";
import type { Blog } from "@/types/blog";

export default async function BlogsPage() {
  let blogs: Blog[] = [];

  try {
    const data = await getPublishedBlogsApi();
    blogs = data.blogs || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }

  return (
    <div className="min-h-screen bg-[#1b2431] text-white">
      {/* HERO */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-green-100">
              Insights & Articles
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Blogs & Health Resources
            </h1>
          </div>
        </div>
      </section>

      {/* BLOGS GRID */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {blogs.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <PublicBlogCard key={blog._id || blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#24303d] p-12 text-center text-slate-400">
            No blogs available right now.
          </div>
        )}
      </section>
    </div>
  );
}