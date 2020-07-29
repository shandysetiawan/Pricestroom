let url = 'http://localhost:3001/tracks';
// let url = 'http://52.74.0.232:3001/tracks'; //AWS Shandy
// let url = 'http://13.229.109.104:3001/tracks'; //AWS Zul
// let url = 'https://gentle-lake-46054.herokuapp.com/tracks'; //Heroku

getAndUpdate()

// Update Current items from Server to chrome.storage
function getAndUpdate() {
  chrome.storage.sync.get(['items'], function (result) {
    let { items } = result
    if (!items) chrome.storage.sync.set({ items: [] })
    else {
      let dataitem = items.map(el => el._id)
      updateCurrentItems(JSON.stringify(dataitem))
    }
  })
}

function updateCurrentItems(dataitem) {
  $.ajax({
    method: 'GET',
    url,
    headers: {
      dataitem
    }
  })
    .done(data => {
      data.forEach(el => checkNotification(el))
      return data
    })
    .done(items => {
      chrome.storage.sync.set({ items }, _=> displayTable())
    })
    .fail(err => console.error(err))
}

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
      method: 'PUT',
      url: `${url}/${_id}`,
      data,
    })
    .done((response) => {
        let { value } = response.data
        updateItems(value);
    })
    .fail(err => console.error(err))
  }
};

function pushNotification(objectData) {
  const { url, name, currentPrice, targetPrice } = objectData
  let title = 'The price has changed!'
  let message = `The price of ${name} has changed to ${currentPrice}`
  if (targetPrice) {
    title = 'The price has reached your target'
    message = `The current price of ${name} is ${currentPrice}`
  }
  let notifOptions = {
    type: 'basic',
    title,
    message,
    iconUrl: '../icons/icon_32.png'
  }
  chrome.notifications.create(url, notifOptions);
  chrome.notifications.onClicked.addListener(function(url) {
    chrome.tabs.create({ url })
  })
}