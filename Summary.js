 // Update the Summary sheet and generate a chart
function updateSummary() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); // Get the currently active Google Spreadsheet
  
 // Print all sheet names to help confirm if the target sheet is found
  Logger.log("All sheet names: " + spreadsheet.getSheets().map(sheet => sheet.getName())); 
  
 // Get the sheet named 'Summary'
  let summarySheet = spreadsheet.getSheetByName('Summary');

 // Fix potential hidden whitespace issues
  if (!summarySheet) {
    const sheets = spreadsheet.getSheets();
    for (let sheet of sheets) {
      if (sheet.getName().trim() === 'Summary') { // Fix potential hidden whitespace issues
        summarySheet = sheet;
        break;
      }
    }
  }

  // If the Summary sheet is still not found, log the issue and terminate the function
  if (!summarySheet) {
    Logger.log('Summary sheet is undefined. Please ensure it exists in the spreadsheet.');
    return;
  }

  Logger.log('Summary sheet found.');

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

  for (let startColumn = 3; startColumn <= totalColumns; startColumn += groupSize + gapSize) {
    const performanceIndex = startColumn - 1; // Column index for Performance (Latest)
    const onboardingIndex = startColumn + 1; // Column index for Onboarding (Latest)

    for (let i = 1; i < values.length; i++) { // Skip the header row and start from row 2
      const performance = values[i][performanceIndex];
      const onboarding = values[i][onboardingIndex];

      // Ignore values marked as "N/A"
      if (performance !== 'N/A' && !isNaN(parseFloat(performance))) {
        performanceValues.push(parseFloat(performance));
      }

      if (onboarding !== 'N/A' && !isNaN(parseFloat(onboarding))) {
        onboardingValues.push(parseFloat(onboarding));
      }
    }
  }

  // Calculate the average value
  const performanceAverage = performanceValues.length
    ? performanceValues.reduce((a, b) => a + b, 0) / performanceValues.length
    : 0;

  const onboardingAverage = onboardingValues.length
    ? onboardingValues.reduce((a, b) => a + b, 0) / onboardingValues.length
    : 0;

  // Check if there's already a record for the current day
  const summaryValues = summarySheet.getDataRange().getValues(); // Retrieve all data, including the header row
  let rowToUpdate = -1;

  for (let i = 1; i < summaryValues.length; i++) { // Start from row 2, skipping the header row
    const existingDate = Utilities.formatDate(new Date(summaryValues[i][0]), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    if (existingDate === today) { // Ensure the date format is consistent
      rowToUpdate = i + 1; // Google Sheets row numbers start from 1
      break;
    }
  }

  if (rowToUpdate > 0) {
    // If a record for the current day already exists, update that row
    summarySheet.getRange(rowToUpdate, 1, 1, 3).setValues([[today, performanceAverage, onboardingAverage]]);
    Logger.log(`Updated existing summary for ${today}.`);
  } else {
    // If no record exists for the current day, insert a new row
    const lastRow = summarySheet.getLastRow();
    summarySheet.getRange(lastRow + 1, 1, 1, 3).setValues([[today, performanceAverage, onboardingAverage]]);
    Logger.log(`Inserted new summary for ${today}.`);
  }

  // Add or update the chart
  addOrUpdateScatterChart(summarySheet);
}