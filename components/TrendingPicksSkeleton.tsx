export default function TrendingPicksSkeleton() {
  return (
    <div className="mb-10">
      <div className="mb-4 h-5 w-40 animate-pulse rounded bg-muted" />
      <div className="flex gap-4 overflow-x-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-40 shrink-0 sm:w-48">
            <div className="aspect-square animate-pulse rounded-xl bg-muted" />
            <div className="mt-2 h-3.5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-1.5 h-3.5 w-1/3 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}