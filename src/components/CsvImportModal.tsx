import { useState, useRef, useCallback } from 'react';
import { Upload, Download, AlertCircle, FileText, X } from 'lucide-react';
import Modal from '@/components/Modal';
import { ClubEvent } from '@/lib/types';

export interface CsvParticipantRow {
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string;
  email: string;
  notes: string;
}

interface CsvImportModalProps {
  open: boolean;
  onClose: () => void;
  event?: ClubEvent;
  onImport: (rows: CsvParticipantRow[]) => Promise<{ created: number; linked: number; skipped: number }>;
}

function parseCsvLine(line: string): string[] {
  const cols: string[] = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      cols.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  cols.push(cur.trim());
  return cols;
}

function parseCsv(text: string): { rows: CsvParticipantRow[]; errors: string[] } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return { rows: [], errors: ['CSV must have a header row and at least one data row.'] };
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/['"]/g, '').trim());
  const firstNameIdx = headers.indexOf('first_name');
  const lastNameIdx = headers.indexOf('last_name');

  if (firstNameIdx === -1 || lastNameIdx === -1) {
    return { rows: [], errors: ['CSV must include "first_name" and "last_name" columns.'] };
  }

  const get = (cols: string[], idx: number) => (idx !== -1 ? (cols[idx]?.trim() ?? '') : '');
  const roleIdx = headers.indexOf('role');
  const phoneIdx = headers.indexOf('phone_number');
  const emailIdx = headers.indexOf('email');
  const notesIdx = headers.indexOf('notes');

  const rows: CsvParticipantRow[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = parseCsvLine(line);
    const first = get(cols, firstNameIdx);
    const last = get(cols, lastNameIdx);
    if (!first || !last) {
      errors.push(`Row ${i + 1}: missing first_name or last_name — skipped.`);
      continue;
    }
    rows.push({
      first_name: first,
      last_name: last,
      role: get(cols, roleIdx),
      phone_number: get(cols, phoneIdx),
      email: get(cols, emailIdx),
      notes: get(cols, notesIdx),
    });
  }

  return { rows, errors };
}

function downloadTemplate() {
  const csv = [
    'first_name,last_name,role,phone_number,email,notes',
    'Jane,Doe,Member,+639123456789,jane@email.com,',
    'Maria,Santos,Leader,+639987654321,maria@email.com,Captain',
  ].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'participants_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function CsvImportModal({ open, onClose, event = undefined, onImport }: CsvImportModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<CsvParticipantRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ created: number; linked: number; skipped: number } | null>(null);

  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { rows: parsed, errors } = parseCsv(text);
      setRows(parsed);
      setParseErrors(errors);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (ev: React.DragEvent) => {
      ev.preventDefault();
      const file = ev.dataTransfer.files[0];
      if (file && file.name.endsWith('.csv')) handleFile(file);
    },
    [handleFile],
  );

  const reset = () => {
    setRows([]);
    setParseErrors([]);
    setFileName('');
    setResult(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleImport = async () => {
    if (!rows.length) return;
    setImporting(true);
    try {
      const res = await onImport(rows);
      setResult(res);
      setRows([]);
      setFileName('');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Import Participants"
      subtitle={event?.name}
      size="md"
      footer={
        result ? (
          <button onClick={handleClose} className="btn-primary">
            Done
          </button>
        ) : (
          <>
            <button onClick={handleClose} className="btn-ghost">
              Cancel
            </button>
            {rows.length > 0 && (
              <button onClick={handleImport} disabled={importing} className="btn-primary">
                <Upload size={16} />
                {importing
                  ? 'Importing…'
                  : `Import ${rows.length} participant${rows.length !== 1 ? 's' : ''}`}
              </button>
            )}
          </>
        )
      }
    >
      <div className="space-y-4">
        {/* Template download */}
        <div className="flex items-center justify-between rounded-xl bg-cream-50 border border-cream-200 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slatey-700">CSV Template</p>
            <p className="text-xs text-slatey-400 mt-0.5">
              Columns: first_name, last_name, role, phone_number, email, notes
            </p>
          </div>
          <button type="button" onClick={downloadTemplate} className="btn-outline text-sm shrink-0">
            <Download size={15} />
            Template
          </button>
        </div>

        {/* Result state */}
        {result ? (
          <div className="rounded-xl bg-emeraldx-50 border border-emeraldx-200 px-4 py-4 space-y-1">
            <p className="text-sm font-semibold text-emeraldx-700">Import complete</p>
            <ul className="text-sm text-emeraldx-600 space-y-0.5 mt-1 list-disc list-inside">
              {event ? (
                <>
                  <li>{result.linked} participant{result.linked !== 1 ? 's' : ''} linked to this event</li>
                  {result.created > 0 && (
                    <li>{result.created} new member{result.created !== 1 ? 's' : ''} created</li>
                  )}
                </>
              ) : (
                <li>{result.created} participant{result.created !== 1 ? 's' : ''} added</li>
              )}
              {result.skipped > 0 && (
                <li className="text-slatey-400">
                  {result.skipped} skipped ({event ? 'already linked or invalid' : 'already exists or invalid'})
                </li>
              )}
            </ul>
          </div>
        ) : (
          <>
            {/* Drop zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className="relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-cream-300 bg-cream-50 px-6 py-8 text-center cursor-pointer hover:border-sage-300 hover:bg-sage-50/30 transition"
            >
              <Upload size={24} className="text-slatey-400" />
              {fileName ? (
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-sage-500" />
                  <span className="text-sm font-semibold text-slatey-700">{fileName}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      reset();
                    }}
                    className="text-slatey-400 hover:text-coral-500 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-slatey-600">
                    Click to upload or drag &amp; drop
                  </p>
                  <p className="text-xs text-slatey-400">CSV files only</p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>

            {/* Parse warnings */}
            {parseErrors.length > 0 && (
              <div className="rounded-xl bg-coral-50 border border-coral-200 px-4 py-3 space-y-1">
                <p className="text-xs font-semibold text-coral-600 flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  {parseErrors.length} warning{parseErrors.length !== 1 ? 's' : ''}
                </p>
                {parseErrors.map((err, i) => (
                  <p key={i} className="text-xs text-coral-500">
                    {err}
                  </p>
                ))}
              </div>
            )}

            {/* Preview table */}
            {rows.length > 0 && (
              <div className="rounded-xl border border-cream-200 overflow-hidden">
                <div className="bg-cream-50 px-4 py-2 border-b border-cream-200">
                  <p className="text-xs font-semibold text-slatey-500 uppercase tracking-wide">
                    {rows.length} row{rows.length !== 1 ? 's' : ''} ready to import
                  </p>
                </div>
                <div className="overflow-x-auto max-h-52 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-cream-50 border-b border-cream-100">
                      <tr>
                        <th className="text-left px-4 py-2 text-slatey-400 font-semibold">Name</th>
                        <th className="text-left px-4 py-2 text-slatey-400 font-semibold">Role</th>
                        <th className="text-left px-4 py-2 text-slatey-400 font-semibold">Phone</th>
                        <th className="text-left px-4 py-2 text-slatey-400 font-semibold">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-100">
                      {rows.map((r, i) => (
                        <tr key={i} className="hover:bg-cream-50/50">
                          <td className="px-4 py-2 font-medium text-slatey-700">
                            {r.first_name} {r.last_name}
                          </td>
                          <td className="px-4 py-2 text-slatey-500">{r.role || '—'}</td>
                          <td className="px-4 py-2 text-slatey-500">{r.phone_number || '—'}</td>
                          <td className="px-4 py-2 text-slatey-500">{r.email || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
