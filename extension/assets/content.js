// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log('content msg', msg)
  // If the received message has the expected format...
  if (msg.greeting === 'hello') {
    // Call the specified callback, passing
    // the web-page's DOM content as argument
    sendResponse(document.all[0].outerHTML);
  }
});

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log('content response', response);
});