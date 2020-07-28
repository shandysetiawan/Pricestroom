// listener from background.js
chrome.runtime.onMessage.addListener(notify);

function notify(message) {
  switch (message.action) {
    case 'displayTable':
      displayTable()
      break;  
    default:
      console.log('listened but not message')
      break;
  }
};

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
  currentUrl = document.URL;
  if (currentUrl.indexOf("?") > 0) currentUrl = currentUrl.substring(0, currentUrl.indexOf("?"));

  if (currentUrl.search("www.tokopedia.com") > 0) {
    // DOM cannot be passed to extension directly
    let imgDOMs = document.getElementsByTagName("img");
    imageUrl = String(imgDOMs[1].src);

    /* -----TOKOPEDIA----- */
    let imageElement, storeNameElement, priceElement, stockElement, nameElement;

    if (currentUrl.search("www.tokopedia.com") > 0) {

      imageElement = "[data-testid='PDPImageMain']";
      priceElement = "[data-testid='lblPDPDetailProductPrice']"; // lblPDPFooterTotalHargaProduk
      nameElement = "[data-testid='lblPDPDetailProductName']";
      stockElement = "[data-testid='lblPDPDetailProductStock']";
      storeNameElement = "[data-testid='llbPDPFooterShopName']";

    } 

    price = document.querySelectorAll(priceElement)[0].textContent;
    name = document.querySelectorAll(nameElement)[0].textContent;
    stock = document.querySelectorAll(stockElement)[0].textContent;
    storeName = document.querySelectorAll(storeNameElement)[0].textContent;

    return { url: currentUrl, imageUrl, price, storeName, stock, name };

    /* -----BUKALAPAK----- */
  } else if (currentUrl.search("bukalapak.com") > 0) {

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
  const { _id } = object
  return $(`#setting${ _id }`).click(function () {
    prepareSetting(object)
    toOptionsPage()
  })
};

function buildDelete(object) {
  let { _id } = object;
  return $(`#delete${ object._id }`).click(function () {
    $.ajax({
      method: "DELETE",
      url: `${url}/${_id}`,
    })
      .done((response) => {
          deleteItem(_id)
      })
      .done(_=> getAndUpdate())
      .fail((err) => {
          console.log('DELETE err', err)
      })
  });
};

async function deleteItem(itemId) {
  chrome.storage.sync.get(['items'], function (result) {
    let { items } = result
    removedItems = items.filter(item => item._id !== itemId)
    chrome.storage.sync.set({ items: removedItems })
  })
};

// items Set & Get

function checkExistingItems(stringUrl, array) {
  const isNotExisting = (item) => item.url !== stringUrl
  if (array) return array.every(isNotExisting)
  else return false
};

function updateItems(newItem) {
  chrome.storage.sync.get(['items'], function (result) {
    let { items } = result
    removedItems = items.filter(item => item._id !== newItem._id)
    updated = [newItem, ...removedItems]

    chrome.storage.sync.set({ items: updated }, function () {
      if (updated.length > 0) displayTable()
      else console.log('error @ update items')
    })
  })
};

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
              method: 'POST',
              url, // from getProducts.js
              data
            })
              .done(response => {
                $('#MainTableBody').empty()
                let { data } = response
                let newItems = [...items, data]
  
                chrome.storage.sync.set({ items: newItems }, function () {
                  if (newItems.length > 0) displayTable()
                  else console.log('error @ set items')
                })
                prepareSetting(data)  // from optionScript.js
              })
              .done(_ => {
                toOptionsPage() // from optionScript.js
              })
              .fail(err =>                console.error(err))
  
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
// $("#ClearButton").click(function () {
//   chrome.storage.sync.set({ items: [] })
//   displayTable();
// })

/* ----- chrome.storage SET & GET -----
  chrome.storage.sync.set({ data }, function() {
    console.log('Data is set to ' + data);
  });
  chrome.storage.sync.set({ newData: 'newData' }, function() {
    console.log('Data is set to ' + data);
  });
*/
