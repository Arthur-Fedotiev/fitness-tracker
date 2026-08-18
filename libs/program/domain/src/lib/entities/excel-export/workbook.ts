/**
 * A worksheet described in this domain's own vocabulary rather than any library's.
 *
 * The point is the seam: layout rules stay independent of whatever writes the file, so
 * swapping the writer (ADR-0009 keeps `exceljs` as a live fallback) touches the adapter
 * alone and never this domain. Only properties the export actually uses appear here —
 * this is a description of our sheet, not a general spreadsheet abstraction.
 */
export interface SheetCell {
  value: string | number;
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  /** Hex, `#RRGGBB`. */
  textColor?: string;
  /** Hex, `#RRGGBB`. */
  backgroundColor?: string;
  align?: 'left' | 'center' | 'right';
  /**
   * Excel number format code for a numeric value, e.g. `General" kg"`. Applying one
   * keeps the cell a real number that spreadsheets can still sum and chart — unlike
   * folding a unit into the value, which would turn it into text.
   */
  numberFormat?: string;
}

/** One row of cells; `null` is a blank cell. */
export type SheetRow = Array<SheetCell | null>;

export interface Workbook {
  fileName: string;
  sheetName: string;
  /** One width per column, left to right. */
  columnWidths: number[];
  rows: SheetRow[];
}
