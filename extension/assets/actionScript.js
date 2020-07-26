// This function will have access to browser DOM
function searcDOM() {
  console.log('Tab script:', document.body);
  let currentUrl, imageUrl, storeName, price, stock, name;

  // We can play with DOM or validate URL here
  // and remove queries from URL
  currentUrl = document.URL;
  if (currentUrl.indexOf("?") > 0) currentUrl = currentUrl.substring(0, currentUrl.indexOf("?"));

  if (currentUrl.search("tokopedia.com") > 0) {
    // DOM cannot be passed to extension directly
    let imgDOMs = document.getElementsByTagName("img");
    imageUrl = String(imgDOMs[1].src);

    // let nameDOMs = document.getElementsByTagName("h1")
    // name = nameDOMs[0].textContent;

    // let DOMS = document.getElementsByTagName("h3")
    // price = DOMS[0].textContent;

    /* -----TOKOPEDIA----- */
    let imageElement, storeNameElement, priceElement, stockElement, nameElement;
    
    if (currentUrl.search("www.tokopedia.com") > 0) {

      imageElement = "[data-testid='PDPImageMain']";
      priceElement = "[data-testid='lblPDPDetailProductPrice']"; // lblPDPFooterTotalHargaProduk
      nameElement = "[data-testid='lblPDPDetailProductName']";
      stockElement = "[data-testid='lblPDPDetailProductStock']";
      storeNameElement = "[data-testid='llbPDPFooterShopName']";

    } else if (currentUrl.search("m.tokopedia.com") > 0) {
      
      imageElement = "[data-testid='pdpImage']";
      priceElement = "[data-testid='pdpProductPrice']";
      nameElement = "[data-testid='pdpProductName']"; // data-testid="pdpProductName"
      stockElement = "[data-testid='pdpStockInfo']";
      storeNameElement = "[data-testid='pdpShopName']";

    }

    priceDocument = document.querySelectorAll(priceElement)[0]
    nameDocument = document.querySelectorAll(nameElement)[0]
    stockDocument = document.querySelectorAll(stockElement)[0]
    storeNameDocument = document.querySelectorAll(storeNameElement)[0]

    price = priceDocument.textContent || priceDocument.innerText;
    name = nameDocument.textContent || nameDocument.innerText;
    stock = stockDocument.textContent || stockDocument.innerText;
    storeName = storeNameDocument.textContent || storeNameDocument.innerText;
    
    // name = document.querySelectorAll(nameElement)[0].textContent;
    // stock = document.querySelectorAll(stockElement)[0].textContent;
    // storeName = document.querySelectorAll(storeNameElement)[0].textContent;

    console.log('currentUrl TP', currentUrl)
    console.log('imageUrl TP', imageUrl)
    console.log('name TP', name)
    console.log('price TP', price)
    console.log('stock TP', stock)
    console.log('storeName TP', storeName)

    return { url: currentUrl, imageUrl, price, storeName, stock, name };

    /* -----BUKALAPAK----- */
  } else if (currentUrl.search("bukalapak.com") > 0) {
    // imageUrl = String(imgDOMs[4].src);
    // let scriptString = $(`${scriptElement}`)[1].children[0].data;

    let scriptElement = 'script[type="application/ld+json"]';
    let scripts = document.querySelectorAll(scriptElement)
    let scriptObject = JSON.parse(scripts[2].innerText)
    if (currentUrl.search("m.bukalapak") > 0) scriptObject = JSON.parse(scripts[1].innerText)
    let { image, url, offers } = scriptObject
    let { lowPrice, seller, offerCount } = offers
    imageUrl = image
    currentUrl = url
    name = scriptObject.name
    price = lowPrice
    storeName = seller.name
    stock = offerCount

    console.log('currentUrl BL', currentUrl)
    console.log('imageUrl BL', imageUrl)
    console.log('name BL', name)
    console.log('price BL', price)
    console.log('stock BL', stock)
    console.log('storeName BL', storeName)

    return { url: currentUrl, imageUrl, price, storeName, stock, name };
  } else {
    return false;
  }
};

const appendNotProductPage = `
<p>Wait for the page to fully load</p>
<p class='small'>
  Note: currently our service is 
  <br> only available on specific product site
  <br> of tokopedia.com or bukalapak.com
</p>`;

// The following function will have access to extension
// We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
// argument here is a string but function.toString() returns function's code
chrome.tabs.executeScript({ code: '(' + searcDOM + ')();' },
  (response) => {
  console.log('Popup onActivated script:');
  $('#previewImage').attr("src", "");

  $('#notFound').empty();
  if (!response || !response[0]) {
    $('#TrackProduct').attr("disabled", true);
    $('#notFound').append(
      appendNotProductPage
    );
  } else {
    $('#TrackProduct').attr("disabled", false);
    $('#previewImage').attr("src", response[0].imageUrl);
  }
});

  /* ----- chrome.storage SET & GET -----
    chrome.storage.sync.set({ data }, function() {
      console.log('Data is set to ' + data);
    });
    chrome.storage.sync.set({ newData: 'newData' }, function() {
      console.log('Data is set to ' + data);
    });
  */

$("#TrackProduct").click(function() {
  chrome.tabs.executeScript({ code: '(' + searcDOM + ')();' }, (response) => {
    console.log('Popup script:');
    $('#previewImage').attr("src", "");
    $('#MainTableBody').empty();
    $('#notFound').empty();
    
    if (!response || !response[0]) {
      $('#notFound').append(
        appendNotProductPage
      );
    } else {
      const data = response[0]
      console.log('actionScript', data);
      $.ajax({
        method: 'post',
        url, // from getProducts.js
        data
      })
        .done(item => {
          console.log('POST done', item.data)
          prepareSetting(item.data)  // from optionScript.js
        })
        .done(_=> {
          toOptionsPage()  // from optionScript.js
        })
        .fail(err => {
          console.log('POST err', err)
        })

      $('#previewImage').attr("src", data.imageUrl);

      // get chrome.storage
      chrome.storage.sync.get(['newData', 'data'], function (result) {
        let { data, newData } = result; // const
        if (data) data.map(item => {
          let { poduct_name, current_price, target_price } = item
          $('#MainTableBody').append(
            `<tr>
            <td>${ poduct_name}</td>
            <td class="text-right">${ current_price}</td>
            <td class="text-right">${ target_price}</td>
          </tr>`
          );
        })
        if (!data) data = 'empty chrome.storage.data'
        console.log('data', data)
        console.log('newData', newData);
      });

    }

  })
  
});
