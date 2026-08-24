import * as XLSX from "xlsx";
import { parseQuestionsRows, type ParseResult } from "./parseQuestionsRows";

export async function parseQuestionsXlsx(file: File): Promise<ParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return {
      questions: [],
      errors: [{ row: 1, message: "El Excel no tiene hojas." }],
    };
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(sheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  const normalized = rows.map((row) => (row ?? []).map((cell) => String(cell ?? "").trim()));

  return parseQuestionsRows(normalized);
}
