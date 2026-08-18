import { SheetRow } from '../entities/excel-export/workbook';
import { toSheetData } from './program-excel-export.service';

/**
 * The adapter between this domain's vendor-neutral {@link SheetRow} and
 * `write-excel-file`'s schema. Worth pinning because the library throws on a format
 * attached to a string cell, and because a value written as text would silently forfeit
 * the numeric cells the export exists to produce.
 */
const cellAt = (rows: SheetRow[], row: number, column: number) =>
  toSheetData(rows)[row][column] as Record<string, unknown>;

describe('toSheetData', () => {
  it('writes a number as a Number cell, carrying its format', () => {
    const cell = cellAt([[{ value: 102.5, numberFormat: 'General" kg"' }]], 0, 0);

    expect(cell.value).toBe(102.5);
    expect(cell.type).toBe(Number);
    expect(cell.format).toBe('General" kg"');
  });

  it('writes a string as a String cell and never attaches a format to it', () => {
    const cell = cellAt([[{ value: '—', textColor: '#6B7280' }]], 0, 0);

    expect(cell.value).toBe('—');
    expect(cell.type).toBe(String);
    expect(cell.format).toBeUndefined();
  });

  it('maps our style vocabulary onto the librarys', () => {
    const cell = cellAt([[{ value: 'W1', bold: true, backgroundColor: '#F7F9FC', align: 'center' }]], 0, 0);

    expect(cell.fontWeight).toBe('bold');
    expect(cell.backgroundColor).toBe('#F7F9FC');
    expect(cell.align).toBe('center');
    expect(cell.fontStyle).toBeUndefined();
  });

  it('maps italic and font size, used by the title and the annotation rows', () => {
    const title = cellAt([[{ value: 'Program', bold: true, fontSize: 16 }]], 0, 0);
    const note = cellAt([[{ value: 'Not exported: X', italic: true, textColor: '#6B7280' }]], 0, 0);

    expect(title.fontSize).toBe(16);
    expect(note.fontStyle).toBe('italic');
    expect(note.textColor).toBe('#6B7280');
  });

  it('passes a blank cell through as null, and preserves row shape', () => {
    const rows: SheetRow[] = [[{ value: 'Status' }, null, { value: 'Exported' }], []];

    expect(toSheetData(rows)[0][1]).toBeNull();
    expect(toSheetData(rows)[0]).toHaveLength(3);
    expect(toSheetData(rows)[1]).toEqual([]);
  });
});
