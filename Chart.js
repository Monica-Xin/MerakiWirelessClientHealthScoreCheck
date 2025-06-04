// Add or update a chart in the Summary sheet
function removeAllCharts(sheet) {
  const charts = sheet.getCharts();
  charts.forEach(chart => {
    sheet.removeChart(chart);
    Logger.log('Removed a chart or object.');
  });
}

function addOrUpdateScatterChart() {
  // Get the active spreadsheet (no need for specific sheet ID)
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const summarySheet = spreadsheet.getSheetByName('Summary');
  
  if (!summarySheet) {
    Logger.log('Summary sheet is undefined.');
    return;
  }

  // Remove all existing charts to ensure only one chart is present
  removeAllCharts(summarySheet);

  // Logic for creating a new chart
  const lastRow = summarySheet.getLastRow();
  const lastColumn = summarySheet.getLastColumn();
  
  if (lastRow === 0 || lastColumn === 0) {
    Logger.log("No data in Summary sheet.");
    return;
  }

  const dataRange = summarySheet.getRange(2, 1, lastRow - 1, lastColumn); // Data range excluding headers
  const dateColumn = summarySheet.getRange(2, 1, lastRow - 1, 1).getValues().flat(); // Date column (A)
  const allDates = dateColumn.map(date => Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), 'yyyy-MM-dd')); // Format dates

  const chart = summarySheet.newChart()
    .asScatterChart()
    .addRange(dataRange)
    .setChartType(Charts.ChartType.SCATTER)
    .setOption('title', 'Daily Averages Score')
    .setOption('hAxis', {
      title: 'Date',
      ticks: allDates,
      gridlines: { count: allDates.length },
      slantedText: true,
      slantedTextAngle: 45
    })
    .setOption('vAxis', {
      title: 'Average Scores',
      viewWindow: { min: 0, max: 105 }
    })
    .setOption('series', {
      0: { color: 'blue', labelInLegend: 'Average of Performance (Latest)', pointSize: 5 },
      1: { color: 'red', labelInLegend: 'Average of Onboarding (Latest)', pointSize: 5, pointShape: 'triangle' }
    })
    .setPosition(2, 5, 0, 0)
    .build();

  summarySheet.insertChart(chart);
  Logger.log('Inserted new scatter chart with customized point shapes.');
}