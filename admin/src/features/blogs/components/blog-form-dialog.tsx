"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useBlogs } from "../context/BlogsContext";
import type { Blog } from "@/types/blog";

interface Props {
  blog?: Blog | null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogFormDialog({ blog }: Props) {
  const isEdit = !!blog;
  const { createBlog, updateBlog } = useBlogs();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [tags, setTags] = useState("");
  const [authorName, setAuthorName] = useState("Admin");
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (thumbnail) return URL.createObjectURL(thumbnail);
    return blog?.thumbnail || "";
  }, [thumbnail, blog?.thumbnail]);

  useEffect(() => {
    if (open) {
      setTitle(blog?.title || "");
      setSlug(blog?.slug || "");
      setShortDescription(blog?.shortDescription || "");
      setContent(blog?.content || "");
      setCategory(blog?.category || "general");
      setTags(blog?.tags?.join(", ") || "");
      setAuthorName(blog?.authorName || "Admin");
      setIsPublished(blog?.isPublished || false);
      setIsFeatured(blog?.isFeatured || false);
      setThumbnail(null);
    }
  }, [open, blog]);

  const handleSubmit = async () => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast.error("Title, slug and content are required");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        shortDescription: shortDescription.trim(),
        content,
        category: category.trim(),
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        authorName: authorName.trim(),
        isPublished,
        isFeatured,
        thumbnail,
      };

      if (isEdit && blog?._id) {
        const res = await updateBlog(blog._id, payload);

        if (res.success) {
          toast.success(res.message);
          setOpen(false);
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await createBlog(payload);

        if (res.success) {
          toast.success(res.message || "Blog created successfully");
          setOpen(false);
        } else {
          toast.error(res.message);
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="sm" variant="outline" className="text-black">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Blog
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#24303d] text-white sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Blog" : "Create Blog"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  const value = e.target.value;
                  setTitle(value);
                  if (!isEdit) setSlug(slugify(value));
                }}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                placeholder="my-blog-title"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Short Description
            </label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              placeholder="Short summary of the blog"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              placeholder="Write blog content here..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                placeholder="healthcare"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                placeholder="health, wellness, doctor"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                placeholder="Admin"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
              className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
            />

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-4 h-40 w-full rounded-2xl object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Publish Blog
            </label>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Featured Blog
            </label>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update Blog"
                : "Create Blog"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}