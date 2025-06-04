// Delete and create a new time-based trigger (trigger every hour)
function createHourlyTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let trigger of triggers) {
    if (trigger.getHandlerFunction() === 'fetchClientHealthScores') {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  const startHour = 8; // 8:00 AM
  const endHour = 18; // 6:00 PM
  for (let hour = startHour; hour <= endHour; hour++) {
    ScriptApp.newTrigger('fetchClientHealthScores')
      .timeBased()
      .atHour(hour) // every hour
      .everyDays(1) // every day
      .create();
  }

  Logger.log('Hourly triggers created successfully for every day between 8:00 and 18:00.');
}
