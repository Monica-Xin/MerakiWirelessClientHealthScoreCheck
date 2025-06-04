//Create a daily Summary update trigger (e.g., run once daily at 18:59)
function createSummaryUpdateTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let trigger of triggers) {
    if (trigger.getHandlerFunction() === 'updateSummary') {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  ScriptApp.newTrigger('updateSummary')
    .timeBased()
    .everyDays(1)
    .atHour(18)
    .nearMinute(59)
    .create();

  Logger.log('Daily summary update trigger created successfully.');
}
