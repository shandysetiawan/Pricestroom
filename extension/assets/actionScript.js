// listener from background.js
console.log('no event')


// chrome.runtime.onMessage.addListener(notify)

// function notify(message) {
//   console.log(message)
// }

// This function will have access to browser DOM
function searcDOM() {
  console.log('Tab script:', document.body);
  let currentUrl, imageUrl, storeName, price, stock, name;

  // send data to website
  chrome.storage.sync.get(['items'], function (result) {
    let { items } = result
    document.dispatchEvent( new CustomEvent('csEvent', {detail: items}))
  })
  
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

// messages

const appendNotProductPage = `
<p>Wait for the page to fully load</p>
<p class='small'>
  Note: currently our service
  <br> is only available on specific product site
  <br> of tokopedia.com or bukalapak.com
</p>`;

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

// The following function will have access to extension
// We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
// argument here is a string but function.toString() returns function's code
chrome.tabs.executeScript({ code: '(' + searcDOM + ')();' },
  (response) => {
    console.log('Popup onActivated script:');
    $('#previewImage').attr("src", "");

    $('#mainMessage').empty();
    if (!response || !response[0]) {
      $('#TrackProduct').attr("disabled", true);
      $('#mainMessage').append(
        appendNotProductPage
      );
    } else {
      let data = response[0]
      chrome.storage.sync.get(['items'], function (result) {
        let { items } = result      
        if (checkExistingItems(data.url, items)) {
          $('#TrackProduct').attr("disabled", false)
          $('#previewImage').attr("src", response[0].imageUrl);
        } else {
          $('#TrackProduct').attr("disabled", true)
          $('#previewImage').attr("src", "");
          $('#mainMessage').append(
            appendProductExisted
          );
        }
      })
    }
});

/* Display Table and Temporary Variables */
let setOptions0, setOptions1, setOptions2, setOptions3, setOptions4;
let delete0, delete1, delete2, delete3, delete4;

displayTable();
function displayTable(data = 'items') {
  $('#MainTableBody').empty()
  chrome.storage.sync.get([data], function (result) {
    let items = result[data]
    if (!items) items = []
    items.map((item, idx) => {
      let { _id, name, imageUrl, currentPrice, targetPrice } = item
      console.log(name, targetPrice)
      $('#MainTableBody').append(
        `<tr>
            <td class="products"><img src="${imageUrl}" class="tableImage" alt="${name}"></td>
            <td class="text-right">${ currentPrice }</td>
            <td class="text-right">${ targetPrice || '-' }</td>
            <td class="options">
              <i id="setting${ _id }" class="icon icon-cog-circled">
                <span class="tooltiptext">Modify setting</span>
              </i>
              <i id="delete${ _id }" class="icon icon-trash">
                <span class="tooltiptext">Delete product</span>
              </i>
            </td>
          </tr>`
      );
      if (idx === 0) {
        setOptions0 = buildSetting(item)
        delete0 = buildDelete(item)
      } else if (idx === 1) {
        setOptions1 = buildSetting(item)
        delete1 = buildDelete(item)
      } else if (idx === 2) {
        setOptions2 = buildSetting(item)
        delete2 = buildDelete(item)
      } else if (idx === 3) {
        setOptions3 = buildSetting(item)
        delete3 = buildDelete(item)
      } else if (idx === 4) {
        setOptions4 = buildSetting(item)
        delete4 = buildDelete(item)
      }
    })
  })
};

function buildSetting(object) {
  return $(`#setting${ object._id }`).click(function () {
    prepareSetting(object)
    toOptionsPage()
    console.log('edit', object)
    });
}

function buildDelete(object) {
  return $(`#delete${ object._id }`).click(function () {
    console.log('delete', object)
    });
};

// items Set & Get

function checkExistingItems(stringUrl, array) {
  const isNotExisting = (item) => item.url !== stringUrl
  return array.every(isNotExisting)
};

function updateItems(newItem) {
  chrome.storage.sync.get(['items'], function (result) {
    let { items } = result
    removedItems = items.filter(item => item._id !== newItem._id)
    console.log(removedItems)
    console.log('newItem', newItem)
    updated = [newItem, ...removedItems]
    console.log(updated)

    chrome.storage.sync.set({ items: updated }, function () {
      if (updated.length > 0) displayTable()
      else console.log('error @ update items')
    })
  })

};

chrome.storage.onChanged.addListener(function(changes, namespace) {
  console.log(changes.items)
});

$("#TrackProduct").click(function () {
  chrome.tabs.executeScript({ code: '(' + searcDOM + ')();' }, (response) => {
    console.log('Popup script:');
    $('#previewImage').attr("src", "");
    $('#mainMessage').empty();

    if (!response || !response[0]) {
      $('#mainMessage').append(
        appendNotProductPage
      );
    } else {
      const data = response[0];
      // check jumlah items
      chrome.storage.sync.get(['items'], function (result) {
        let { items } = result
        console.log('getItems', items)
        if (!items) items = []
        if (items.length >= 5) {
          $('#mainMessage').append(
            appendProductExceeded
          );
        } else {
          if (checkExistingItems(data.url, items)) {
            $.ajax({
              method: 'post',
              url, // from getProducts.js
              data
            })
              .done(response => {
                $('#MainTableBody').empty()
                console.log('POST done', response)
                let { data, message } = response
                console.log('message', message)

                let newItems = [...items, data]
                console.log('newItems', newItems)
  
                chrome.storage.sync.set({ items: newItems }, function () {
                  if (newItems.length > 0) displayTable()
                  else console.log('error @ set items')
                })
                prepareSetting(data)  // from optionScript.js
              })
              .done(_ => {
                toOptionsPage() // from optionScript.js
              })
              .fail(err => {
                console.log('POST err', err)
              })
  
            $('#mainMessage').append(
              appendProductCreated
            );
          } else {
            $('#mainMessage').append(
              appendProductExisted
            );
          }
        }
      })

    }

  })

});

// helpers
$("#ClearButton").click(function () {
  chrome.storage.sync.set({ items: [] })
  displayTable();
})

/* ----- chrome.storage SET & GET -----
  chrome.storage.sync.set({ data }, function() {
    console.log('Data is set to ' + data);
  });
  chrome.storage.sync.set({ newData: 'newData' }, function() {
    console.log('Data is set to ' + data);
  });
*/