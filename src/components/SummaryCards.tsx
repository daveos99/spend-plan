import React from 'react';
import { formatCurrency } from '../planUtils';

interface SummaryCardsProps {
  currency: string;
  annualTotal: number;
  monthlyTotals: number[];
  categoryCount: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ currency, annualTotal, monthlyTotals, categoryCount }) => {
  const monthlyAvg = annualTotal / 12;
  const peakMonth = monthlyTotals.reduce(
    (acc, amount, idx) => (amount > acc.amount ? { month: idx + 1, amount } : acc),
    { month: 1, amount: 0 }
  );

  return (
    <div className="grid-cards">
      <div className="card">
        <div className="muted">Annual total</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{formatCurrency(annualTotal, currency)}</div>
        <div className="muted" style={{ fontSize: 12 }}>
          Across {categoryCount} categories
        </div>
      </div>
      <div className="card">
        <div className="muted">Monthly average</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{formatCurrency(monthlyAvg, currency)}</div>
      </div>
      <div className="card">
        <div className="muted">Peak month</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>
          {formatCurrency(peakMonth.amount, currency)} <span className="muted">in month {peakMonth.month}</span>
        </div>
      </div>
    </div>
  );
};
