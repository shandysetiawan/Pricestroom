let baseUrl = 'http://localhost:3001/tracks';

chrome.alarms.create('getCurrentPrices', {
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener((alarmInfo) => {
  console.log(alarmInfo)
  $.ajax({
    method: 'get',
    url: baseUrl
  }).done(data => console.log('alarm', alarmInfo, data))
    .fail(err => console.log('err', alarmInfo, err))
});

// chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
//   console.log(tabs[0].url);
//   $('#name').append(tabs[0].url);
// });
