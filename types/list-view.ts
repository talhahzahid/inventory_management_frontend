export type FilterOption = {
  label: string;
  value: string;
};

export type ListFilterConfig = {
  id: string;
  label: string;
  placeholder?: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
};

export type ListViewStat = {
  label: string;
  value: string | number;
  tone?: "default" | "success" | "warning" | "danger";
};

export type PaginationConfig = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};
