export default function PostSkeleton() {
  return (
    <article className="card mb-6 animate-pulse border-neutral-200 overflow-hidden">
      <div className="p-4 border-b border-neutral-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-neutral-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-3/4" />
          <div className="h-3 bg-neutral-200 rounded w-1/2" />
        </div>
      </div>

      <div className="h-64 bg-neutral-200 rounded-lg mb-4" />

      <div className="p-4">
        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-3" />
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-neutral-200 rounded-full" />
            <div className="h-4 bg-neutral-200 rounded w-16" />
          </div>
          <div className="h-4 bg-neutral-200 rounded w-24" />
        </div>
      </div>
    </article>
  );
}
