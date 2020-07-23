console.log('background');
chrome.alarms.create('getCurrentPrices', {
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener((alarmInfo) => console.log('Alarm', alarmInfo));
