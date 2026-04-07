import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedBlogBySlugApi } from "@/features/blogs/services/public-blogs.api";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const data = await getPublishedBlogBySlugApi(slug);
    const blog = data.blog;

    return {
      title: `${blog.title} | Blog`,
      description: blog.shortDescription || blog.title,
      openGraph: {
        title: blog.title,
        description: blog.shortDescription || blog.title,
        images: blog.thumbnail ? [blog.thumbnail] : [],
      },
    };
  } catch {
    return {
      title: "Blog Details",
      description: "Read our latest healthcare blog.",
    };
  }
}

export default async function BlogDetailsPage({ params }: Props) {
  let blog = null;

  try {
    const { slug } = await params;
    const data = await getPublishedBlogBySlugApi(slug);
    blog = data.blog;
  } catch (error) {
    console.error("Error fetching blog details:", error);
  }

  if (!blog) return notFound();

  return (
    <div className="min-h-screen bg-[#1b2431] text-white">
      {/* HERO */}
      <section className="relative">
        <div className="h-[420px] w-full overflow-hidden">
          <img
            src={blog.thumbnail || "/placeholder.jpg"}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-500/20 px-4 py-1 text-xs font-semibold text-green-300">
                  {blog.category}
                </span>

                {blog.isFeatured ? (
                  <span className="rounded-full bg-pink-500/20 px-4 py-1 text-xs font-semibold text-pink-300">
                    Featured
                  </span>
                ) : null}
              </div>

              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                {blog.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-200">
                <span>By {blog.authorName || "Admin"}</span>
                <span>•</span>
                <span>
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString()
                    : blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        {blog.shortDescription ? (
          <div className="mb-8 rounded-3xl border border-white/10 bg-[#24303d] p-6">
            <p className="text-lg leading-8 text-slate-300">
              {blog.shortDescription}
            </p>
          </div>
        ) : null}

        <article className="rounded-3xl border border-white/10 bg-[#24303d] p-8 shadow-xl">
          <div
            className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {blog.tags?.length > 0 ? (
          <div className="mt-10 flex flex-wrap gap-3">
            {blog.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}