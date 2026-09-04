import { Skeleton } from "@/components/ui/skeleton";

export function ProductPendingSkeleton() {
  return (
    <div className="container-page pt-20 sm:pt-24 pb-16 min-h-[85vh] animate-in fade-in duration-150">
      <Skeleton className="h-4 w-32 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Galeria */}
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-2xl bg-muted/60" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Detalhes */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-4/5" />
            <Skeleton className="h-8 w-36" />
          </div>

          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          <div className="pt-6 space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
