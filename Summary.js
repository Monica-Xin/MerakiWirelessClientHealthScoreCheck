// Update the Summary sheet and generate a chart
function updateSummary() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); // Get the currently active Google Spreadsheet

  // Print all sheet names to help confirm if the target sheet is found
  Logger.log("All sheet names: " + spreadsheet.getSheets().map(sheet => sheet.getName()));

  // Get the sheet named 'Summary'
  let summarySheet = spreadsheet.getSheetByName('Summary');

  // Fix potential hidden whitespace issues and check if the sheet exists
  if (!summarySheet) {
    const sheets = spreadsheet.getSheets();
    for (let sheet of sheets) {
      if (sheet.getName().trim() === 'Summary') { // Fix potential hidden whitespace issues
        summarySheet = sheet;
        break;
      }
    }
  }

  // If the Summary sheet is still not found, create it
  if (!summarySheet) {
    Logger.log('Summary sheet not found. Creating it now.');
    try {
      summarySheet = spreadsheet.insertSheet('Summary',2);
      // Add headers to the newly created sheet
      summarySheet.getRange("A1:C1").setValues([['DATE', 'Average of Performance (Latest)', 'Onboarding Average(Latest)']]);
      Logger.log('Summary sheet created successfully with headers.');
    } catch (e) {
      Logger.log('Error creating Summary sheet: ' + e.toString());
      // If creation fails, log the issue and terminate the function
      return;
    }
  } else {
    Logger.log('Summary sheet found.');
  }


  // Get the current date
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  const sheets = spreadsheet.getSheets();
  const targetSheet = sheets.find(sheet => sheet.getName() === today);

  if (!targetSheet) {
    Logger.log(`No data sheet found for ${today}.`);
    return;
  }

  const range = targetSheet.getDataRange();
  const values = range.getValues();

  const performanceValues = [];
  const onboardingValues = [];

  const totalColumns = values[0].length; // Get the total number of columns
  const groupSize = 6; // Each group occupies 6 columns
  const gapSize = 1; // There is a 1-column gap between each group

  // Assuming the first row contains headers and data starts from the second row (index 1)
  if (values.length > 1) {
      for (let startColumn = 3; startColumn <= totalColumns; startColumn += groupSize + gapSize) {
        const performanceIndex = startColumn - 1; // Column index for Performance (Latest) - assuming 1-based column 3 is index 2
        const onboardingIndex = startColumn + 1; // Column index for Onboarding (Latest) - assuming 1-based column 5 is index 4

        // Check if the column indices are within the bounds of the row
        if (performanceIndex < values[0].length && onboardingIndex < values[0].length) {
            for (let i = 1; i < values.length; i++) { // Skip the header row and start from row 2
              const performance = values[i][performanceIndex];
              const onboarding = values[i][onboardingIndex];

              // Ignore values marked as "N/A" and ensure they are numbers
              if (performance !== 'N/A' && performance !== '' && performance !== null) {
                const perfFloat = parseFloat(performance);
                if (!isNaN(perfFloat)) {
                  performanceValues.push(perfFloat);
                } else {
                   Logger.log(`Warning: Non-numeric Performance value found at row ${i+1}, column ${performanceIndex+1}: "${performance}"`);
                }
              }

              if (onboarding !== 'N/A' && onboarding !== '' && onboarding !== null) {
                 const onbFloat = parseFloat(onboarding);
                 if (!isNaN(onbFloat)) {
                   onboardingValues.push(onbFloat);
                 } else {
                    Logger.log(`Warning: Non-numeric Onboarding value found at row ${i+1}, column ${onboardingIndex+1}: "${onboarding}"`);
                 }
              }
            }
        } else {
            Logger.log(`Warning: Column indices out of bounds for startColumn ${startColumn}. Performance index: ${performanceIndex}, Onboarding index: ${onboardingIndex}, Total columns: ${values[0].length}`);
        }
      }
  } else {
      Logger.log(`Data sheet ${today} is empty or only has headers.`);
  }


  // Calculate the average value
  const performanceAverage = performanceValues.length
    ? performanceValues.reduce((a, b) => a + b, 0) / performanceValues.length
    : 0;

  const onboardingAverage = onboardingValues.length
    ? onboardingValues.reduce((a, b) => a + b, 0) / onboardingValues.length
    : 0;

  Logger.log(`Calculated Averages: Performance = ${performanceAverage.toFixed(2)}, Onboarding = ${onboardingAverage.toFixed(2)}`);


  // Check if there's already a record for the current day in the Summary sheet
  // Retrieve all data, including the header row, from the Summary sheet
  const summaryValues = summarySheet.getDataRange().getValues();
  let rowToUpdate = -1; // Use -1 to indicate no row found yet

  // Start checking from the second row (index 1) to skip headers
  for (let i = 1; i < summaryValues.length; i++) {
    const existingDateValue = summaryValues[i][0];
     // Ensure existingDateValue is a valid Date object before formatting
    if (existingDateValue instanceof Date) {
        const existingDate = Utilities.formatDate(existingDateValue, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        if (existingDate === today) {
          rowToUpdate = i + 1; // Google Sheets row numbers start from 1, array indices from 0
          break;
        }
    } else {
        // Log a warning if the first column is not a Date object
        Logger.log(`Warning: Non-Date value found in Summary sheet at row ${i+1}, column 1: "${existingDateValue}"`);
    }
  }


  if (rowToUpdate > 0) {
    // If a record for the current day already exists, update that row
    // Ensure the date is written correctly as a Date object for proper chart plotting
    summarySheet.getRange(rowToUpdate, 1, 1, 3).setValues([[new Date(today), performanceAverage, onboardingAverage]]);
    Logger.log(`Updated existing summary for ${today} at row ${rowToUpdate}.`);
  } else {
    // If no record exists for the current day, insert a new row at the end
    const lastRow = summarySheet.getLastRow();
    // Ensure the date is written correctly as a Date object for proper chart plotting
    summarySheet.getRange(lastRow + 1, 1, 1, 3).setValues([[new Date(today), performanceAverage, onboardingAverage]]);
    Logger.log(`Inserted new summary for ${today} at row ${lastRow + 1}.`);
  }

  // Add or update the chart
  // Assuming addOrUpdateScatterChart function exists and handles chart creation/update
  addOrUpdateScatterChart(summarySheet);
}

// Note: The addOrUpdateScatterChart function is not provided in this code snippet.
// You need to have that function defined elsewhere in your script.
// It should take the summarySheet as an argument and create or update a chart
// based on the data in columns A, B, and C.
