import { Skeleton } from "@/components/ui/skeleton";

export function CatalogPendingSkeleton() {
  return (
    <div className="container-page pt-20 sm:pt-24 pb-16 min-h-[85vh] animate-in fade-in duration-150">
      {/* Banner Topo */}
      <Skeleton className="w-full h-36 sm:h-48 rounded-2xl mb-8" />

      {/* Header com breadcrumb e busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-60" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block space-y-6">
          <div className="p-5 rounded-2xl border border-border/50 bg-card space-y-4">
            <Skeleton className="h-5 w-24" />
            <div className="space-y-2 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-full rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-border/40 bg-card p-3 space-y-3"
              >
                <Skeleton className="w-full aspect-[4/5] rounded-xl bg-muted/60" />
                <div className="space-y-2 px-1">
                  <Skeleton className="h-4 w-4/5 rounded" />
                  <Skeleton className="h-3 w-2/3 rounded" />
                  <div className="pt-2 flex justify-between items-center">
                    <Skeleton className="h-5 w-20 rounded" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
