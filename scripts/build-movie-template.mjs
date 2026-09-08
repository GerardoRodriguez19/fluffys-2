import * as XLSX from "xlsx";
import { writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const categories = [
  "Personaje",
  "Hechizo o encantamiento",
  "Organización",
  "Ley - decreto",
  "Poción",
  "Criatura",
  "Fecha",
  "Lugar",
  "Profecía",
  "Muerte",
  "Medio",
  "Educación",
  "Nota / curiosidad",
  "Recuerdo",
  "Artefacto u objeto",
  "Horrocrux",
];

const instructionRows = [];

function add(text = "") {
  instructionRows.push([text]);
}

add("Reglas del Excel para Fluffys 2 — Películas");
add();
add("Columnas obligatorias");
add("movieId, category, prompt, correctAnswer");
add();
add("Columnas opcionales");
add("id");
add();
add("movieId");
add("hp1, hp2, hp3, hp4, hp5, hp6, hp7_1 o hp7_2.");
add();
add("category");
add("Debe coincidir exactamente con una categoría permitida:");

const categoryStartRow = instructionRows.length + 1;

for (const category of categories) {
  add(category);
}

const categoryEndRow = instructionRows.length;

add();
add("prompt");
add("Obligatorio. Máximo 500 caracteres.");
add();
add("correctAnswer");
add("Obligatorio. Máximo 300 caracteres.");
add();
add("Notas");
add("Una pregunta por fila. La primera hoja debe llamarse Preguntas o ser la primera del archivo.");
add("Las películas no tienen capítulo. No incluyas la columna chapter.");

const questionsSheet = XLSX.utils.aoa_to_sheet([
  ["id", "movieId", "category", "prompt", "correctAnswer"],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
]);

questionsSheet["!cols"] = [
  { wch: 24 },
  { wch: 12 },
  { wch: 26 },
  { wch: 70 },
  { wch: 45 },
];

const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionRows);
instructionsSheet["!cols"] = [{ wch: 80 }];

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, questionsSheet, "Preguntas");
XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instrucciones");
workbook.Workbook = {
  Names: [
    {
      Name: "categorias",
      Ref: `Instrucciones!$A$${categoryStartRow}:$A$${categoryEndRow}`,
    },
  ],
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path
  .join(root, "public", "templates", "preguntas-plantilla-peliculas.xlsx")
  .replaceAll("\\", "/");

writeFileSync(outputPath, XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));

const pythonScript = path.join(root, "scripts", "patch-movie-template-sheet.py");
const result = spawnSync("python", [pythonScript], {
  encoding: "utf-8",
  cwd: root,
});

if (result.status !== 0) {
  console.error(result.stdout);
  console.error(result.stderr);
  process.exit(result.status ?? 1);
}

console.log(`Plantilla de película creada: ${outputPath}`);
console.log(`Categorías en Instrucciones!A${categoryStartRow}:A${categoryEndRow}`);
