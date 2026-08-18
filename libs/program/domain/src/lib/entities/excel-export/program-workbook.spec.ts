import { MainLiftBlock } from '../models/main-lift-block';
import { Program } from '../models/program';
import { WeekPrescription } from '../models/week-prescription';
import { buildProgramWorkbook, programExportFileName } from './program-workbook';
import { SheetRow } from './workbook';

const cycle = (loads: Array<number | null>): WeekPrescription[] =>
  loads.map((load, index) => ({ week: index + 1, load, sets: 5, reps: 5 }));

const block = (overrides: Partial<MainLiftBlock> = {}): MainLiftBlock => ({
  id: 'block-1',
  exerciseId: 'squat',
  test: { oneRepMax: 140, repsAt80Percent: 7 },
  loadingConstraint: { increment: 2.5, roundingMode: 'nearest' },
  anchorSource: 'table',
  cycle: cycle([90, 95, 102.5, 107.5, 112.5, 117.5, 122.5]),
  manualWeek5: null,
  week8Retest: 150,
  ...overrides,
});

const program = (blocks: MainLiftBlock[], overrides: Partial<Program> = {}): Program => ({
  id: 'program-1',
  userId: 'user-1',
  name: 'Reload — Aug 2026',
  status: 'active',
  strategy: 'strength-reload',
  mainLiftBlocks: blocks,
  createdAt: 0,
  updatedAt: 0,
  ...overrides,
});

const names = new Map([
  ['squat', 'Back Squat'],
  ['bench', 'Bench Press'],
]);

const exportedAt = new Date(2026, 7, 18, 14, 30, 0);

const build = (blocks: MainLiftBlock[], overrides?: Partial<Program>) =>
  buildProgramWorkbook({ program: program(blocks, overrides), exerciseNames: names, exportedAt });

/** A blank cell is `null`; everything else carries its value. */
const valuesOf = (row: SheetRow): Array<string | number | null> => row.map((cell) => cell?.value ?? null);

describe('buildProgramWorkbook — sheet header', () => {
  it('leads with the Program name, its status, and the export timestamp', () => {
    const { rows } = build([block()]);

    expect(valuesOf(rows[0])).toEqual(['Reload — Aug 2026']);
    expect(valuesOf(rows[1])).toEqual(['Status', 'Active', null, 'Exported', '2026-08-18 14:30']);
    expect(rows[2]).toEqual([]);
  });

  it('runs weeks across as columns, 11 columns wide', () => {
    const { rows, columnWidths } = build([block()]);

    expect(valuesOf(rows[3])).toEqual([
      'Exercise',
      '1RM',
      'Reps @ 80%',
      'W1',
      'W2',
      'W3',
      'W4',
      'W5',
      'W6',
      'W7',
      'W8',
    ]);
    expect(columnWidths).toEqual([22, 14, 14, 10, 10, 10, 10, 10, 10, 10, 10]);
  });

  it('states Sets × Reps once as a band, since the method fixes it for every block', () => {
    const { rows } = build([block(), block({ id: 'block-2', exerciseId: 'bench' })]);

    expect(valuesOf(rows[4])).toEqual([
      'Sets × Reps',
      null,
      null,
      '5×5',
      '5×5',
      '5×5',
      '5×5',
      '5×5',
      '3×3',
      '2×2',
      '1RM retest',
    ]);
  });
});

describe('buildProgramWorkbook — block rows', () => {
  it('writes loads as numeric cells, in Program order', () => {
    const { rows } = build([
      block(),
      block({ id: 'block-2', exerciseId: 'bench', test: { oneRepMax: 100, repsAt80Percent: 4 }, week8Retest: null }),
    ]);

    expect(valuesOf(rows[5])).toEqual([
      'Back Squat',
      140,
      7,
      90,
      95,
      102.5,
      107.5,
      112.5,
      117.5,
      122.5,
      150,
    ]);
    expect(valuesOf(rows[6])[0]).toBe('Bench Press');
  });

  it('keeps every weight a numeric value that merely displays "kg", so spreadsheets can sum it', () => {
    const { rows } = build([block()]);
    const row = rows[5];

    // 1RM plus W1–W8 — every weight-bearing column.
    for (const index of [1, 3, 4, 5, 6, 7, 8, 9, 10]) {
      expect(row[index]?.numberFormat).toBe('General" kg"');
      expect(typeof row[index]?.value).toBe('number');
    }
  });

  it('uses a format that emits no decimal separator for whole numbers', () => {
    const { rows } = build([block()]);

    // A format code always renders its decimal separator, even with no digits after it:
    // `0.##` shows a whole 70 as "70." — "70," in comma-separator locales. `General`
    // prints only the digits the number actually has. Don't "tidy" this into `0.##`.
    expect(rows[5][1]?.numberFormat).toBe('General" kg"');
    expect(rows[5][1]?.numberFormat).not.toContain('#');
  });

  it('leaves Reps @ 80% unitless — it is a count, not a weight', () => {
    const { rows } = build([block()]);

    expect(rows[5][2]?.numberFormat).toBeUndefined();
    expect(valuesOf(rows[5])[2]).toBe(7);
  });

  it('renders an em dash for a Week 8 with no saved retest', () => {
    const { rows } = build([block({ week8Retest: null })]);

    expect(valuesOf(rows[5])[10]).toBe('—');
    expect(rows[5][10]?.numberFormat).toBeUndefined();
  });

  it('renders an em dash for a null load inside Weeks 1–7 (placeholder anchor)', () => {
    const { rows } = build([
      block({ test: { oneRepMax: 100, repsAt80Percent: null }, cycle: cycle([null, null, null, null, 85, null, null]) }),
    ]);

    expect(valuesOf(rows[5])).toEqual(['Back Squat', 100, '—', '—', '—', '—', '—', 85, '—', '—', 150]);
  });

  it('falls back to a placeholder name for an exercise id it was given no name for', () => {
    const { rows } = build([block({ exerciseId: 'unknown-id' })]);

    expect(valuesOf(rows[5])[0]).toBe('Unknown exercise');
  });
});

describe('buildProgramWorkbook — blocks with no generated Reload Cycle', () => {
  it('skips the block and names it in a trailing footnote', () => {
    const { rows } = build([block(), block({ id: 'block-2', exerciseId: 'bench', cycle: null })]);

    expect(rows).toHaveLength(8);
    expect(valuesOf(rows[5])[0]).toBe('Back Squat');
    expect(rows[6]).toEqual([]);
    expect(valuesOf(rows[7])).toEqual(['Not exported: Bench Press — no Reload Cycle generated']);
  });

  it('omits the footnote entirely when nothing was skipped', () => {
    const { rows } = build([block()]);

    expect(rows).toHaveLength(6);
  });

  it('produces a table with no rows when every block was skipped', () => {
    const { rows } = build([block({ cycle: null })]);

    expect(rows).toHaveLength(7);
    expect(valuesOf(rows[6])).toEqual(['Not exported: Back Squat — no Reload Cycle generated']);
  });
});

describe('programExportFileName', () => {
  it('collapses non-alphanumerics to single hyphens and stamps local time', () => {
    expect(programExportFileName('Reload — Aug 2026', exportedAt)).toBe('Reload-Aug-2026_20260818-143000.xlsx');
  });

  it('trims leading and trailing hyphens', () => {
    expect(programExportFileName('  ...Squat Cycle!!  ', exportedAt)).toBe('Squat-Cycle_20260818-143000.xlsx');
  });

  it('zero-pads every timestamp field', () => {
    expect(programExportFileName('Cycle', new Date(2026, 0, 5, 9, 8, 7))).toBe('Cycle_20260105-090807.xlsx');
  });

  it('falls back to `program` when the name has nothing alphanumeric in it', () => {
    expect(programExportFileName('— ///', exportedAt)).toBe('program_20260818-143000.xlsx');
  });

  it('agrees with the timestamp the sheet header shows', () => {
    const { fileName, rows } = build([block()]);

    expect(valuesOf(rows[1])[4]).toBe('2026-08-18 14:30');
    expect(fileName).toBe('Reload-Aug-2026_20260818-143000.xlsx');
  });
});
