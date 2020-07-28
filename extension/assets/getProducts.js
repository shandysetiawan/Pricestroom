// let url = 'http://localhost:3001/tracks';
let url = 'http://52.74.0.232:3001/tracks'; //AWS Shandy
// let url = 'http://13.229.109.104:3001/tracks'; //AWS Zul
// let url = 'https://gentle-lake-46054.herokuapp.com/tracks'; //Heroku

getAndUpdate()

// Update Current items from Server to chrome.storage
function getAndUpdate() {
  chrome.storage.sync.get(['items'], function (result) {
    let { items } = result
    if (!items) items = []
    let dataitem = items.map(el => el._id)
    updateCurrentItems(JSON.stringify(dataitem))
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
      method: "PUT",
      url: `${url}/${_id}`,
        data,
    })
    .done((response) => {
        let { value } = response.data
        updateItems(value)
    })
    .fail(err => console.error(err))
  }
};

function pushNotification(objectData) {
  const { name, currentPrice } = objectData
  let notifOptions = {
    type: 'basic',
    title: 'Price is set!',
    message: `${name} now price is ${currentPrice}`,
    iconUrl: '../icons/icon_32.png'
  }
  chrome.notifications.create(notifOptions)
}