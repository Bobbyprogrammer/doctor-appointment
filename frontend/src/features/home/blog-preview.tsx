import PublicBlogCard from "@/features/blogs/components/public-blog-card";
import { getPublishedBlogsApi } from "@/features/blogs/services/public-blogs.api";

export default async function BlogPreview() {
  let blogs: any[] = [];

  try {
    const data = await getPublishedBlogsApi(); 
    blogs = data.blogs || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-black">Latest Articles</h2>

        <a
          href="/blogs"
          className="text-sm font-medium text-teal-400 hover:underline"
        >
          View All →
        </a>
      </div>

      {blogs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3">
          {blogs.slice(0, 3).map((blog: any) => (
            <PublicBlogCard
              key={blog._id || blog.id}
              blog={blog}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#24303d] p-8 text-center text-slate-400">
          No blogs available right now.
        </div>
      )}
    </section>
  );
}