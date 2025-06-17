function setupDropdownAndChart() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var getInfoSheet = spreadsheet.getSheetByName("GetInfo");

  // Create the sheet if it does not exist
  if (!getInfoSheet) {
    getInfoSheet = spreadsheet.insertSheet("GetInfo");
  } else {
    // If the sheet exists, only clear content below A3, keeping A1:A2 and B1:B2 intact
    var lastRow = getInfoSheet.getLastRow();
    var lastColumn = getInfoSheet.getLastColumn();
    if (lastRow > 2) {
      getInfoSheet.getRange(3, 1, lastRow - 2, lastColumn).clearContent();
    }
  }

  // Set dropdown menus and helper text
  getInfoSheet.getRange("A5").setValue("Select a time range:");
  var dropdownCell = getInfoSheet.getRange("B5");
  var options = ["Past 1 day", "Past 2 days", "Past 3 days", "Past 4 days", "Past 5 days", "Past 6 days", "Past 7 days", "Past 1 month"];
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(options, true)
    .setAllowInvalid(false)
    .build();
  dropdownCell.setDataValidation(rule);
  dropdownCell.setValue("Past 7 days");

  getInfoSheet.getRange("A6").setValue("Filtered results will be displayed below:");

  // Create a trigger
  ScriptApp.newTrigger("onEditDropdownSelection")
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create();
}

function onEditDropdownSelection(e) {
  var sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "GetInfo") return;

  var selectedValue = sheet.getRange("B5").getValue();
  Logger.log("Dropdown value selected: " + selectedValue);

  var days = 0;
  if (selectedValue.startsWith("Past")) {
    if (selectedValue.includes("day")) {
      days = parseInt(selectedValue.match(/\d+/)[0]);
    } else if (selectedValue === "Past 1 month") {
      days = 30;
    }
  }

  if (days > 0) {
    filterAndDisplayData(days);
  }
}

function filterAndDisplayData(days) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var summarySheet = spreadsheet.getSheetByName("Summary");
  var getInfoSheet = spreadsheet.getSheetByName("GetInfo");

  if (!summarySheet) {
    getInfoSheet.getRange("A7").setValue("Error: Sheet 'Summary' does not exist!");
    return;
  }

  var currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Normalize the current date to the start of the day

  var startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - days); // Set the start date
  startDate.setHours(0, 0, 0, 0); // Ensure the start date is also normalized

  var data = summarySheet.getDataRange().getValues();
  var headers = data[0];
  var filteredData = [headers];

  for (var i = 1; i < data.length; i++) {
    var rowDate = new Date(data[i][0]);
    rowDate.setHours(0, 0, 0, 0); // Normalize the date of each row

    // Only keep rows within the range
    if (rowDate >= startDate && rowDate <= currentDate) {
      filteredData.push(data[i]);
    }
  }

  // Clear old data but keep A1:A6 and B1:B5
  clearGetInfoData(getInfoSheet);

  if (filteredData.length > 1) {
    getInfoSheet.getRange(7, 1, filteredData.length, filteredData[0].length).setValues(filteredData);
  } else {
    getInfoSheet.getRange("A7").setValue("No matching data found.");
  }

  // Call the existing function to draw the chart
  addOrUpdateScatterChartForGetInfo(filteredData, getInfoSheet);
}

function clearGetInfoData(sheet) {
  // Get the valid data range of the entire sheet
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();

  // Ensure only content below A7 is cleared, keeping A1:A6 and B1:B5 intact
  if (lastRow > 6) { // Ensure there is data to clear
    sheet.getRange(7, 1, lastRow - 6, lastColumn).clearContent(); // Clear content starting from row 7
  }
}
