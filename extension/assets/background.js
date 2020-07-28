// let url = 'http://localhost:3001/tracks';
let url = 'http://52.74.0.232:3001/tracks'; //AWS Shandy
// let url = 'http://13.229.109.104:3001/tracks'; //AWS Zul
// let url = 'https://gentle-lake-46054.herokuapp.com/tracks';

chrome.alarms.create('getCurrentPrices', {
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener((alarmInfo) => {
  $.ajax({
    method: 'get',
    url,
    headers: {
      dataitem: '["5f1fa5f1dc956c20df19183f","5f1fac1565b98821a9960def"]',
    }
  }).done(data => console.log('alarm', alarmInfo, data))
    .fail(err => console.log('err', alarmInfo, err))
});

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
      console.log('onActivated matched');
    } else if(checkUrl(url, 2)) {
      chrome.browserAction.setPopup({ popup: '../option.html', tabId });
      chrome.browserAction.setIcon({ path: '../icons/icon_32.png', tabId });
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

// chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
//   console.log(tabs[0].url);
// });

function updateItems(newItem) {
  chrome.storage.sync.get(['items'], function (result) {
    let { items } = result
    removedItems = items.filter(item => item._id !== newItem._id)
    updated = [newItem, ...removedItems]
    console.log('background updated', updated)

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

chrome.storage.sync.get(['items'], function(result) {
  let {items} = result
  items.forEach(el => checkNotification(el))
});
