import { cn } from "@/lib/utils";

type ListViewHeaderProps = {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function ListViewHeader({
  title,
  description,
  badge,
  actions,
  className,
}: ListViewHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        {badge ? (
          <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            {badge}
          </span>
        ) : null}
        <h1>{title}</h1>
        {description ? (
          <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
