// This function will have access to browser DOM
function searcDOM() {
  console.log('Tab script:', document.body);
  let currentUrl, imageUrl, storeName, price, stock, name;

  // We can play with DOM or validate URL here
  currentUrl = document.URL;

  if (currentUrl.search("tokopedia.com") > 0 || currentUrl.search("bukalapak.com") > 0) {
    if (currentUrl.indexOf("?") > 0) currentUrl = currentUrl.substring(0, currentUrl.indexOf("?"))

    // DOM cannot be passed to extension directly
    let imgDOMs = document.getElementsByTagName("img")

    /* -----TOKOPEDIA----- */
    if (currentUrl.search("tokopedia.com") > 0) {
      imageUrl = String(imgDOMs[1].src)
      
      let imageElement, storeNameElement, priceElement, stockElement, nameElement;
      imageElement = "[data-testid='PDPImageMain']";
      priceElement = "[data-testid='lblPDPDetailProductPrice']"; // lblPDPFooterTotalHargaProduk
      nameElement = "[data-testid='lblPDPDetailProductName']";
      stockElement = "[data-testid='lblPDPDetailProductStock']";
      storeNameElement = "[data-testid='llbPDPFooterShopName']";

      price = document.querySelectorAll(priceElement)[0].textContent
      name = document.querySelectorAll(nameElement)[0].textContent
      stock = document.querySelectorAll(stockElement)[0].textContent
      storeName = document.querySelectorAll(storeNameElement)[0].textContent

      // let nameDOMs = document.getElementsByTagName("h1")
      // name = nameDOMs[0].textContent;

      // let DOMS = document.getElementsByTagName("h3")
      // price = DOMS[0].textContent;

    /* -----BUKALAPAK----- */
    } else if (currentUrl.search("bukalapak.com") > 0) {
      imageUrl = String(imgDOMs[4].src);
      scriptElement = 'script[type="application/ld+json"]';
      // let siteDataStr = $(`${scriptElement}`)[1].children[0].data;
      let scripts = document.querySelectorAll(scriptElement)
      let scriptObject = JSON.parse(scripts[2].innerText)
      let { image, url, offers } = scriptObject
      let { lowPrice, seller, offerCount } = offers
      imageUrl = image
      currentUrl = url
      name = scriptObject.name
      price = lowPrice
      storeName = seller.name
      stock = offerCount
    }

    console.log('currentUrl', currentUrl)
    console.log('imageUrl', imageUrl)    
    console.log('name', name)
    console.log('price', price)
    console.log('stock', stock)
    console.log('storeName', storeName)

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
