console.log('background', data);

chrome.alarms.create('getCurrentPrices', {
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener((alarmInfo) => {
  console.log('Alarm', alarmInfo)
});

chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
  console.log(tabs[0].url);
  $('#name').append(tabs[0].url);
});

// url from trackProduct.js
let baseUrl = 'https://jsonplaceholder.typicode.com/posts/1';

fetch(baseUrl)
  .then(response => response.json())
  .then(json => console.log(json))

$.ajax({
        method: 'get',
        url: baseUrl
}).done(data => console.log('done', data))
  .fail(err => console.log('err', err))


