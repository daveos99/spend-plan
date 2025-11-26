import React, { createContext, useContext, useMemo, useState } from 'react';
import { PlanContextValue, PlanFile } from './types';
import { samplePlan } from './samplePlan';
import { ensureCategoryAllocations, ensurePlanData } from './planUtils';

const PlanContext = createContext<PlanContextValue | undefined>(undefined);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PlanFile>(() => ensurePlanData(samplePlan));

  const updateMonthlyAmount = (categoryId: string, month: number, amount: number) => {
    setData((current) => {
      const next = { ...current, categories: [...current.categories] };
      const idx = next.categories.findIndex((c) => c.id === categoryId);
      if (idx === -1) return current;

      const category = ensureCategoryAllocations(next.categories[idx]);
      const allocations = category.monthlyAllocations.map((entry) =>
        entry.month === month ? { ...entry, amount: Number.isFinite(amount) ? amount : 0 } : entry
      );

      const annualBudget = allocations.reduce((sum, entry) => sum + entry.amount, 0);

      next.categories[idx] = { ...category, monthlyAllocations: allocations, annualBudget };
      next.plan = { ...next.plan, updatedAt: new Date().toISOString() };
      return next;
    });
  };

  const addCategory: PlanContextValue['addCategory'] = ({ name, type, baseAmount }) => {
    const id = `cat-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    setData((current) => {
      const allocations = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        amount: baseAmount,
        notes: '',
      }));
      const annualBudget = allocations.reduce((sum, entry) => sum + entry.amount, 0);
      const newCategory = { id, name: name.trim() || 'New Category', type, monthlyAllocations: allocations, annualBudget };
      return {
        ...current,
        categories: [...current.categories, newCategory],
        plan: { ...current.plan, updatedAt: new Date().toISOString() },
      };
    });
  };

  const replacePlan: PlanContextValue['replacePlan'] = (plan) => {
    setData(ensurePlanData(plan));
  };

  const value = useMemo<PlanContextValue>(
    () => ({
      data,
      updateMonthlyAmount,
      addCategory,
      replacePlan,
    }),
    [data]
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) {
    throw new Error('usePlan must be used within PlanProvider');
  }
  return ctx;
}
