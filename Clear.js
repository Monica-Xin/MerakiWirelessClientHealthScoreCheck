function Clear() {
  // 获取当前活动的工作簿
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // 定义需要保留的表格名称
  const sheetsToKeep = ["Read Me", "GetInfo"];

  // 获取工作簿中的所有表格
  const allSheets = spreadsheet.getSheets();

  // 遍历所有表格
  allSheets.forEach(sheet => {
    // 获取当前表格的名称
    const sheetName = sheet.getName();

    // 如果当前表格不在需要保留的列表中，则删除该表格
    if (!sheetsToKeep.includes(sheetName)) {
      spreadsheet.deleteSheet(sheet); // 删除整个表格
    }
  });

  // 清空 "GetInfo" 表格中的特定单元格（B1 和 B2）
  const getInfoSheet = spreadsheet.getSheetByName("GetInfo");
  if (getInfoSheet) {
    getInfoSheet.getRange("B1:B2").clearContent(); // 清空 B1 和 B2 的内容
  }
}
