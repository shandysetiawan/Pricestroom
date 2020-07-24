// This function will have access to browser DOM
function searcDOM() {
  console.log('Tab script:');
  let currentUrl, imageUrl, price, storeName;

  // We can play with DOM or validate URL here
  currentUrl = document.URL;

  if (currentUrl.search("tokopedia") > 0 || currentUrl.search("bukalapak") > 0) {
    if (currentUrl.indexOf("?") > 0) currentUrl = currentUrl.substring(0, currentUrl.indexOf("?"))
    console.log('currentUrl', currentUrl)          

    // DOM cannot be passed to extension directly
    let imgDOMs = document.getElementsByTagName("img")
    if (currentUrl.search("tokopedia") > 0) imageUrl = String(imgDOMs[1].src)
    else if (currentUrl.search("bukalapak") > 0) imageUrl = String(imgDOMs[4].src)
    console.log('imageUrl', imageUrl)

    return { url: currentUrl, imageUrl, price, storeName };
  } else {
    return false;
  }
};

// The following function will have access to extension
// We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
// argument here is a string but function.toString() returns function's code
chrome.tabs.executeScript({ code: '(' + searcDOM + ')();' },
  (response) => {
    console.log('Popup script:');

    $('#previewImage').attr("src", "");
    $('#notFound').empty();
    if (!response[0]) {
    $('#TrackProduct').attr("disabled", true);
    $('#notFound').append("Sorry, currently our service is not available for this site.");
    } else {
      $('#TrackProduct').attr("disabled", false);
      $('#previewImage').attr("src", response[0].imageUrl);
    }
});

$("#TrackProduct").click(function() {
  chrome.tabs.executeScript({ code: '(' + searcDOM + ')();' },
  (response) => {
    console.log('Popup script:');

    $('#previewImage').attr("src", "");
    $('#notFound').empty();
    if (!response[0]) {
    $('#notFound').append("Sorry, currently our service is not available for this site.");
    } else {
      console.log('response', response[0]);
      $('#previewImage').attr("src", response[0].imageUrl);
    }
  });

});
