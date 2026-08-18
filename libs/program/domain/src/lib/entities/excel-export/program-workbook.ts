import { MainLiftBlock } from '../models/main-lift-block';
import { Program } from '../models/program';
import { PRESCRIBED_WEEKS, SETS_AND_REPS } from '../reload-strategy/derive-cycle';
import { SheetCell, SheetRow, Workbook } from './workbook';

/**
 * Column widths for the 11 columns the sheet uses: Exercise, 1RM, Reps @ 80%, then one
 * per week. Settled in .scratch/excel-export/spec.md alongside the layout itself.
 */
const COLUMN_WIDTHS = [22, 14, 14, 10, 10, 10, 10, 10, 10, 10, 10];

/** Week 8 is a retest rather than a prescription, so it sits outside {@link PRESCRIBED_WEEKS}. */
const RETEST_WEEK = 8;

/** Matches reload-cycle-table.component.ts's own `row.load ?? '—'` for an unknown load. */
const MISSING = '—';

const MUTED = '#6B7280';
const HEADER_FILL = '#F7F9FC';
const BAND_FILL = '#DDE7F5';

/**
 * Renders a weight as `90 kg` while the cell stays a real number, so spreadsheets can
 * still sum and chart it.
 *
 * `General` (not `0.##`) because a format code always emits its decimal separator, even
 * when no digits follow: `0.##` shows a whole 70 as `70.` — or `70,` wherever the locale
 * separator is a comma. `General` prints the digits the number actually has and nothing
 * more, so 70 stays `70 kg` and 61.25 stays `61.25 kg`, in every locale.
 */
const KG_FORMAT = 'General" kg"';

export interface ProgramWorkbookInput {
  program: Program;
  /**
   * Display name per `MainLiftBlock.exerciseId`. Blocks carry ids only, and resolving
   * them lives in the exercise domain — so the caller resolves and passes them in
   * rather than this function reaching across the boundary.
   */
  exerciseNames: ReadonlyMap<string, string>;
  /** Stamped into the sheet header and into the filename, so both agree. */
  exportedAt: Date;
}

/**
 * Renders one Program as a single-worksheet workbook: weeks across as columns, one row
 * per Main Lift Block that has a generated Reload Cycle. Pure, and deliberately ignorant
 * of what will write the file — see {@link Workbook}.
 */
export function buildProgramWorkbook({ program, exerciseNames, exportedAt }: ProgramWorkbookInput): Workbook {
  const nameOf = (block: MainLiftBlock): string => exerciseNames.get(block.exerciseId) ?? 'Unknown exercise';
  const exported = program.mainLiftBlocks.filter((block) => block.cycle !== null);
  const skipped = program.mainLiftBlocks.filter((block) => block.cycle === null);

  const rows: SheetRow[] = [
    [{ value: program.name, bold: true, fontSize: 16 }],
    [
      { value: 'Status', bold: true },
      { value: capitalize(program.status) },
      null,
      { value: 'Exported', bold: true },
      { value: formatExportedAt(exportedAt) },
    ],
    [],
    headerRow(),
    setsAndRepsBandRow(),
    ...exported.map((block) => blockRow(block, nameOf(block))),
  ];

  // Nothing silently disappears: a block with no Reload Cycle has no loads to print, so
  // it is named below the table instead of rendered as a row of dashes.
  if (skipped.length > 0) {
    rows.push([], [annotation(`Not exported: ${skipped.map(nameOf).join(', ')} — no Reload Cycle generated`)]);
  }

  return {
    fileName: programExportFileName(program.name, exportedAt),
    sheetName: 'Reload Cycle',
    columnWidths: COLUMN_WIDTHS,
    rows,
  };
}

/** Bold on a coloured band — the treatment both header rows share. */
function boldFilled(value: string, backgroundColor: string, align?: SheetCell['align']): SheetCell {
  return { value, bold: true, backgroundColor, align };
}

function headerRow(): SheetRow {
  return [
    boldFilled('Exercise', HEADER_FILL),
    boldFilled('1RM', HEADER_FILL),
    boldFilled('Reps @ 80%', HEADER_FILL),
    ...[...PRESCRIBED_WEEKS, RETEST_WEEK].map((week) => boldFilled(`W${week}`, HEADER_FILL)),
  ];
}

/**
 * Sets × Reps is stated once for the whole sheet rather than per block: it is fixed by
 * the Reload method itself, so it is identical for every block in every Program. The
 * label leads the row unfilled — the band proper starts at the first week column.
 */
function setsAndRepsBandRow(): SheetRow {
  return [
    { value: 'Sets × Reps', bold: true },
    null,
    null,
    ...PRESCRIBED_WEEKS.map((week) =>
      boldFilled(`${SETS_AND_REPS[week].sets}×${SETS_AND_REPS[week].reps}`, BAND_FILL, 'center'),
    ),
    boldFilled('1RM retest', BAND_FILL, 'center'),
  ];
}

function blockRow(block: MainLiftBlock, exerciseName: string): SheetRow {
  return [
    { value: exerciseName, bold: true },
    weight(block.test?.oneRepMax ?? null),
    count(block.test?.repsAt80Percent ?? null),
    ...PRESCRIBED_WEEKS.map((week) => weight(loadForWeek(block, week))),
    weight(block.week8Retest),
  ];
}

/** Null under the placeholder anchor, where only Week 5 is knowable — see anchor-resolution.ts. */
function loadForWeek(block: MainLiftBlock, week: number): number | null {
  return block.cycle?.find((prescription) => prescription.week === week)?.load ?? null;
}

/** A kilogram value — a number cell that merely *displays* its unit. See {@link KG_FORMAT}. */
function weight(value: number | null): SheetCell {
  return value == null ? missing() : { value, numberFormat: KG_FORMAT };
}

/** A plain count, so reps never pick up the kilogram suffix. */
function count(value: number | null): SheetCell {
  return value == null ? missing() : { value };
}

function missing(): SheetCell {
  return { value: MISSING, textColor: MUTED };
}

/** A muted aside about the table rather than data in it. */
function annotation(value: string): SheetCell {
  return { value, italic: true, textColor: MUTED };
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatExportedAt(date: Date): string {
  const { year, month, day, hours, minutes } = dateParts(date);
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * `<sanitised program name>_<YYYYMMDD-HHmmss>.xlsx`, in local time — so same-day
 * re-exports never collide and the file sorts chronologically per Program.
 */
export function programExportFileName(programName: string, exportedAt: Date): string {
  const { year, month, day, hours, minutes, seconds } = dateParts(exportedAt);
  return `${sanitizeForFileName(programName)}_${year}${month}${day}-${hours}${minutes}${seconds}.xlsx`;
}

/** Falls back to `program` for a name with nothing alphanumeric left to keep. */
function sanitizeForFileName(programName: string): string {
  const sanitized = programName.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return sanitized || 'program';
}

function dateParts(date: Date): Record<'year' | 'month' | 'day' | 'hours' | 'minutes' | 'seconds', string> {
  const pad = (value: number): string => String(value).padStart(2, '0');
  return {
    year: String(date.getFullYear()),
    month: pad(date.getMonth() + 1),
    day: pad(date.getDate()),
    hours: pad(date.getHours()),
    minutes: pad(date.getMinutes()),
    seconds: pad(date.getSeconds()),
  };
}
