import { Injectable } from '@angular/core';
import writeXlsxFile, { Row, SheetData } from 'write-excel-file/browser';
import { buildProgramWorkbook } from '../entities/excel-export/program-workbook';
import { SheetCell, SheetRow } from '../entities/excel-export/workbook';
import { Program } from '../entities/models/program';

/**
 * The `.xlsx` sink for the `program` domain — the one place that knows which library
 * writes the file and how the browser receives it.
 *
 * What the sheet *says* is decided by `buildProgramWorkbook`, which is pure and speaks
 * only this domain's own `Workbook` model. Keeping that split is the whole point: callers (a component, a
 * store, a test) ask for a download and learn nothing about `write-excel-file`, and
 * swapping it for ADR-0009's `exceljs` fallback rewrites this file and nothing else.
 */
@Injectable({ providedIn: 'root' })
export class ProgramExcelExportService {
  /**
   * Builds the workbook for one Program and hands it to the browser as a download.
   * Rejects if the file can't be generated; callers own how that surfaces to the user.
   */
  async downloadProgram(program: Program, exerciseNames: ReadonlyMap<string, string>): Promise<void> {
    const workbook = buildProgramWorkbook({ program, exerciseNames, exportedAt: new Date() });

    await writeXlsxFile(toSheetData(workbook.rows), {
      sheet: workbook.sheetName,
      columns: workbook.columnWidths.map((width) => ({ width })),
    }).toFile(workbook.fileName);
  }
}

/** Exported for testing; the sink itself is the only production caller. */
export function toSheetData(rows: SheetRow[]): SheetData {
  return rows.map((row) => row.map(toCell));
}

/**
 * Maps one of our cells onto `write-excel-file`'s schema. Numbers are written as real
 * `Number` cells so spreadsheets can sum and chart them, and a number format is only
 * ever attached to one — the library rejects a format on a string cell.
 */
function toCell(cell: SheetCell | null): Row[number] {
  if (cell === null) {
    return null;
  }

  const style = {
    fontWeight: cell.bold ? ('bold' as const) : undefined,
    fontStyle: cell.italic ? ('italic' as const) : undefined,
    fontSize: cell.fontSize,
    textColor: cell.textColor,
    backgroundColor: cell.backgroundColor,
    align: cell.align,
  };

  return typeof cell.value === 'number'
    ? { ...style, value: cell.value, type: Number, format: cell.numberFormat }
    : { ...style, value: cell.value, type: String };
}
