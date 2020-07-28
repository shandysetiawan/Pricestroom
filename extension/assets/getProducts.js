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
    method: 'GET',
    url,
    headers: {
      dataitem: '["5f1fac1565b98821a9960def","5f1fcd0cbb6aa92255b555d8","5f1fb26dbb6aa92255b555d4","5f1fb229bb6aa92255b555d3","5f1fbe8abb6aa92255b555d7"]',
    }
  })
    .done(data => {
      console.log('GET done', data)
      data.forEach(el => pushNotification(el))
      return data
    })
    .done(items => {
      chrome.storage.sync.set({ items }, _=> displayTable())
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

let dataDummy ={
  "_id": "5f1fac1565b98821a9960def",
  "url": "https://www.bukalapak.com/p/mobil-part-dan-aksesoris/eksterior-mobil/headlamp-stoplamp/2ktrzz2-jual-osram-lampu-mobil-h9-cool-blue-hyper-plus-12v-55w-62213cbhplus-putih-kebiruan",
  "name": "Osram  Lampu Mobil H9 Cool Blue Hyper Plus 12V 55W - 62213CBHPLUS- Putih Kebiruan ",
  "imageUrl": "https://s1.bukalapak.com/img/65011464361/large/data.jpeg",
  "storeName": "Autolicht Official Store",
  "email": "markhiro77@gmail.com",
  "targetPrice": 140000,
  "emailNotif": false,
  "pushNotif": true,
  "priceChangeNotif": false,
  "initialPrice": 220000,
  "currentPrice": 220000
}

function checkNotification(object) {
  if (!object.pushNotif) {
    return null
  } else {
    pushNotification(object)
  }
}

function pushNotification(objectData) {
  let notifOptions = {
    type: 'basic',
    title: 'Price is set!',
    message: `${objectData.name} now price is ${objectData.targetPrice}`,
    iconUrl: '../icons/icon_32.png'
  }
  chrome.notifications.create(notifOptions, callback)
  function callback() {
    onjectData.pushNotif = false
  }
  console.log(objectData)
}