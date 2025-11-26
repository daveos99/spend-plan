export type CategoryType = 'needs' | 'wants' | 'savings';

export interface MonthlyAllocation {
  month: number; // 1-12
  amount: number;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  annualBudget: number;
  monthlyAllocations: MonthlyAllocation[];
}

export interface PlanMeta {
  id: string;
  year: number;
  notes?: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanFile {
  version: number;
  plan: PlanMeta;
  categories: Category[];
  meta?: {
    exportedAt?: string;
    appVersion?: string;
  };
}

export interface PlanContextValue {
  data: PlanFile;
  updateMonthlyAmount: (categoryId: string, month: number, amount: number) => void;
  addCategory: (input: { name: string; type: CategoryType; baseAmount: number }) => void;
  replacePlan: (plan: PlanFile) => void;
}
