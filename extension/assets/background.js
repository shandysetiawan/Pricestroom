// let url = 'http://localhost:3001/tracks';
let url = 'http://52.74.0.232:3001/tracks'; //AWS Shandy
// let url = 'http://13.229.109.104:3001/tracks'; //AWS Zul
// let url = 'https://gentle-lake-46054.herokuapp.com/tracks';

chrome.storage.sync.get(['items'], function(result) {
  let {items} = result
  if (!items) chrome.storage.sync.set({ items: [] })
  else {
    items.forEach(el => checkNotification(el))
  }
});

chrome.alarms.create('getCurrentPrices', {
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener(_ => getAndUpdate());

// Update Current items from Server to chrome.storage
function getAndUpdate() {
  chrome.storage.sync.get(['items'], function (result) {
    let { items } = result
    if (!items) chrome.storage.sync.set({ items: [] })
    else {
      console.log('getAndUpdate background', items)
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
      console.log('backgorund data', data)
      return data
    })
    .done(items => {
      chrome.storage.sync.set({ items })
    })
    .fail(err => console.error(err))
    .always(chrome.runtime.sendMessage({ action: 'displayTable' }))
}

/* --- CHECK URL && CHANGE ICON--- */

function checkUrl(stringUrl, action) {
  switch (action) {
    case 1:
      if (
        stringUrl.search("www.tokopedia.com") > 0 ||
        stringUrl.search("bukalapak.com") > 0
        ) return true
        else return false
    case 2:
      if (
        stringUrl.search("pricestroom.web.app") > 0 ||
        stringUrl.search("localhost:3000") > 0
        ) return true
        else return false
    default: return false
  }
};

// when new tab is open
chrome.tabs.onActivated.addListener(function({ tabId }) {
  chrome.tabs.get(tabId, function(change) {
    const { url } = change
    console.log('onActivated', url)
    if(!url) {
      chrome.browserAction.setPopup({ popup: '', tabId });
      chrome.browserAction.setIcon({ path: '../icons/icon_32_disabled.png', tabId });
      console.log('onActivated null');
      return undefined;
    } else if(checkUrl(url, 1)) {
      chrome.browserAction.setPopup({ popup: '../option.html', tabId });
      chrome.browserAction.setIcon({ path: '../icons/icon_32.png', tabId });
      getAndUpdate();
      console.log('onActivated matched');
    } else if(checkUrl(url, 2)) {
      chrome.browserAction.setPopup({ popup: '../option.html', tabId });
      chrome.browserAction.setIcon({ path: '../icons/icon_32.png', tabId });
      getAndUpdate();
      console.log('onActivated website');
    } else {
      chrome.browserAction.setPopup({ popup: '', tabId });
      chrome.browserAction.setIcon({ path: '../icons/icon_32_disabled.png', tabId });
      console.log('onActivated unmatched');
    }
  });
});

// when the tab is updated (moving to different page)
chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
  const { url } = tab
  console.log('onUpdated', url)
  if (url == undefined){
    chrome.browserAction.setPopup({ popup: '', tabId });
    console.log('onUpdated null');
    return null;
  } else if(checkUrl(url, 1)) {
    chrome.browserAction.setPopup({ popup: '../option.html', tabId });
    chrome.browserAction.setIcon({ path: '../icons/icon_32.png', tabId });
    console.log('onUpdated true');
  } else if(checkUrl(url, 2)) {
    chrome.browserAction.setPopup({ popup: '../option.html', tabId });
    chrome.browserAction.setIcon({ path: '../icons/icon_32.png', tabId });
    console.log('onUpdated website');
  } else {
    chrome.browserAction.setPopup({ popup: '', tabId });
    chrome.browserAction.setIcon({ path: '../icons/icon_32_disabled.png', tabId });
    console.log('onUpdated false');
  }
});

// -----UPDATE STORAGE-----

function updateItems(newItem) {
  chrome.storage.sync.get(['items'], function (result) {
    let { items } = result
    if (!items) items = []
    removedItems = items.filter(item => item._id !== newItem._id)
    updated = [newItem, ...removedItems]

    chrome.storage.sync.set({ items: updated }, function () {
      if (updated.length > 0) chrome.runtime.sendMessage({ action: 'displayTable' });
      else console.log('error @ update items background.js')
    })
  })
};

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
    .fail((err) => {
        console.log('PUT err', err)
    })
  }
};

function pushNotification(objectData) {
  const { name, currentPrice, targetPrice } = objectData
  let title = 'The price has changed!'
  let messsage = `The price of ${name} has changed to ${currentPrice}`
  if (targetPrice) {
    title = 'The price has reached your target'
    messsage = `The current price of ${name} is ${currentPrice}`
  }
  let notifOptions = {
    type: 'basic',
    title,
    message,
    iconUrl: '../icons/icon_32.png'
  }
  chrome.notifications.create(notifOptions)
}


