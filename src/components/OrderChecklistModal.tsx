import React, { useState } from 'react';
import { X, ClipboardCheck, CalendarDays, Check } from 'lucide-react';
import { ChecklistEntry, OrderSummary, getChecklistKey } from '../service/Manage';

interface OrderChecklistModalProps {
  isOpen: boolean;
  isLoading: boolean;
  summary: OrderSummary | null;
  checklist: Record<string, ChecklistEntry>;
  onClose: () => void;
  onCheckRow: (itemId: string, staffId: string, note: string) => Promise<boolean>;
  onUpdateNote: (key: string, note: string) => Promise<boolean>;
}

// One checklist row: one item ordered by one staff
interface ChecklistRow {
  key: string;
  itemId: string;
  itemName: string;
  staffId: string;
  staffName: string;
}

// Today's orders as separate rows (item + staff). Each row has its own checkbox and note;
// ticking posts one Order_Checklist record for that row. After checking, only the checkbox
// is locked: editing the note and leaving the box updates that record's Notes.
export const OrderChecklistModal: React.FC<OrderChecklistModalProps> = ({
  isOpen,
  isLoading,
  summary,
  checklist,
  onClose,
  onCheckRow,
  onUpdateNote
}) => {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [noteStatus, setNoteStatus] = useState<Record<string, 'saving' | 'saved' | 'error'>>({});

  if (!isOpen) return null;

  // Rows sorted by item name, then staff name
  const rows: ChecklistRow[] = summary
    ? summary.categories
        .flatMap((cat) => cat.items)
        .flatMap((item) =>
          item.users.map((staffName, index) => {
            const staffId = item.userIds[index] || '';
            return {
              key: staffId ? getChecklistKey(item.itemId, staffId) : `${item.itemId}_row${index}`,
              itemId: item.itemId,
              itemName: item.name,
              staffId,
              staffName
            };
          })
        )
        .sort((a, b) => a.itemName.localeCompare(b.itemName) || a.staffName.localeCompare(b.staffName))
    : [];
  const checkedCount = rows.filter((row) => checklist[row.key]).length;

  const handleCheck = async (row: ChecklistRow) => {
    if (!row.staffId || checklist[row.key] || savingKey) return;
    setSavingKey(row.key);
    setErrorKey(null);
    const saved = await onCheckRow(row.itemId, row.staffId, notes[row.key] || '');
    if (!saved) setErrorKey(row.key);
    setSavingKey(null);
  };

  // Checked row: save edited note when leaving the note box
  const handleNoteBlur = async (row: ChecklistRow) => {
    const saved = checklist[row.key];
    const note = notes[row.key];
    if (!saved || note === undefined || note === saved.note) return;
    setNoteStatus((prev) => ({ ...prev, [row.key]: 'saving' }));
    const updated = await onUpdateNote(row.key, note);
    setNoteStatus((prev) => ({ ...prev, [row.key]: updated ? 'saved' : 'error' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-stone-100 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-slate-900 tracking-tight flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-red-600" />
              Order Checklist
            </h2>
            {summary && (
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5 text-red-500" />
                  {summary.date}
                </span>
                {rows.length > 0 && (
                  <span>
                    {checkedCount} of {rows.length} checked
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close order checklist"
            className="w-9 h-9 shrink-0 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-700 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: one row per item + staff */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {isLoading ? (
            <p className="py-12 text-center text-sm text-slate-500">Loading checklist...</p>
          ) : rows.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">No orders for today.</p>
          ) : (
            <div className="space-y-3">
              {rows.map((row) => {
                const saved = checklist[row.key];
                const isSaving = savingKey === row.key;
                return (
                  <div
                    key={row.key}
                    className={`rounded-2xl border p-3 sm:p-4 transition-colors ${
                      saved ? 'border-emerald-200 bg-emerald-50/50' : 'border-stone-200 bg-white'
                    }`}
                  >
                    <label
                      className={`flex items-start gap-3 ${
                        saved || isSaving || !row.staffId ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(saved) || isSaving}
                        disabled={Boolean(saved) || !row.staffId || Boolean(savingKey)}
                        onChange={() => handleCheck(row)}
                        className="mt-0.5 w-5 h-5 shrink-0 accent-emerald-600 cursor-pointer disabled:cursor-default"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span className="text-sm font-bold text-slate-900">{row.itemName}</span>
                          {saved && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700">
                              <Check className="w-3.5 h-3.5" /> Checked
                            </span>
                          )}
                          {isSaving && <span className="text-[11px] font-semibold text-slate-500">Saving...</span>}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 truncate">{row.staffName}</p>
                      </div>
                    </label>

                    <textarea
                      value={notes[row.key] ?? saved?.note ?? ''}
                      onChange={(e) => {
                        setNotes((prev) => ({ ...prev, [row.key]: e.target.value }));
                        setNoteStatus((prev) => {
                          const next = { ...prev };
                          delete next[row.key];
                          return next;
                        });
                      }}
                      onBlur={() => handleNoteBlur(row)}
                      disabled={isSaving || noteStatus[row.key] === 'saving'}
                      rows={1}
                      placeholder={saved ? 'Add a note (saves when you leave the box)' : 'Add a note (optional), then tick'}
                      className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                    />

                    {saved && noteStatus[row.key] && (
                      <p
                        className={`mt-1 text-[11px] font-semibold ${
                          noteStatus[row.key] === 'error' ? 'text-red-600' : 'text-slate-500'
                        }`}
                      >
                        {noteStatus[row.key] === 'saving' && 'Saving note...'}
                        {noteStatus[row.key] === 'saved' && 'Note saved'}
                        {noteStatus[row.key] === 'error' && 'Could not save note. Edit and leave the box to retry.'}
                      </p>
                    )}

                    {errorKey === row.key && (
                      <p className="mt-1.5 text-xs font-semibold text-red-600">
                        Could not save. Please tick again to retry.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-stone-100 bg-stone-50/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white border border-stone-200 text-slate-700 hover:bg-stone-100 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
