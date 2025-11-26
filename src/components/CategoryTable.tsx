import React, { useMemo, useState } from 'react';
import { Category, CategoryType } from '../types';
import { formatCurrency, months } from '../planUtils';

interface CategoryTableProps {
  categories: Category[];
  currency: string;
  monthlyTotals: number[];
  onUpdateAmount: (categoryId: string, month: number, amount: number) => void;
  onAddCategory: (input: { name: string; type: CategoryType; baseAmount: number }) => void;
}

const typeLabels: Record<CategoryType, string> = {
  needs: 'Needs',
  wants: 'Wants',
  savings: 'Savings',
};

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  currency,
  monthlyTotals,
  onUpdateAmount,
  onAddCategory,
}) => {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<CategoryType>('needs');
  const [newAmount, setNewAmount] = useState(200);

  const totalsByMonth = useMemo(() => monthlyTotals, [monthlyTotals]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory({ name: newName || 'New Category', type: newType, baseAmount: isFinite(newAmount) ? newAmount : 0 });
    setNewName('');
    setNewAmount(200);
    setNewType('needs');
  };

  return (
    <div className="panel stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0 }}>Categories & monthly allocations</h2>
          <p className="muted" style={{ margin: 0 }}>
            Adjust monthly amounts directly in the grid. Annual totals recalc automatically.
          </p>
        </div>
        <form className="row" onSubmit={handleAdd} style={{ alignItems: 'flex-end', gap: 8 }}>
          <div className="stack" style={{ gap: 4 }}>
            <label className="muted" htmlFor="name">
              New category
            </label>
            <input
              id="name"
              className="input"
              placeholder="e.g. Utilities"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="stack" style={{ gap: 4 }}>
            <label className="muted" htmlFor="type">
              Type
            </label>
            <select id="type" className="input" value={newType} onChange={(e) => setNewType(e.target.value as CategoryType)}>
              <option value="needs">Needs</option>
              <option value="wants">Wants</option>
              <option value="savings">Savings</option>
            </select>
          </div>
          <div className="stack" style={{ gap: 4 }}>
            <label className="muted" htmlFor="amount">
              Monthly amount
            </label>
            <input
              id="amount"
              className="input"
              type="number"
              min="0"
              value={newAmount}
              onChange={(e) => setNewAmount(parseFloat(e.target.value))}
            />
          </div>
          <button className="btn btn-primary" type="submit" style={{ alignSelf: 'stretch' }}>
            Add
          </button>
        </form>
      </div>

      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              <th style={{ minWidth: 160 }}>Category</th>
              <th style={{ minWidth: 90 }}>Type</th>
              <th style={{ minWidth: 120 }}>Annual</th>
              {months.map((m) => (
                <th key={m} style={{ minWidth: 90 }}>
                  M{m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                <td>
                  <span className="pill">{typeLabels[cat.type]}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(cat.annualBudget, currency)}</td>
                {cat.monthlyAllocations.map((m) => (
                  <td key={m.month}>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      step="10"
                      value={m.amount}
                      onChange={(e) => onUpdateAmount(cat.id, m.month, parseFloat(e.target.value))}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={3} style={{ fontWeight: 700 }}>
                Monthly totals
              </td>
              {totalsByMonth.map((total, idx) => (
                <td key={idx} style={{ fontWeight: 600, color: '#0f766e' }}>
                  {formatCurrency(total, currency)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
