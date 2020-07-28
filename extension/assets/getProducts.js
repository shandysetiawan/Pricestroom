// let url = 'http://localhost:3001/tracks';
let url = 'http://52.74.0.232:3001/tracks'; //AWS Shandy
// let url = 'http://13.229.109.104:3001/tracks'; //AWS Zul
// let url = 'https://gentle-lake-46054.herokuapp.com/tracks'; //Heroku

$("#MainTable").click(function() {
  updateCurrentItems()
})

// Update Current items from Server to chrome.storage

function updateCurrentItems() {
  $.ajax({
    method: 'get',
    url,
    headers: {
      dataitem: '["5f1fa5f1dc956c20df19183f","5f1fac1565b98821a9960def","5f1fb26dbb6aa92255b555d4","5f1fb229bb6aa92255b555d3"]',
    }
  })
    .done(data => {
      console.log('GET done', data)
      return data
    })
    .done(items => {
      chrome.storage.sync.set({ items }, function () {
        if (items.length > 0) displayTable()
        else console.log('error @ set items')
      })
    })
    .fail(err => console.log('err', err))
}




$("#TrackProduct").click(function() {
  // console.log(data);

  // get current tab
  chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
    console.log(tabs[0].url);
  });

});

// function checkUrl(url) {
//   if (url.search('tokopedia')) return 'tokopedia'
//   else if (url.search('bukalapak')) return 'bukalapak'
//   else return false
// };
