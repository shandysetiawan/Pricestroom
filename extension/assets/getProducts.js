// let url = 'http://localhost:3001/tracks';
let url = 'http://52.74.0.232:3001/tracks'; //AWS Shandy
// let url = 'http://13.229.109.104:3001/tracks'; //AWS Zul
// let url = 'https://gentle-lake-46054.herokuapp.com/tracks'; //Heroku

getAndUpdate()

// Update Current items from Server to chrome.storage
function getAndUpdate() {
  chrome.storage.sync.get(['items'], function (result) {
    let { items } = result
    console.log('items di getAndUpdate', items)
    let dataitem = items.map(el => el._id)
    updateCurrentItems(JSON.stringify(dataitem))
  })
}

function updateCurrentItems(dataitem) {
  console.log('dataitem di getProducts', dataitem)
  $.ajax({
    method: 'GET',
    url,
    headers: {
      dataitem
    }
  })
    .done(data => {
      console.log('GET done', data)
      data.forEach(el => checkNotification(el))
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

function checkNotification(object) {
  let { _id, pushNotif } = object
  if (!pushNotif) {
    return null
  } else if (pushNotif) {
    pushNotification(object)
    let data = {
      ...object,
      pushNotif: false
    }
    $.ajax({
      method: "PUT",
      url: `${url}/${_id}`,
        data,
    })
    .done((response) => {
        let { value } = response.data
        console.log('PUT done value', value)
        updateItems(value)
    })
    .fail((err) => {
        console.log('PUT err', err)
    })
  }
};

function pushNotification(objectData) {
  const { name, currentPrice } = objectData
  console.log('pushNotif', name, currentPrice)
  let notifOptions = {
    type: 'basic',
    title: 'Price is set!',
    message: `${name} now price is ${currentPrice}`,
    iconUrl: '../icons/icon_32.png'
  }
  chrome.notifications.create(notifOptions, callback)
  function callback() {
    objectData.pushNotif = false
  }
  console.log(objectData)
}