import { Skeleton } from "@/components/ui/skeleton";

export function DashboardScreenLoader() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="surface-card space-y-4 p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="size-11 rounded-2xl" />
            </div>
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="surface-card space-y-4 p-6">
            <Skeleton className="h-6 w-40" />
            {Array.from({ length: 4 }).map((__, rowIndex) => (
              <Skeleton key={rowIndex} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
