let url = 'http://localhost:3001/tracks';

chrome.alarms.create('getCurrentPrices', {
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener((alarmInfo) => {
  console.log(alarmInfo)
  $.ajax({
    method: 'get',
    url,
  }).done(data => console.log('alarm', alarmInfo, data))
    .fail(err => console.log('err', alarmInfo, err))
});

// chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
//   console.log(tabs[0].url);
// });

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
        stringUrl.search("localhost:4000") > 0 ||
        stringUrl.search("localhost:3000") > 0
        ) return true
        else return false
    default: return false
  }
}

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
      // call function in actionScript
    } else if(checkUrl(url, 2)) {
      chrome.browserAction.setPopup({ popup: '../option.html', tabId });
      chrome.browserAction.setIcon({ path: '../icons/icon_32.png', tabId });
      console.log('onActivated website');
      // chrome.runtime.sendMessage({ url: 'ada url' });
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
    // call function in actionScript
  } else if(checkUrl(url, 2)) {
    chrome.browserAction.setPopup({ popup: '../option.html', tabId });
    chrome.browserAction.setIcon({ path: '../icons/icon_32.png', tabId });
    chrome.tabs.sendMessage(tabId, { type: 'background', activateStatusUpdate: true });
    chrome.runtime.sendMessage({
      message: 'background',
      data: {
        content: 'delivered'
      }
    })
    console.log('onUpdated website');
  } else {
    chrome.browserAction.setPopup({ popup: '', tabId });
    chrome.browserAction.setIcon({ path: '../icons/icon_32_disabled.png', tabId });
    console.log('onUpdated false');
  }
});

