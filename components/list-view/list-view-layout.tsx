import { cn } from "@/lib/utils";

type ListViewLayoutProps = {
  header: React.ReactNode;
  filters?: React.ReactNode;
  stats?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function ListViewLayout({
  header,
  filters,
  stats,
  children,
  footer,
  className,
}: ListViewLayoutProps) {
  return (
    <div className={cn("space-y-5", className)}>
      {header}

      {stats ? <section>{stats}</section> : null}

      {filters ? <section>{filters}</section> : null}

      <section>{children}</section>

      {footer ? <section>{footer}</section> : null}
    </div>
  );
}
