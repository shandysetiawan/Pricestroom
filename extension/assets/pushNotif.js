let options = {
    type: 'basic',
    title: 'Open Extension',
    message: 'Extension is active',
    iconUrl: '../icons/icon_32.png'
}

chrome.notifications.create(options, callback)

function callback() {
    console.log(options)
}