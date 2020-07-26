// This function will have access to browser DOM
function searcDOM() {
  console.log('Tab script:', document.body);
  let currentUrl, imageUrl, storeName, price, stock, name;

  // We can play with DOM or validate URL here
  // and remove queries from URL
  currentUrl = document.URL;
  if (currentUrl.indexOf("?") > 0) currentUrl = currentUrl.substring(0, currentUrl.indexOf("?"));

  if (currentUrl.search("www.tokopedia.com") > 0) {
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

    } /* else if (currentUrl.search("m.tokopedia.com") > 0) {
      
      imageElement = "[data-testid='pdpImage']";
      priceElement = "[data-testid='pdpProductPrice']";
      nameElement = "[data-testid='pdpProductName']"; // data-testid="pdpProductName"
      stockElement = "[data-testid='pdpStockInfo']";
      storeNameElement = "[data-testid='pdpShopName']";

    } */

    price = document.querySelectorAll(priceElement)[0].textContent;
    name = document.querySelectorAll(nameElement)[0].textContent;
    stock = document.querySelectorAll(stockElement)[0].textContent;
    storeName = document.querySelectorAll(storeNameElement)[0].textContent;

    /*
    price = priceDocument.textContent || priceDocument.innerText;
    name = nameDocument.textContent || nameDocument.innerText;
    stock = stockDocument.textContent || stockDocument.innerText;
    storeName = storeNameDocument.textContent || storeNameDocument.innerText;
    */

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

const appendProductCreated = `
<p>Product has been successfully added to our tracker</p>
<p class='small'>
  You can modify the notification settings
</p>`;

const appendProductExceeded = `
<p>You are tracking too many products</p>
<p class='small'>
  Please consider deleting other product(s)
  if you really want to track this product
</p>`;

const appendProductExisted = `
<p>You have already tracked this product</p>
<p class='small'>
  You are not allowed to track
  the same product at the same time
</p>`;

function checkExistingItems(stringUrl, array) {
  const isNotExisting = (item) => item.url !== stringUrl
  return array.every(isNotExisting)
};


$("#ClearButton").click(function () {
  chrome.storage.sync.set({ items: [] })
})

$("#TrackProduct").click(function () {
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
      const data = response[0];
      // check jumlah items
      chrome.storage.sync.get(['items'], function (result) {
        let { items } = result
        console.log('getItems', items)
        if (items.length >= 5) {
          $('#notFound').append(
            appendProductExceeded
          );
          console.log('Sudah ada lima tidak boleh lebih jangan serakah')
        } else {
          console.log('actionScript', data);

          if (checkExistingItems(data.url, items)) {
            $.ajax({
              method: 'post',
              url, // from getProducts.js
              data
            })
              .done(response => {
                console.log('POST done', response)
                let { data, message } = response
                console.log(message)
                // get chrome.storage
                let newItems = [...items, data]
                console.log('newItems', newItems)
  
                chrome.storage.sync.set({ items: newItems }, function () {
                  if (newItems.length > 0) {
                    newItems.map(item => {
                      let { name, imageUrl, currentPrice, targetPrice } = item
                      $('#MainTableBody').append(
                        `<tr>
                            <td><img src="${imageUrl}" class="tableImage" alt="${name}"></td>
                            <td class="text-right">${ currentPrice}</td>
                            <td class="text-right">${ targetPrice}</td>
                            <td>E & D</td>
                          </tr>`
                      );
                    })
                  } else console.log('error @ set items')
                })  
                prepareSetting(data)  // from optionScript.js
              })
              .done(_ => {
                toOptionsPage() // from optionScript.js
              })
              .fail(err => {
                console.log('POST err', err)
              })
  
            $('#notFound').append(
              appendProductCreated
            );
          } else {
            $('#notFound').append(
              appendProductExisted
            );
          }
        }
      })



    }

  })

});
