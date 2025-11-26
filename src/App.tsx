import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { SummaryCards } from './components/SummaryCards';
import { CategoryTable } from './components/CategoryTable';
import { Toast } from './components/Toast';
import { PlanProvider, usePlan } from './planContext';
import { annualTotal, downloadFileName, monthlyTotals } from './planUtils';
import { validatePlanFile } from './planValidation';
import { PlanFile } from './types';

const AppContent: React.FC = () => {
  const { data, updateMonthlyAmount, addCategory, replacePlan } = usePlan();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const totals = useMemo(() => monthlyTotals(data), [data]);
  const annual = useMemo(() => annualTotal(data), [data]);

  const flash = useCallback((message: string) => setToast(message), []);

  const handleDownload = useCallback(async () => {
    const exportPayload: PlanFile = {
      ...data,
      meta: { ...data.meta, exportedAt: new Date().toISOString() },
    };
    const fileName = downloadFileName(data);
    const fileContents = JSON.stringify(exportPayload, null, 2);

    // Chromium-only: let user pick folder/file name with File System Access API
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as unknown as { showSaveFilePicker: any }).showSaveFilePicker({
          suggestedName: fileName,
          types: [{ description: 'Spend Plan JSON', accept: { 'application/json': ['.json'] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(new Blob([fileContents], { type: 'application/json' }));
        await writable.close();
        flash('Plan exported as JSON');
        return;
      } catch (error) {
        // If user cancels, fall back to default download flow.
        console.error(error);
      }
    }

    // Fallback: default anchor download to browser’s configured folder
    const blob = new Blob([fileContents], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    flash('Plan exported as JSON');
  }, [data, flash]);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.name.endsWith('.json')) {
        flash('Please upload a .json file');
        return;
      }
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const result = validatePlanFile(parsed);
        if (!result.ok) {
          flash(result.error);
          return;
        }
        replacePlan(result.plan);
        flash('Plan imported successfully');
      } catch (error) {
        flash('Unable to read file. Please check the JSON and try again.');
        console.error(error);
      }
    },
    [flash, replacePlan]
  );

  return (
    <div className="app-shell">
      <div className="page stack" style={{ gap: 16 }}>
        <HeaderBar year={data.plan.year} onDownload={handleDownload} onUpload={handleUpload} />
        <SummaryCards
          currency={data.plan.currency}
          annualTotal={annual}
          monthlyTotals={totals}
          categoryCount={data.categories.length}
        />
        <CategoryTable
          categories={data.categories}
          currency={data.plan.currency}
          monthlyTotals={totals}
          onUpdateAmount={updateMonthlyAmount}
          onAddCategory={addCategory}
        />
      </div>
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
};

const App: React.FC = () => (
  <PlanProvider>
    <AppContent />
  </PlanProvider>
);

export default App;
