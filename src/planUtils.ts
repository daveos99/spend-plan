import { Category, PlanFile } from './types';

const months = Array.from({ length: 12 }, (_, i) => i + 1);

export function ensureCategoryAllocations<T extends Category>(category: T): T {
  const allocations = Array.isArray(category.monthlyAllocations) ? category.monthlyAllocations : [];
  const seen = new Map<number, number>();
  allocations.forEach((entry, idx) => seen.set(entry.month, idx));

  const merged = months.map((month) => {
    if (seen.has(month)) {
      const entry = allocations[seen.get(month)!];
      return { month, amount: Number.isFinite(entry.amount) ? entry.amount : 0, notes: entry.notes || '' };
    }
    return { month, amount: 0, notes: '' };
  });

  const annualBudget = merged.reduce((sum, entry) => sum + entry.amount, 0);
  return { ...category, monthlyAllocations: merged, annualBudget };
}

export function ensurePlanData(plan: PlanFile): PlanFile {
  return {
    ...plan,
    categories: plan.categories.map((c) => ensureCategoryAllocations(c)),
  };
}

export function annualTotal(plan: PlanFile): number {
  return plan.categories.reduce((sum, cat) => sum + cat.annualBudget, 0);
}

export function monthlyTotals(plan: PlanFile): number[] {
  return months.map((month) =>
    plan.categories.reduce((sum, cat) => sum + (cat.monthlyAllocations.find((m) => m.month === month)?.amount ?? 0), 0)
  );
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function downloadFileName(plan: PlanFile) {
  return `spend-plan-${plan.plan.year}.json`;
}

export { months };
