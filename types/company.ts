export type CompanyPlan = "starter" | "pro" | "enterprise";
export type CompanyStatus = "active" | "trial" | "inactive";

export type Company = {
  id: string;
  name: string;
  email: string;
  adminName: string;
  adminEmail: string;
  plan: CompanyPlan;
  users: number;
  status: CompanyStatus;
  joinedAt: string;
};

export const companyPlanLabels: Record<CompanyPlan, string> = {
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

export const companyStatusLabels: Record<CompanyStatus, string> = {
  active: "Active",
  trial: "Trial",
  inactive: "Inactive",
};
