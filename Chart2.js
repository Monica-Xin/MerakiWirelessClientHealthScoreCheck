// Add or update a chart in the GetInfo sheet
function removeAllCharts(sheet) {
  const charts = sheet.getCharts();
  charts.forEach(chart => {
    sheet.removeChart(chart);
    Logger.log('Removed a chart or object.');
  });
}

function addOrUpdateScatterChartForGetInfo(filteredData, getInfoSheet) {
  if (!filteredData || filteredData.length <= 1) {
    Logger.log("No data to create chart.");
    return;
  }

  // Remove all existing charts from the GetInfo sheet
  removeAllCharts(getInfoSheet);

  // Prepare ranges for the X-axis (dates) and two Y-axis series
  const lastRow = filteredData.length + 7; // Account for the offset (header rows)
  const dataRange = getInfoSheet.getRange(8, 1, filteredData.length, 3); // Full data range (A:C)

  // Format all dates in the first column
  const allDates = filteredData.map(row =>
    Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), 'yyyy-MM-dd')
  );

  // Create the scatter chart
  const chart = getInfoSheet.newChart()
    .asScatterChart()
    .addRange(dataRange)
    .setChartType(Charts.ChartType.SCATTER)
    .setOption('title', 'Daily Averages Score')
    .setOption('hAxis', {
      title: 'Date',
      ticks: allDates, // Explicitly include all dates
      gridlines: { count: allDates.length }, // Ensure one gridline per date
      slantedText: true,
      slantedTextAngle: 45,
      textStyle: { fontSize: 10 } // Reduce font size for better fit
    })
    .setOption('vAxis', {
      title: 'Scores',
      viewWindow: { min: 0, max: 105 }
    })
    .setOption('series', {
      0: { color: 'blue', labelInLegend: 'Average of Performance (Latest)', pointSize: 5 },
      1: { color: 'red', labelInLegend: 'Average of Onboarding (Latest)', pointSize: 5, pointShape: 'triangle' }
    })
    .setPosition(2, 5, 0, 0) // Position the chart
    .build();

  // Insert the chart into the GetInfo sheet
  getInfoSheet.insertChart(chart);
  Logger.log('Inserted new scatter chart in GetInfo sheet.');
}