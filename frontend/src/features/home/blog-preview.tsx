export default function BlogPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4">
      <h2 className="mb-8 text-3xl font-bold">Latest Articles</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl shadow overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1580281658629-4d90b4b5b0c3?q=80&w=1200"
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">Health Tips {i}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}