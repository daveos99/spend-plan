# Spend Plan - Requirements

## Purpose & Audience
- Goal: Help users define and keep an annual spending plan with clear monthly allocations.
- Audience: Individuals/families who want a simple, structured yearly budget, similar feel to money-assess.

## Core Goals (Success Criteria)
1) Create and edit an annual spending plan with categories and monthly amounts.
2) Provide clear summaries: annual totals, monthly rollups, category views.
3) Keep UX consistent with money-assess look/feel; straightforward, responsive UI.

## Non-Goals (Now)
- No bank syncing/imports.
- No debt payoff calculators or investment tracking.
- No multi-currency.

## Personas (Draft)
- Planner: Sets yearly budget, tweaks monthly allocations.
- Tracker: Checks progress, wants quick variance insight.

## Primary Flows (Draft)
- Define annual plan (year, categories, starting balances/targets).
- Allocate per month (adjust per category per month, copy/spread amounts).
- Review summaries (annual, monthly, category drill-down).

## Data Shapes (Draft)
- SpendingPlan: id, year, categories[], notes, createdAt, updatedAt.
- Category: id, name, type (needs/wants/savings), annualBudget, monthlyAllocations[12].
- MonthlyAllocation: month (1-12), amount, notes.
- Defaults: currency (USD), starting empty plan with common categories optional.
- JSON file (draft shape):
  ```json
  {
    "version": 1,
    "plan": {
      "id": "plan-2024",
      "year": 2024,
      "notes": "",
      "currency": "USD",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-02T12:34:56Z"
    },
    "categories": [
      {
        "id": "cat-housing",
        "name": "Housing",
        "type": "needs",
        "annualBudget": 24000,
        "monthlyAllocations": [
          {"month":1,"amount":2000,"notes":""},
          {"month":2,"amount":2000,"notes":""}
          // months 3-12...
        ]
      }
    ]
  }
  ```
  - `version` supports future migrations.
  - `monthlyAllocations` should cover months 1-12; amounts numeric.
  - Optional: `meta` block for app info (e.g., `exportedAt`, `appVersion`).

## UI Scope (Draft)
- Screens: Dashboard summary, Annual planner, Monthly breakdown, Category editor.
- Components: Header/nav, annual totals widget, month grid, category list/editor, variance chips.
- Styling: Match money-assess feel; clean typography, light theme first, responsive.
- Export/Import: Header actions for Upload (import JSON) and Download (export JSON) with inline validation and toast feedback; note that data stays on-device.

## Integrations & Constraints (Draft)
- Storage: File-based JSON export/import (download/upload) as primary persistence; offline-friendly; no background sync.
- Auth: Not in v0.
- Performance: Instant plan edits under normal load.
- Accessibility: Aim for keyboard nav + basic ARIA labels.

## Prioritization
- Must: Create/edit plan, add/edit categories, monthly allocations, summaries.
- Should: Copy/spread monthly amounts, basic variance view.
- Could: Templates for common categories, notes per category/month.

## Acceptance Criteria (Examples)
- Creating a plan sets year, adds at least one category, saves allocations per month.
- Editing a monthly amount updates totals immediately.
- Category totals equal sum of monthly allocations.
- User can download the current plan as JSON and re-import it to restore state across sessions/devices.

## Open Questions
- Do we need multi-profile support?
- Should we seed default categories?

## Decisions Log
- Storage: v0 uses file-based JSON download/upload instead of IndexedDB/localStorage; API can come later.
