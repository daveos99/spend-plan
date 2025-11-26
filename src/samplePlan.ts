import { Category, PlanFile } from './types';

const months = Array.from({ length: 12 }, (_, i) => i + 1);

function monthly(amount: number) {
  return months.map((month) => ({ month, amount, notes: '' }));
}

function category(id: string, name: string, type: Category['type'], monthlyAmount: number): Category {
  const allocations = monthly(monthlyAmount);
  return {
    id,
    name,
    type,
    monthlyAllocations: allocations,
    annualBudget: allocations.reduce((sum, entry) => sum + entry.amount, 0),
  };
}

export const samplePlan: PlanFile = {
  version: 1,
  plan: {
    id: 'plan-2024',
    year: 2024,
    notes: 'Seeded sample plan',
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  categories: [
    category('cat-housing', 'Housing', 'needs', 2000),
    category('cat-groceries', 'Groceries', 'needs', 650),
    category('cat-transport', 'Transportation', 'needs', 400),
    category('cat-savings', 'Savings', 'savings', 500),
    category('cat-fun', 'Fun & Leisure', 'wants', 250),
  ],
  meta: {
    exportedAt: new Date().toISOString(),
    appVersion: 'v0',
  },
};
