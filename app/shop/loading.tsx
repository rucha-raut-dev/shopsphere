export default function ShopLoading() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8 h-9 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
        <div>
          <div className="mb-6 h-10 w-full max-w-sm animate-pulse rounded-full bg-muted" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/5] animate-pulse rounded-xl bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
