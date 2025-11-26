import { PlanFile } from './types';
import { ensurePlanData } from './planUtils';

type ValidationResult =
  | { ok: true; plan: PlanFile }
  | { ok: false; error: string };

const isNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value);
const isString = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

export function validatePlanFile(input: unknown): ValidationResult {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'File is not valid JSON object' };
  }

  const data = input as Partial<PlanFile>;

  if (data.version !== 1) {
    return { ok: false, error: 'Unsupported version (expected 1)' };
  }

  if (!data.plan || typeof data.plan !== 'object') {
    return { ok: false, error: 'Missing plan metadata' };
  }

  if (!isString(data.plan.id) || !isNumber(data.plan.year) || !isString(data.plan.currency)) {
    return { ok: false, error: 'Plan must include id, year, and currency' };
  }

  if (!Array.isArray(data.categories)) {
    return { ok: false, error: 'Missing categories array' };
  }

  for (const cat of data.categories) {
    if (!isString(cat.id) || !isString(cat.name) || !isString(cat.type)) {
      return { ok: false, error: 'Each category needs id, name, and type' };
    }
    if (!Array.isArray(cat.monthlyAllocations) || cat.monthlyAllocations.length === 0) {
      return { ok: false, error: `Category ${cat.name} is missing monthly allocations` };
    }

    const months = new Set<number>();
    for (const entry of cat.monthlyAllocations) {
      if (!isNumber(entry.month) || entry.month < 1 || entry.month > 12) {
        return { ok: false, error: `Category ${cat.name} has invalid month value` };
      }
      months.add(entry.month);
      if (!isNumber(entry.amount)) {
        return { ok: false, error: `Category ${cat.name} has non-numeric amount` };
      }
    }

    if (months.size !== 12) {
      return { ok: false, error: `Category ${cat.name} must cover months 1-12` };
    }
  }

  return { ok: true, plan: ensurePlanData(data as PlanFile) };
}
