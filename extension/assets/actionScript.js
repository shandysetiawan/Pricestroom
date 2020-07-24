// This function will have access to browser DOM
function searcDOM() {
  console.log('Tab script:', document.body);
  let currentUrl, imageUrl, storeName, price, stock, name;

  // We can play with DOM or validate URL here
  currentUrl = document.URL;

  if (currentUrl.search("tokopedia.com") > 0 || currentUrl.search("bukalapak.com") > 0) {
    if (currentUrl.indexOf("?") > 0) currentUrl = currentUrl.substring(0, currentUrl.indexOf("?"))
    console.log('currentUrl', currentUrl)          

    // DOM cannot be passed to extension directly
    let imgDOMs = document.getElementsByTagName("img")
    if (currentUrl.search("tokopedia.com") > 0) imageUrl = String(imgDOMs[1].src)
    else if (currentUrl.search("bukalapak.com") > 0) imageUrl = String(imgDOMs[4].src)
    console.log('imageUrl', imageUrl)

    const priceDataTestIdElement = "[data-testid='lblPDPDetailProductPrice']"; // lblPDPFooterTotalHargaProduk
    const nameDataTestIdElement = "[data-testid='lblPDPDetailProductName']";
    const stockDataTestIdElement = "[data-testid='lblPDPDetailProductStock']";
    const storeDataTestIdElement = "[data-testid='llbPDPFooterShopName']";

    let nameDOMs = document.getElementsByTagName("h1")
    name = nameDOMs[0].textContent;

    let DOMS = document.getElementsByTagName("h3")
    price = DOMS[0].textContent;

    stock = document.querySelectorAll(stockDataTestIdElement)[0].innerText;
    storeName = document.querySelectorAll(storeDataTestIdElement)[0].innerText;
    console.log(price)
    console.log(name)
    console.log(stock)
    console.log(storeName)

    return { url: currentUrl, imageUrl, price, storeName, stock, name };
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
      const data = response[0]
      console.log('actionScript', data);
      $.ajax({
        method: 'post',
        url,
        data
      })
        .done(data => console.log('POST done', data))
        .fail(err => console.log('POST err', err))
      $('#previewImage').attr("src", data.imageUrl);
    }
  });

});
