  // Main function: Fetch data from the Cisco Meraki API and write it to the spreadsheet
function fetchClientHealthScores() {
  // Get the current spreadsheet object
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // Get the "GetInfo" sheet
  const getInfoSheet = spreadsheet.getSheetByName('GetInfo');
  if (!getInfoSheet) {
    Logger.log('The "GetInfo" sheet does not exist. Please ensure there is a sheet named "GetInfo"');
    return;
  }

  // Dynamically read the values of networkId and apiKey
  const networkId = getInfoSheet.getRange('B1').getValue(); // Read the network ID from cell B1
  const apiKey = getInfoSheet.getRange('B2').getValue();    // Read the API Key from cell B2

  if (!networkId || !apiKey) {
    Logger.log('networkId or apiKey is undefined. Please check if in the GetInfo sheet have values');
    return;
  }

  // Format the date and time
  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const time = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'HH:mm:ss');


  // Get or create today's sheet
  let sheet = spreadsheet.getSheetByName(date);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(date);

    const targetIndex = 4; // Insert the table into the fourth position
    spreadsheet.setActiveSheet(sheet);
    spreadsheet.moveActiveSheet(targetIndex);
  }

  // Call the Meraki API
  const url = `https://api.meraki.com/api/v1/networks/${networkId}/wireless/clients/healthScores`;

  const options = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'X-Cisco-Meraki-API-Key': apiKey
    }
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    Logger.log('API Response Data: ' + JSON.stringify(data, null, 2));

    // Set the table headers
    const headers = ['MAC', 'Client ID', 'Performance (Latest)', 'Performance (Current Connection)', 'Onboarding (Latest)', 'Date & Time'];

    const lastColumn = sheet.getLastColumn();
    const startColumn = lastColumn > 0 ? lastColumn + 2 : 1;

    sheet.getRange(1, startColumn, 1, headers.length).setValues([headers]);

    // Parse the API response data
    const rows = data.map(client => {
      const performanceLatest = client.performance.latest !== null ? client.performance.latest : 'N/A';
      const performanceCurrentConnection = client.performance.currentConnection !== null ? client.performance.currentConnection : 'N/A';
      const onboardingLatest = client.onboarding.latest !== null ? client.onboarding.latest : 'N/A';

      return [
        client.mac,
        client.clientId,
        performanceLatest,
        performanceCurrentConnection,
        onboardingLatest,
        `${date} ${time}`
      ];
    });

    // Write data to the spreadsheet
    sheet.getRange(2, startColumn, rows.length, headers.length).setNumberFormat('@STRING@');
    sheet.getRange(2, startColumn, rows.length, headers.length).setValues(rows);

  } catch (error) {
    Logger.log('Error occurred while retrieving data: ' + error.message);
  }
}