import zipfile
from pathlib import Path

path = Path("public/templates/preguntas-plantilla-peliculas.xlsx")

sheet1 = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="A1:E1"/>
  <sheetViews>
    <sheetView tabSelected="1" workbookViewId="0"/>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <cols>
    <col min="1" max="1" width="24.7" customWidth="1"/>
    <col min="2" max="2" width="12.7" customWidth="1"/>
    <col min="3" max="3" width="25.7" customWidth="1"/>
    <col min="4" max="4" width="70.7" customWidth="1"/>
    <col min="5" max="5" width="45.7" customWidth="1"/>
  </cols>
  <sheetData>
    <row r="1" spans="1:5">
      <c r="A1" t="inlineStr"><is><t>id</t></is></c>
      <c r="B1" t="inlineStr"><is><t>movieId</t></is></c>
      <c r="C1" t="inlineStr"><is><t>category</t></is></c>
      <c r="D1" t="inlineStr"><is><t>prompt</t></is></c>
      <c r="E1" t="inlineStr"><is><t>correctAnswer</t></is></c>
    </row>
  </sheetData>
  <dataValidations count="2">
    <dataValidation type="list" allowBlank="1" showInputMessage="1" showErrorMessage="1" sqref="C2:C1048576">
      <formula1>categorias</formula1>
    </dataValidation>
    <dataValidation type="list" allowBlank="1" showInputMessage="1" showErrorMessage="1" sqref="B2:B1048576">
      <formula1>"hp1,hp2,hp3,hp4,hp5,hp6,hp7_1,hp7_2"</formula1>
    </dataValidation>
  </dataValidations>
  <pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>
</worksheet>
"""

with zipfile.ZipFile(path, "r") as source:
    files = {name: source.read(name) for name in source.namelist()}

files["xl/worksheets/sheet1.xml"] = sheet1.encode("utf-8")

with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as target:
    for name, data in files.items():
        target.writestr(name, data)

print(f"Patched {path} ({path.stat().st_size} bytes)")
